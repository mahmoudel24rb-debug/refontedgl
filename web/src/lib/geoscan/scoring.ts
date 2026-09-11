/**
 * Calcul du score de visibilite IA locale.
 *
 * Portage fidele de DGLGS_Scoring::evaluate. Ponderation, transparente
 * et affichee sur la page :
 *   presence 50 % (part des reponses ou l'entreprise est citee),
 *   rang 30 % (position moyenne quand elle est citee),
 *   sources 20 % (son site figure dans les sources citees par les IA).
 */

import { namesMatch, normalizeName, sourcesMatch } from './normalize'

/** Une entreprise citee dans une reponse, avec son rang de recommandation. */
export interface ScanMention {
  nom: string
  rang: number
}

/** Reponse d'un moteur IA a une question d'acheteur. */
export interface ScanReponse {
  /** Cle interne du moteur : gemini ou perplexity. */
  moteur: string
  prompt: string
  texte: string
  sources: string[]
  /** Renseigne par l'etape d'extraction ; tableau vide sinon. */
  entreprises?: ScanMention[]
}

/** Contenu du champ results d'un scan. */
export interface ScanResults {
  reponses: ScanReponse[]
}

/** Concurrent agrege sur l'ensemble des reponses. */
export interface Competitor {
  nom: string
  count: number
  bestRang: number
  moteurs: string[]
}

/** Verdict complet d'une entreprise face aux resultats d'un scan. */
export interface Evaluation {
  score: number
  citedCount: number
  total: number
  /** Presence en pourcentage entier. */
  presence: number
  /** Poids de rang moyen en pourcentage entier. */
  rankAvg: number
  sourcesOk: boolean
  /** Cinq concurrents les plus cites. */
  podium: Competitor[]
  /** Nombre de concurrents cites plus souvent que l'entreprise. */
  devant: number
}

/** Poids attache a un rang de recommandation (1er = 100 %). */
export function rankWeight(rang: number): number {
  if (rang <= 1) return 1
  if (rang === 2) return 0.75
  if (rang === 3) return 0.55
  if (rang === 4) return 0.4
  return 0.3
}

/** Arrondi au plus proche, comme round() de PHP sur des valeurs positives. */
function arrondir(valeur: number): number {
  return Math.round(valeur)
}

/** Lit le tableau de mentions d'une reponse. */
function mentions(reponse: ScanReponse): ScanMention[] {
  return Array.isArray(reponse.entreprises) ? reponse.entreprises : []
}

/**
 * Evalue une entreprise contre les resultats d'un scan.
 *
 * Les reponses sont parcourues une fois : l'entreprise n'est comptee
 * qu'une fois par reponse, toutes les autres enseignes alimentent le
 * podium des concurrents.
 */
export function evaluate(
  results: ScanResults | null | undefined,
  entreprise: string,
): Evaluation {
  const reponses = Array.isArray(results?.reponses) ? results.reponses : []
  const total = reponses.length

  let cited = 0
  const poidsRangs: number[] = []
  const toutesSources: string[] = []
  // Cle normalisee compacte du concurrent vers son agregat.
  const concurrents = new Map<string, Competitor>()

  for (const reponse of reponses) {
    const moteur = typeof reponse.moteur === 'string' ? reponse.moteur : ''
    let trouveIci = false

    for (const mention of mentions(reponse)) {
      const nom = typeof mention.nom === 'string' ? mention.nom : ''
      const rang =
        typeof mention.rang === 'number' && Number.isFinite(mention.rang)
          ? Math.max(1, Math.trunc(mention.rang))
          : 99
      if (nom === '') continue

      if (namesMatch(nom, entreprise)) {
        if (!trouveIci) {
          cited += 1
          poidsRangs.push(rankWeight(rang))
          trouveIci = true
        }
        continue
      }

      const cle = normalizeName(nom).replace(/ /g, '')
      if (cle === '' || cle.length < 3) continue

      const existant = concurrents.get(cle)
      if (!existant) {
        concurrents.set(cle, { nom, count: 1, bestRang: rang, moteurs: moteur ? [moteur] : [] })
        continue
      }
      existant.count += 1
      existant.bestRang = Math.min(existant.bestRang, rang)
      if (moteur !== '' && !existant.moteurs.includes(moteur)) {
        existant.moteurs.push(moteur)
      }
    }

    if (Array.isArray(reponse.sources) && reponse.sources.length > 0) {
      toutesSources.push(...reponse.sources)
    }
  }

  const presence = total > 0 ? cited / total : 0
  const rankAvg =
    poidsRangs.length > 0
      ? poidsRangs.reduce((somme, poids) => somme + poids, 0) / poidsRangs.length
      : 0
  const sourcesOk = sourcesMatch(entreprise, [...new Set(toutesSources)])

  const brut = arrondir(50 * presence + 30 * rankAvg + 20 * (sourcesOk ? 1 : 0))
  const score = Math.max(0, Math.min(100, brut))

  // Podium : les plus cites d'abord, le meilleur rang departage.
  const classes = [...concurrents.values()].sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count
    return a.bestRang - b.bestRang
  })
  const podium = classes.slice(0, 5)

  let devant = 0
  for (const concurrent of classes) {
    if (concurrent.count > cited) devant += 1
  }

  return {
    score,
    citedCount: cited,
    total,
    presence: arrondir(presence * 100),
    rankAvg: arrondir(rankAvg * 100),
    sourcesOk,
    podium,
    devant,
  }
}
