import type { ZodType } from 'zod'

/** Duree minimale, en millisecondes, entre l'affichage du formulaire et l'envoi. */
const DELAI_MINIMUM_MS = 3000

/**
 * Adresse IP de l'appelant.
 *
 * Vercel renseigne x-forwarded-for (liste separee par des virgules, le
 * client reel en premier) ; x-real-ip sert de repli.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const premier = forwarded.split(',')[0]?.trim()
    if (premier) return premier
  }
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'inconnue'
}

/** Champs anti-bot communs a tous les formulaires du site. */
export interface AntiBotFields {
  /** Pot de miel : doit rester vide, il est masque visuellement. */
  website?: string | null
  /** Horodatage (ms) pose a l'affichage du formulaire. */
  ts?: number | string | null
}

/** Verdict de l'anti-bot. */
export type AntiBotVerdict =
  | { ok: true }
  | { ok: false; raison: 'honeypot' }
  | { ok: false; raison: 'trop-rapide' }

/**
 * Controle anti-bot : pot de miel puis piege temporel.
 *
 * Le pot de miel rempli doit etre traite comme un succes silencieux par
 * l'appelant (reponse 200 { ok: true, fake: true }, aucun traitement).
 */
export function checkAntiBot(body: AntiBotFields): AntiBotVerdict {
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return { ok: false, raison: 'honeypot' }
  }

  const ts = typeof body.ts === 'string' ? Number.parseInt(body.ts, 10) : body.ts
  if (typeof ts === 'number' && Number.isFinite(ts) && ts > 0) {
    if (Date.now() - ts < DELAI_MINIMUM_MS) {
      return { ok: false, raison: 'trop-rapide' }
    }
  }

  return { ok: true }
}

/** Resultat de la lecture d'un corps JSON valide. */
export type ReadJsonResult<T> = { ok: true; data: T } | { ok: false; message: string }

/**
 * Lit et valide le corps JSON d'une requete avec un schema zod.
 *
 * Les messages d'erreur sont renvoyes en francais, prets a etre affiches.
 */
export async function readJson<T>(
  req: Request,
  schema: ZodType<T>,
): Promise<ReadJsonResult<T>> {
  let brut: unknown
  try {
    brut = await req.json()
  } catch {
    return { ok: false, message: 'Requete invalide : corps JSON illisible.' }
  }

  const resultat = schema.safeParse(brut)
  if (!resultat.success) {
    const premier = resultat.error.issues[0]
    const champ = premier?.path.join('.')
    const message = premier?.message ?? 'Donnees invalides.'
    return { ok: false, message: champ ? `${champ} : ${message}` : message }
  }

  return { ok: true, data: resultat.data }
}

/** Reponse JSON d'erreur normalisee. */
export function jsonError(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status })
}
