import { after } from 'next/server'

import { PROGRESS_DEFAULT, runScan, type ScanProgress } from '@/lib/geoscan/engine'
import { evaluate, type ScanResults } from '@/lib/geoscan/scoring'
import { getPayloadClient } from '@/lib/payload'
import { jsonError } from '@/lib/request'
import type { Scan } from '@/payload-types'

/**
 * Progression puis resultat gratuit d'un scan de visibilite IA.
 *
 * Portage de DGLGS_Ajax::handle_status : garde-fou de relance quand le
 * scan n'a plus progresse depuis trois minutes, puis score, citations
 * et nombre de concurrents devant. Aucun nom de concurrent n'est
 * renvoye avant le deblocage.
 */

/** La relance d'un scan bloque se fait dans cette requete. */
export const maxDuration = 300

/** Duree sans progression au dela de laquelle le scan est relance. */
const STALE_MS = 180 * 1000

/** Nombre maximal de relances avant abandon. */
const MAX_TENTATIVES = 3

/** Messages renvoyes au visiteur, repris du plugin WordPress. */
const MESSAGES = {
  testIntrouvable: 'Test introuvable.',
  scanIntrouvable: 'Scan introuvable.',
  resultatsIndisponibles: 'Résultats indisponibles.',
  echec: 'Le scan a échoué.',
  abandon: 'Le scan a échoué. Réessayez dans quelques minutes.',
} as const

/** Lit la progression stockee sur le scan. */
function lireProgression(scan: Scan): ScanProgress {
  const brut = scan.progress
  if (brut && typeof brut === 'object' && !Array.isArray(brut)) {
    const valeur = brut as Record<string, unknown>
    if (typeof valeur.label === 'string') {
      return {
        label: valeur.label,
        step: typeof valeur.step === 'number' ? valeur.step : 0,
        total: typeof valeur.total === 'number' ? valeur.total : 3,
      }
    }
  }
  return PROGRESS_DEFAULT
}

/** Lit les resultats stockes sur le scan. */
function lireResultats(scan: Scan): ScanResults | null {
  const brut = scan.results
  if (brut && typeof brut === 'object' && !Array.isArray(brut)) {
    const valeur = brut as { reponses?: unknown }
    if (Array.isArray(valeur.reponses)) {
      return { reponses: valeur.reponses as ScanResults['reponses'] }
    }
  }
  return null
}

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return jsonError(MESSAGES.testIntrouvable, 404)

  const payload = await getPayloadClient()

  let run
  try {
    run = await payload.findByID({ collection: 'tool-runs', id, depth: 0 })
  } catch {
    return jsonError(MESSAGES.testIntrouvable, 404)
  }

  const scanId = typeof run.scan === 'string' ? run.scan : (run.scan?.id ?? null)
  if (!scanId) return jsonError(MESSAGES.scanIntrouvable, 404)

  let scan: Scan
  try {
    scan = await payload.findByID({ collection: 'scans', id: scanId, depth: 0 })
  } catch {
    return jsonError(MESSAGES.scanIntrouvable, 404)
  }

  if (scan.status === 'error') {
    return Response.json({
      ok: true,
      status: 'error',
      message: scan.error ?? MESSAGES.echec,
    })
  }

  if (scan.status !== 'done') {
    // Garde-fou : un scan interrompu (fonction tuee, deploiement) ne
    // progresse plus. Passe trois minutes, il est remis en file et
    // relance ; au bout de trois tentatives il est abandonne.
    const inactif = Date.now() - new Date(scan.updatedAt).getTime()
    if (inactif > STALE_MS) {
      const tentatives = scan.attempts ?? 0
      if (tentatives >= MAX_TENTATIVES) {
        await payload.update({
          collection: 'scans',
          id: scanId,
          data: { status: 'error', error: MESSAGES.abandon },
          depth: 0,
        })
        return Response.json({ ok: true, status: 'error', message: MESSAGES.abandon })
      }

      // La mise a jour touche updatedAt : pas de rafale de relances.
      await payload.update({
        collection: 'scans',
        id: scanId,
        data: { status: 'queued', attempts: tentatives + 1 },
        depth: 0,
      })
      after(() => runScan(scanId))
    }

    return Response.json({
      ok: true,
      status: 'running',
      progress: lireProgression(scan),
    })
  }

  const resultats = lireResultats(scan)
  if (!resultats) {
    return Response.json({
      ok: true,
      status: 'error',
      message: MESSAGES.resultatsIndisponibles,
    })
  }

  const evaluation = evaluate(resultats, run.entreprise ?? '')

  // Score memorise sur le run des la premiere lecture.
  if (typeof run.score !== 'number') {
    try {
      await payload.update({
        collection: 'tool-runs',
        id,
        data: {
          score: evaluation.score,
          cited: evaluation.citedCount,
          total: evaluation.total,
        },
        depth: 0,
      })
    } catch (erreur) {
      console.error('[geoscan/status] score non memorise :', erreur)
    }
  }

  // Partie gratuite uniquement : jamais de nom de concurrent ici.
  return Response.json({
    ok: true,
    status: 'done',
    score: evaluation.score,
    cited: evaluation.citedCount,
    total: evaluation.total,
    devant: evaluation.devant,
  })
}
