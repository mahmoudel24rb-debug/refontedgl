/**
 * Rapport complet du scan de visibilite IA.
 *
 * Portage fidele de DGLGS_Ajax::build_report : detail par moteur,
 * podium nominatif des concurrents et plan d'action conditionnel.
 * Ce rapport n'est renvoye qu'apres le deblocage : il contient les
 * noms des concurrents.
 */

import { namesMatch } from './normalize'
import type { Evaluation, ScanResults } from './scoring'

/** Concurrent tel qu'affiche sur le podium. */
export interface ReportPodiumEntry {
  nom: string
  count: number
  total: number
  /** Cles internes des moteurs, anonymisees a l'affichage. */
  moteurs: string[]
}

/** Compteurs d'un moteur : reponses analysees et citations. */
export interface ReportEngineStats {
  total: number
  cited: number
}

/** Rapport complet renvoye par la route de deblocage. */
export interface GeoReport {
  status: 'unlocked'
  score: number
  cited: number
  total: number
  presence: number
  rankAvg: number
  sourcesOk: boolean
  podium: ReportPodiumEntry[]
  moteurs: Record<string, ReportEngineStats>
  recos: string[]
}

/** Recommandations conditionnelles, reprises mot pour mot du plugin. */
export const RECOS = {
  presence:
    "Renforcez votre présence locale en ligne : fiche Google complète et active, avis clients récents, pages dédiées à votre ville sur votre site. Les IA s'appuient massivement sur ces signaux.",
  sources:
    "Votre site n'apparaît pas dans les sources citées par les IA : travaillez sa citabilité (contenus locaux détaillés, données structurées, pages métier + ville).",
  rang: "Vous êtes cité mais rarement en premier : les avis clients, la cohérence de vos informations (nom, adresse, téléphone) et des contenus de référence font gagner des places.",
  bonne:
    'Votre visibilité IA est bonne : entretenez-la (avis réguliers, contenus frais) et surveillez vos concurrents, le classement des IA évolue vite.',
} as const

/**
 * Construit le rapport complet a partir des resultats bruts et de
 * l'evaluation de l'entreprise.
 */
export function buildReport(
  results: ScanResults,
  evaluation: Evaluation,
  entreprise: string,
): GeoReport {
  // Detail par moteur : reponses analysees et reponses citant l'entreprise.
  const moteurs: Record<string, ReportEngineStats> = {}
  for (const reponse of results.reponses) {
    const cle = typeof reponse.moteur === 'string' && reponse.moteur !== '' ? reponse.moteur : 'inconnu'
    const stats = moteurs[cle] ?? { total: 0, cited: 0 }
    stats.total += 1
    for (const mention of reponse.entreprises ?? []) {
      if (namesMatch(mention.nom, entreprise)) {
        stats.cited += 1
        break
      }
    }
    moteurs[cle] = stats
  }

  // Plan d'action : uniquement les faiblesses reellement detectees.
  const recos: string[] = []
  if (evaluation.presence < 50) recos.push(RECOS.presence)
  if (!evaluation.sourcesOk) recos.push(RECOS.sources)
  if (evaluation.citedCount > 0 && evaluation.rankAvg < 70) recos.push(RECOS.rang)
  if (recos.length === 0) recos.push(RECOS.bonne)

  return {
    status: 'unlocked',
    score: evaluation.score,
    cited: evaluation.citedCount,
    total: evaluation.total,
    presence: evaluation.presence,
    rankAvg: evaluation.rankAvg,
    sourcesOk: evaluation.sourcesOk,
    podium: evaluation.podium.map((concurrent) => ({
      nom: concurrent.nom,
      count: concurrent.count,
      total: evaluation.total,
      moteurs: concurrent.moteurs,
    })),
    moteurs,
    recos,
  }
}

/** Podium au format texte, pour la note du CRM et l'email interne. */
export function podiumTexte(podium: ReportPodiumEntry[]): string {
  if (podium.length === 0) return 'aucun'
  return podium
    .slice(0, 5)
    .map((concurrent, index) => `${index + 1}. ${concurrent.nom} (cité ${concurrent.count} fois)`)
    .join('\n')
}
