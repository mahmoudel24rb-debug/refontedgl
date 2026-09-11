import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'
import { RATE_LIMITS, consumeRateLimit } from '@/lib/rate-limit'
import { checkAntiBot, getClientIp, jsonError, readJson } from '@/lib/request'
import { antiBotSchema, urlSchema } from '@/lib/validation'
import {
  buildStrategyReport,
  type PageSpeedReport,
  type PsiResponse,
  type StrategyReport,
} from '@/site/tools/pagespeed/report'

/**
 * Analyse PageSpeed : deux appels PageSpeed Insights v5 en parallele
 * (mobile et ordinateur), mise en cache d'une heure par URL et creation
 * d'un run anonyme dans tool-runs.
 */

/** Les deux analyses Lighthouse peuvent depasser une minute. */
export const maxDuration = 120

/** Point d'entree de l'API Google. */
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

/** Delai maximal accorde a un appel PSI. */
const TIMEOUT_MS = 60_000

/** Duree de validite du cache par URL analysee. */
const CACHE_MS = 60 * 60 * 1000

/** Messages renvoyes au visiteur. */
const MESSAGES = {
  tropDeRequetes: 'Trop de requêtes. Réessayez dans quelques minutes.',
  echecLighthouse:
    "Google Lighthouse n'a pas pu analyser cette page. Le site est probablement protégé par un anti-bot.",
} as const

/** Phrase ajoutee au journal du run en cas d'echec (format WordPress). */
const NOTE_ANTIBOT =
  "Site probablement protege par un anti-bot : angle d'approche possible (le SEO en souffre aussi)."

const bodySchema = antiBotSchema.extend({ url: urlSchema })

/** Erreur PSI telle que renvoyee par l'API Google. */
interface ErreurPsi {
  error?: { message?: string }
}

/** Normalise l'URL servant de cle de cache (hote en minuscules, sans ancre). */
function normaliserUrl(url: string): string {
  const analysee = new URL(url)
  analysee.hash = ''
  analysee.hostname = analysee.hostname.toLowerCase()
  return analysee.toString()
}

/** Appelle PageSpeed Insights pour une strategie. */
async function analyser(
  url: string,
  strategy: 'mobile' | 'desktop',
): Promise<PsiResponse> {
  const params = new URLSearchParams({
    url,
    strategy,
    category: 'performance',
    locale: 'fr',
  })

  // Sans cle, l'API repond avec un quota reduit : suffisant pour quelques
  // tests, la cle reste obligatoire en production.
  const cle = process.env.GOOGLE_PSI_API_KEY
  if (cle) params.set('key', cle)

  const reponse = await fetch(`${PSI_URL}?${params.toString()}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })

  if (!reponse.ok) {
    let message = `Erreur ${reponse.status}`
    try {
      const erreur = (await reponse.json()) as ErreurPsi
      if (erreur.error?.message) message = erreur.error.message
    } catch {
      // Corps illisible : le code HTTP suffit.
    }
    throw new Error(message)
  }

  return (await reponse.json()) as PsiResponse
}

/** Enregistre un run en echec pour garder trace de l'URL tentee. */
async function enregistrerEchec(
  url: string,
  ip: string,
  message: string,
): Promise<void> {
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'tool-runs',
      data: {
        tool: 'pagespeed',
        statut: 'echec',
        url,
        ip,
        erreur: `ANALYSE ECHOUEE : Google Lighthouse n'a pas pu charger le site (${message})\n${NOTE_ANTIBOT}`,
      },
      depth: 0,
    })
  } catch (erreur) {
    console.error('[pagespeed] run en echec non enregistre :', erreur)
  }
}

export async function POST(request: Request): Promise<Response> {
  const corps = await readJson(request, bodySchema)
  if (!corps.ok) return jsonError(corps.message, 400)

  // Seul le pot de miel s'applique a l'analyse : le piege temporel est
  // reserve aux formulaires de lead (comme sur WordPress), sinon une URL
  // collee et envoyee en moins de 3 s serait refusee.
  const antiBot = checkAntiBot({ website: corps.data.website })
  if (!antiBot.ok) {
    return Response.json({ ok: true, fake: true })
  }

  const ip = getClientIp(request)
  const [limite, fenetre] = RATE_LIMITS['ps:analyze']
  const quota = await consumeRateLimit(`ps:analyze:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeRequetes },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const url = normaliserUrl(corps.data.url)
  const payload = await getPayloadClient()

  // 1. Cache : dernier run reussi de moins d'une heure sur la meme URL.
  try {
    const recents = await payload.find({
      collection: 'tool-runs',
      where: {
        and: [
          { tool: { equals: 'pagespeed' } },
          { url: { equals: url } },
          { statut: { not_equals: 'echec' } },
          { createdAt: { greater_than: new Date(Date.now() - CACHE_MS).toISOString() } },
        ],
      },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })

    const precedent = recents.docs[0]
    if (precedent?.rapport) {
      return Response.json({
        ok: true,
        runId: precedent.id,
        report: precedent.rapport as unknown as PageSpeedReport,
        cacheHit: true,
      })
    }
  } catch (erreur) {
    console.error('[pagespeed] lecture du cache impossible :', erreur)
  }

  // 2. Deux analyses Lighthouse en parallele.
  let mobileBrut: PsiResponse
  let desktopBrut: PsiResponse
  try {
    ;[mobileBrut, desktopBrut] = await Promise.all([
      analyser(url, 'mobile'),
      analyser(url, 'desktop'),
    ])
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : 'Erreur inconnue'
    await enregistrerEchec(url, ip, message)
    return Response.json(
      { ok: false, error: `${MESSAGES.echecLighthouse} (${message})` },
      { status: 502 },
    )
  }

  const mobile: StrategyReport | null = buildStrategyReport(mobileBrut)
  const desktop: StrategyReport | null = buildStrategyReport(desktopBrut)

  if (!mobile || !desktop) {
    await enregistrerEchec(url, ip, 'rapport Lighthouse incomplet')
    return Response.json({ ok: false, error: MESSAGES.echecLighthouse }, { status: 502 })
  }

  const report: PageSpeedReport = {
    url,
    finalUrl: mobileBrut.lighthouseResult?.finalUrl,
    analyzedAt: new Date().toISOString(),
    mobile,
    desktop,
  }

  // 3. Run anonyme : l'URL analysee vaut deja signal commercial.
  let runId = ''
  try {
    const run = await payload.create({
      collection: 'tool-runs',
      data: {
        tool: 'pagespeed',
        statut: 'anonyme',
        url,
        scoreMobile: mobile.score,
        scoreDesktop: desktop.score,
        rapport: report as unknown as Record<string, unknown>,
        ip,
      },
      depth: 0,
    })
    runId = run.id
  } catch (erreur) {
    console.error('[pagespeed] run anonyme non enregistre :', erreur)
  }

  return Response.json({ ok: true, runId, report, cacheHit: false })
}

/** Schema exporte pour les tests de la route. */
export type PageSpeedRequest = z.infer<typeof bodySchema>
