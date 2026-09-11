import { after } from 'next/server'
import { z } from 'zod'

import { normalize } from '@/lib/geoscan/normalize'
import { runScan, scanDisponible } from '@/lib/geoscan/engine'
import { getPayloadClient } from '@/lib/payload'
import { RATE_LIMITS, consumeRateLimit } from '@/lib/rate-limit'
import { checkAntiBot, getClientIp, jsonError, readJson } from '@/lib/request'
import { antiBotSchema, metierSchema, villeSchema } from '@/lib/validation'

/**
 * Lancement d'un scan de visibilite IA.
 *
 * Portage de DGLGS_Ajax::handle_start : deux tests par adresse IP et
 * par jour, scan mutualise par couple metier + ville tant qu'il n'est
 * pas expire, quota hebdomadaire global, puis execution en arriere plan
 * par after().
 */

/** Le scan continue apres la reponse : la fonction doit rester vivante. */
export const maxDuration = 300

/** Duree de vie d'un scan mutualise, en jours (reglage cache_days). */
const CACHE_JOURS = 7

/** Messages renvoyes au visiteur, repris du plugin WordPress. */
const MESSAGES = {
  tropDeTests:
    'Trop de tests depuis votre connexion. Réessayez demain, ou contactez-nous directement.',
  champsManquants: 'Veuillez remplir les trois champs (entreprise, métier, ville).',
  saisieInvalide: 'Métier ou ville invalide : utilisez uniquement des lettres.',
  quotaSemaine:
    'Le quota de tests de la semaine est atteint. Revenez dans quelques jours, ou contactez-nous directement.',
  indisponible: "Le test de visibilité IA est temporairement indisponible.",
  erreur: 'Le lancement a échoué. Réessayez dans un instant.',
} as const

/**
 * Nom d'entreprise : deux a cent vingt caracteres, memes bornes que le
 * plugin. Le jeu de caracteres reste large (chiffres, esperluette,
 * point), une enseigne n'etant pas un patronyme.
 */
const entrepriseSchema = z
  .string({ message: MESSAGES.champsManquants })
  .trim()
  .min(2, MESSAGES.champsManquants)
  .max(120, MESSAGES.champsManquants)

const bodySchema = antiBotSchema.extend({
  entreprise: entrepriseSchema,
  metier: metierSchema.refine(
    (valeur) => /^[\p{L}0-9\s'\-&.]+$/u.test(valeur),
    MESSAGES.saisieInvalide,
  ),
  ville: villeSchema.refine(
    (valeur) => /^[\p{L}0-9\s'-]+$/u.test(valeur),
    MESSAGES.saisieInvalide,
  ),
})

export async function POST(request: Request): Promise<Response> {
  const corps = await readJson(request, bodySchema)
  if (!corps.ok) return jsonError(corps.message, 400)

  // Seul le pot de miel s'applique au lancement : le piege temporel est
  // reserve aux formulaires de lead, comme sur WordPress.
  const antiBot = checkAntiBot({ website: corps.data.website })
  if (!antiBot.ok) {
    return Response.json({ ok: true, fake: true })
  }

  if (!scanDisponible()) {
    return jsonError(MESSAGES.indisponible, 503)
  }

  const ip = getClientIp(request)
  const [limite, fenetre] = RATE_LIMITS['geo:start']
  const quota = await consumeRateLimit(`geo:start:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeTests },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const { entreprise, metier, ville } = corps.data
  const metierNorm = normalize(metier)
  const villeNorm = normalize(ville)

  const payload = await getPayloadClient()
  const maintenant = new Date()

  let scanId: string | null = null

  // 1. Scan mutualise : meme metier, meme ville, non expire.
  try {
    const actifs = await payload.find({
      collection: 'scans',
      where: {
        and: [
          { metierNorm: { equals: metierNorm } },
          { villeNorm: { equals: villeNorm } },
          { status: { in: ['queued', 'running', 'done'] } },
          { expiresAt: { greater_than: maintenant.toISOString() } },
        ],
      },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })
    scanId = actifs.docs[0]?.id ?? null
  } catch (erreur) {
    console.error('[geoscan/start] lecture du cache impossible :', erreur)
  }

  // 2. Aucun scan reutilisable : quota global puis creation.
  if (!scanId) {
    const [limiteSemaine, fenetreSemaine] = RATE_LIMITS['geo:quota:week']
    const quotaSemaine = await consumeRateLimit(
      'geo:quota:week',
      limiteSemaine,
      fenetreSemaine,
    )
    if (!quotaSemaine.ok) {
      return Response.json(
        { ok: false, error: MESSAGES.quotaSemaine },
        { status: 429, headers: { 'Retry-After': String(quotaSemaine.retryAfter) } },
      )
    }

    try {
      const scan = await payload.create({
        collection: 'scans',
        data: {
          metier,
          ville,
          metierNorm,
          villeNorm,
          status: 'queued',
          attempts: 0,
          coutCents: 0,
          expiresAt: new Date(
            maintenant.getTime() + CACHE_JOURS * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        depth: 0,
      })
      scanId = scan.id
    } catch (erreur) {
      console.error('[geoscan/start] scan non cree :', erreur)
      return jsonError(MESSAGES.erreur, 500)
    }

    const identifiant = scanId
    after(() => runScan(identifiant))
  }

  // 3. Run anonyme : l'entreprise testee vaut deja signal commercial.
  let runId = ''
  try {
    const run = await payload.create({
      collection: 'tool-runs',
      data: {
        tool: 'geoscan',
        statut: 'anonyme',
        entreprise,
        scan: scanId,
        ip,
      },
      depth: 0,
    })
    runId = run.id
  } catch (erreur) {
    console.error('[geoscan/start] run anonyme non enregistre :', erreur)
    return jsonError(MESSAGES.erreur, 500)
  }

  return Response.json({ ok: true, runId })
}
