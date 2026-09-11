import { sql } from '@payloadcms/db-postgres'

import { getPayloadClient } from './payload'

/** Verdict d'une consommation de quota. */
export interface RateLimitResult {
  /** false quand la limite est depassee : l'appelant doit repondre 429. */
  ok: boolean
  /** Nombre d'appels deja comptabilises dans la fenetre courante. */
  count: number
  /** Appels restants avant blocage (0 quand la limite est atteinte). */
  restant: number
  /** Fin de la fenetre courante. */
  resetAt: Date
  /** Secondes a attendre avant de reessayer (en-tete Retry-After). */
  retryAfter: number
}

/** Ligne renvoyee par la requete atomique. */
interface LigneRateLimit {
  count: number | string
  reset_at: string | Date
}

/**
 * Quotas utilises par les outils du site.
 *
 * Format : [limite, fenetre en secondes]. Les cles reelles sont
 * construites en suffixant l'adresse IP, sauf pour le quota global.
 */
export const RATE_LIMITS = {
  'ps:analyze': [20, 15 * 60],
  'ps:unlock': [5, 15 * 60],
  'roi:lead': [3, 15 * 60],
  'leads:audit': [5, 15 * 60],
  'geo:start': [2, 24 * 60 * 60],
  'geo:unlock': [5, 15 * 60],
  'geo:quota:week': [50, 7 * 24 * 60 * 60],
} as const satisfies Record<string, readonly [number, number]>

/** Convertit la colonne count (numeric Postgres, renvoyee en texte) en nombre. */
function versNombre(valeur: number | string): number {
  return typeof valeur === 'number' ? valeur : Number.parseInt(valeur, 10)
}

/**
 * Consomme une unite de quota pour une cle donnee.
 *
 * Une seule requete SQL atomique : INSERT ... ON CONFLICT (key) DO
 * UPDATE, qui remet le compteur a 1 quand la fenetre precedente est
 * expiree et l'incremente sinon. Les noms de colonnes (key, count,
 * reset_at, created_at, updated_at) sont ceux generes par l'adaptateur
 * Postgres pour la collection rate-limits (voir src/migrations).
 *
 * En cas d'echec de la requete atomique (adaptateur sans drizzle, base
 * non migree), un repli find + update est utilise : moins sur en cas
 * d'acces concurrents mais suffisant pour ne jamais bloquer un envoi.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const payload = await getPayloadClient()
  const maintenant = new Date()
  const nouvelleFin = new Date(maintenant.getTime() + windowSeconds * 1000)

  try {
    const resultat = (await payload.db.drizzle.execute(sql`
      INSERT INTO "rate_limits" ("key", "count", "reset_at", "created_at", "updated_at")
      VALUES (${key}, 1, ${nouvelleFin.toISOString()}, now(), now())
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "rate_limits"."reset_at" <= now() THEN 1
          ELSE "rate_limits"."count" + 1
        END,
        "reset_at" = CASE
          WHEN "rate_limits"."reset_at" <= now() THEN ${nouvelleFin.toISOString()}::timestamptz
          ELSE "rate_limits"."reset_at"
        END,
        "updated_at" = now()
      RETURNING "count", "reset_at"
    `)) as unknown as { rows?: LigneRateLimit[] }

    const ligne = resultat.rows?.[0]
    if (ligne) {
      return construire(versNombre(ligne.count), new Date(ligne.reset_at), limit, maintenant)
    }
  } catch (erreur) {
    console.error('[rate-limit] requete atomique indisponible, repli find + update', erreur)
  }

  // Repli non atomique.
  const existants = await payload.find({
    collection: 'rate-limits',
    where: { key: { equals: key } },
    limit: 1,
    depth: 0,
  })
  const existant = existants.docs[0]

  if (!existant) {
    await payload.create({
      collection: 'rate-limits',
      data: { key, count: 1, resetAt: nouvelleFin.toISOString() },
      depth: 0,
    })
    return construire(1, nouvelleFin, limit, maintenant)
  }

  const expiree = new Date(existant.resetAt).getTime() <= maintenant.getTime()
  const count = expiree ? 1 : (existant.count ?? 0) + 1
  const resetAt = expiree ? nouvelleFin : new Date(existant.resetAt)

  await payload.update({
    collection: 'rate-limits',
    id: existant.id,
    data: { count, resetAt: resetAt.toISOString() },
    depth: 0,
  })

  return construire(count, resetAt, limit, maintenant)
}

/** Assemble le verdict a partir du compteur et de la fin de fenetre. */
function construire(
  count: number,
  resetAt: Date,
  limit: number,
  maintenant: Date,
): RateLimitResult {
  const retryAfter = Math.max(
    1,
    Math.ceil((resetAt.getTime() - maintenant.getTime()) / 1000),
  )
  return {
    ok: count <= limit,
    count,
    restant: Math.max(0, limit - count),
    resetAt,
    retryAfter,
  }
}
