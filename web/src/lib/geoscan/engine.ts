/**
 * Moteur du scan de visibilite IA.
 *
 * Portage fidele de DGLGS_Engine::run_scan : questions localisees,
 * moteur conversationnel en parallele, moteur ancre sur la recherche
 * Google par lots de quatre, progression ecrite entre chaque lot,
 * extraction structuree des entreprises citees par lots de douze.
 *
 * Les appels aux modeles passent par l'interface ScanClients : une
 * implementation reelle (lib/llm) et une implementation factice
 * (fake-clients) utilisee en developpement sans cle API.
 */

import { geminiJson, geminiSearch, hasGeminiKey } from '../llm/gemini'
import { hasPerplexityKey, perplexitySonar } from '../llm/perplexity'
import { getPayloadClient } from '../payload'
import { createFakeClients } from './fake-clients'
import {
  ANSWER_STYLE,
  CHUNK_SIZE,
  EXTRACTION_ATTEMPTS,
  EXTRACTION_BATCH,
  EXTRACTION_SYSTEM,
  NB_PROMPTS,
  REPS_GEMINI,
  REPS_PERPLEXITY,
  buildExtractionUser,
  buildPrompts,
  systemInstructionAvecVille,
} from './prompts'
import type { ScanMention, ScanReponse, ScanResults } from './scoring'

/* -------------------------------------------------------------------------- */
/* Interface des moteurs                                                      */
/* -------------------------------------------------------------------------- */

/** Reponse d'un moteur : texte, sources et cout estime en centimes. */
export interface EngineAnswer {
  text: string
  sources: string[]
  coutCents: number
}

/** Extraction structuree renvoyee par le moteur JSON. */
export interface ExtractionPayload {
  extractions?: { n?: number; entreprises?: { nom?: string; rang?: number }[] }[]
}

/** Moteur ancre sur la recherche Google. */
export interface GeminiScanClient {
  /** Une question localisee, ville passee dans la consigne systeme. */
  search(prompt: string, ville: string): Promise<EngineAnswer | null>
  /** Extraction JSON stricte, sans recherche web. */
  extract(system: string, user: string): Promise<ExtractionPayload | null>
}

/** Moteur de recherche conversationnel. */
export interface PerplexityScanClient {
  search(prompt: string): Promise<EngineAnswer | null>
}

/** Moteurs injectes dans le scan. */
export interface ScanClients {
  gemini: GeminiScanClient | null
  perplexity: PerplexityScanClient | null
  /** Libelle de l'implementation, journalise au lancement du scan. */
  label: string
  /** Amorcage facultatif (moteurs factices), appele avant le premier appel. */
  prepare?: (metier: string, ville: string) => void
}

/* -------------------------------------------------------------------------- */
/* Progression                                                                */
/* -------------------------------------------------------------------------- */

/** Etape courante d'un scan, lue par le polling. */
export interface ScanProgress {
  label: string
  step: number
  total: number
}

/**
 * Libelles de progression.
 *
 * Structure et compteurs repris du plugin ; les noms des moteurs sont
 * remplaces par leur designation anonyme, la copie du site ne devant
 * jamais nommer les fournisseurs.
 */
export const PROGRESS_LABELS = {
  preparation: 'Préparation du scan...',
  perplexity: (questions: number): string =>
    `Interrogation du moteur IA n°2 avec recherche web (${questions} questions)...`,
  gemini: (questions: number): string =>
    `Interrogation du moteur IA n°1 avec recherche web (${questions} questions)...`,
  geminiLot: (fait: number, total: number): string =>
    `Interrogation du moteur IA n°1 avec recherche web (${fait}/${total})...`,
  extraction: 'Analyse des entreprises citées...',
} as const

/** Progression par defaut renvoyee tant que rien n'a ete ecrit. */
export const PROGRESS_DEFAULT: ScanProgress = {
  label: PROGRESS_LABELS.preparation,
  step: 0,
  total: 3,
}

/** Messages d'erreur du scan, repris du plugin. */
export const SCAN_ERRORS = {
  aucuneCle:
    'Aucune clé API configurée : le test de visibilité IA est temporairement indisponible.',
  aucuneReponse: 'Aucune réponse des moteurs IA.',
  verifierCles: ' Vérifier les clés API dans les réglages.',
  derniereErreur: ' Dernière erreur : ',
  echec: 'Le scan a échoué.',
} as const

/* -------------------------------------------------------------------------- */
/* Implementation reelle                                                      */
/* -------------------------------------------------------------------------- */

/** Cout estime d'un appel au moteur de recherche Google, en centimes. */
function coutGemini(promptTokens: number, outTokens: number): number {
  return Math.ceil((promptTokens * 10 + outTokens * 40) / 1_000_000)
}

/** Cout estime d'un appel au moteur conversationnel, en centimes. */
function coutPerplexity(promptTokens: number, outTokens: number): number {
  return Math.ceil((promptTokens * 100 + outTokens * 100) / 1_000_000 + 0.5)
}

/** Moteurs reels, adosses aux helpers lib/llm. */
export function createLiveClients(): ScanClients {
  const gemini: GeminiScanClient | null = hasGeminiKey()
    ? {
        async search(prompt, ville) {
          try {
            const reponse = await geminiSearch(prompt, {
              system: systemInstructionAvecVille(ville),
            })
            if (reponse.text === '') return null
            return {
              text: reponse.text,
              sources: reponse.sources,
              coutCents: coutGemini(
                reponse.usage.promptTokenCount ?? 0,
                reponse.usage.candidatesTokenCount ?? 0,
              ),
            }
          } catch (erreur) {
            console.error('[geoscan] appel moteur n°1 en erreur :', erreur)
            return null
          }
        },
        async extract(system, user) {
          for (let tentative = 0; tentative < EXTRACTION_ATTEMPTS; tentative += 1) {
            try {
              const reponse = await geminiJson<ExtractionPayload>(system, user)
              if (reponse.data) return reponse.data
            } catch (erreur) {
              console.error('[geoscan] extraction en erreur :', erreur)
            }
          }
          return null
        },
      }
    : null

  const perplexity: PerplexityScanClient | null = hasPerplexityKey()
    ? {
        async search(prompt) {
          try {
            const reponse = await perplexitySonar(prompt, ANSWER_STYLE)
            if (reponse.text === '') return null
            return {
              text: reponse.text,
              sources: reponse.sources,
              coutCents: coutPerplexity(
                reponse.usage.prompt_tokens ?? 0,
                reponse.usage.completion_tokens ?? 0,
              ),
            }
          } catch (erreur) {
            console.error('[geoscan] appel moteur n°2 en erreur :', erreur)
            return null
          }
        },
      }
    : null

  return { gemini, perplexity, label: 'reels' }
}

/**
 * true quand les moteurs factices doivent remplacer les moteurs reels.
 *
 * Explicitement avec GEOSCAN_FAKE=1, ou en developpement quand aucune
 * cle n'est configuree. Jamais en production : sans cle, la route de
 * lancement repond 503.
 */
export function fakeClientsActifs(): boolean {
  if (process.env.GEOSCAN_FAKE === '1') return true
  if (process.env.NODE_ENV === 'production') return false
  return !hasGeminiKey() && !hasPerplexityKey()
}

/** true quand un scan peut etre lance (moteurs disponibles). */
export function scanDisponible(): boolean {
  return fakeClientsActifs() || hasGeminiKey() || hasPerplexityKey()
}

/** Moteurs a utiliser pour un scan. */
export function getScanClients(): ScanClients {
  return fakeClientsActifs() ? createFakeClients() : createLiveClients()
}

/* -------------------------------------------------------------------------- */
/* Collecte des reponses (sans base de donnees)                               */
/* -------------------------------------------------------------------------- */

/** Resultat de la collecte : reponses analysees et cout estime. */
export interface CollecteResult {
  reponses: ScanReponse[]
  coutCents: number
}

/** Rappel de progression, appele entre chaque lot. */
export type ProgressHandler = (progress: ScanProgress) => Promise<void> | void

/** Decoupe un tableau en lots de taille fixe. */
function lots<T>(items: T[], taille: number): T[][] {
  const sortie: T[][] = []
  for (let index = 0; index < items.length; index += taille) {
    sortie.push(items.slice(index, index + taille))
  }
  return sortie
}

/**
 * Interroge les moteurs et extrait les entreprises citees.
 *
 * Fonction pure vis a vis de la base : elle ne lit ni n'ecrit rien,
 * la progression passe par le rappel fourni. Utilisee par runScan et
 * par les tests hors ligne.
 */
export async function collectResponses(
  metier: string,
  ville: string,
  clients: ScanClients,
  onProgress?: ProgressHandler,
): Promise<CollecteResult> {
  clients.prepare?.(metier, ville)

  const prompts = buildPrompts(metier, ville, NB_PROMPTS)
  const reponses: ScanReponse[] = []
  let coutTotal = 0

  const avecPerplexity = clients.perplexity !== null
  const totalSteps = 2 + (avecPerplexity ? 1 : 0)
  let step = 0

  const avancer = async (progress: ScanProgress): Promise<void> => {
    if (onProgress) await onProgress(progress)
  }

  // Lot 1 : moteur conversationnel, toutes les requetes en parallele.
  if (clients.perplexity) {
    step += 1
    await avancer({
      label: PROGRESS_LABELS.perplexity(prompts.length),
      step,
      total: totalSteps,
    })

    const demandes: { prompt: string; promesse: Promise<EngineAnswer | null> }[] = []
    for (const prompt of prompts) {
      for (let repetition = 0; repetition < REPS_PERPLEXITY; repetition += 1) {
        demandes.push({ prompt, promesse: clients.perplexity.search(prompt) })
      }
    }

    const resultats = await Promise.allSettled(demandes.map((demande) => demande.promesse))
    resultats.forEach((resultat, index) => {
      if (resultat.status !== 'fulfilled' || resultat.value === null) return
      coutTotal += resultat.value.coutCents
      reponses.push({
        moteur: 'perplexity',
        prompt: demandes[index]?.prompt ?? '',
        texte: resultat.value.text,
        sources: resultat.value.sources,
      })
    })
  }

  // Lot 2 : moteur ancre sur la recherche Google, par lots de quatre.
  if (clients.gemini) {
    step += 1
    const demandes: string[] = []
    for (const prompt of prompts) {
      for (let repetition = 0; repetition < REPS_GEMINI; repetition += 1) {
        demandes.push(prompt)
      }
    }

    await avancer({
      label: PROGRESS_LABELS.gemini(prompts.length),
      step,
      total: totalSteps,
    })

    let faits = 0
    for (const lot of lots(demandes, CHUNK_SIZE)) {
      const moteur = clients.gemini
      const resultats = await Promise.allSettled(
        lot.map((prompt) => moteur.search(prompt, ville)),
      )
      resultats.forEach((resultat, index) => {
        if (resultat.status !== 'fulfilled' || resultat.value === null) return
        coutTotal += resultat.value.coutCents
        reponses.push({
          moteur: 'gemini',
          prompt: lot[index] ?? '',
          texte: resultat.value.text,
          sources: resultat.value.sources,
        })
      })
      faits += lot.length
      await avancer({
        label: PROGRESS_LABELS.geminiLot(Math.min(faits, demandes.length), demandes.length),
        step,
        total: totalSteps,
      })
    }
  }

  if (reponses.length === 0) {
    return { reponses, coutCents: coutTotal }
  }

  // Extraction structuree des entreprises citees.
  step += 1
  await avancer({ label: PROGRESS_LABELS.extraction, step, total: totalSteps })

  await extraireEntreprises(reponses, clients)
  coutTotal += Math.ceil(reponses.length / EXTRACTION_BATCH)

  return { reponses, coutCents: coutTotal }
}

/**
 * Renseigne le champ entreprises de chaque reponse.
 *
 * Les reponses sont traitees par lots de douze ; un lot sans extraction
 * exploitable laisse simplement des tableaux vides.
 */
async function extraireEntreprises(
  reponses: ScanReponse[],
  clients: ScanClients,
): Promise<void> {
  const moteur = clients.gemini
  if (moteur) {
    for (let debut = 0; debut < reponses.length; debut += EXTRACTION_BATCH) {
      const lot = reponses.slice(debut, debut + EXTRACTION_BATCH)
      const user = buildExtractionUser(lot.map((reponse) => reponse.texte))
      const donnees = await moteur.extract(EXTRACTION_SYSTEM, user)
      if (!donnees || !Array.isArray(donnees.extractions)) continue

      for (const extraction of donnees.extractions) {
        const numero = Number(extraction?.n)
        if (!Number.isFinite(numero) || numero < 1 || numero > lot.length) continue
        const cible = lot[numero - 1]
        if (!cible) continue

        const entreprises: ScanMention[] = []
        if (Array.isArray(extraction.entreprises)) {
          for (const mention of extraction.entreprises) {
            const nom = typeof mention?.nom === 'string' ? mention.nom.trim() : ''
            if (nom === '') continue
            const rang = Number(mention?.rang)
            entreprises.push({
              nom,
              rang: Number.isFinite(rang) ? Math.max(1, Math.trunc(rang)) : 99,
            })
          }
        }
        cible.entreprises = entreprises
      }
    }
  }

  for (const reponse of reponses) {
    if (!Array.isArray(reponse.entreprises)) reponse.entreprises = []
  }
}

/* -------------------------------------------------------------------------- */
/* Execution d'un scan (base de donnees)                                      */
/* -------------------------------------------------------------------------- */

/**
 * Execute un scan et enregistre son resultat.
 *
 * Appelee par after() depuis la route de lancement : la reponse HTTP
 * est deja partie, la fonction continue en arriere plan. Toute erreur
 * est capturee et stockee sur le scan.
 */
export async function runScan(scanId: string, clients?: ScanClients): Promise<void> {
  const payload = await getPayloadClient()

  let scan
  try {
    scan = await payload.findByID({ collection: 'scans', id: scanId, depth: 0 })
  } catch (erreur) {
    console.error('[geoscan] scan introuvable :', erreur)
    return
  }

  if (scan.status !== 'queued' && scan.status !== 'running') return

  const moteurs = clients ?? getScanClients()
  if (!moteurs.gemini && !moteurs.perplexity) {
    await payload.update({
      collection: 'scans',
      id: scanId,
      data: { status: 'error', error: SCAN_ERRORS.aucuneCle },
      depth: 0,
    })
    return
  }

  console.log(`[geoscan] scan ${scanId} lance avec des moteurs ${moteurs.label}`)

  await payload.update({
    collection: 'scans',
    id: scanId,
    data: { status: 'running', progress: { ...PROGRESS_DEFAULT } },
    depth: 0,
  })

  try {
    const collecte = await collectResponses(
      scan.metier,
      scan.ville,
      moteurs,
      async (progress) => {
        await payload.update({
          collection: 'scans',
          id: scanId,
          data: { progress: { ...progress } },
          depth: 0,
        })
      },
    )

    if (collecte.reponses.length === 0) {
      await payload.update({
        collection: 'scans',
        id: scanId,
        data: {
          status: 'error',
          error: `${SCAN_ERRORS.aucuneReponse}${SCAN_ERRORS.verifierCles}`,
        },
        depth: 0,
      })
      return
    }

    const results: ScanResults = { reponses: collecte.reponses }
    await payload.update({
      collection: 'scans',
      id: scanId,
      data: {
        status: 'done',
        results: results as unknown as Record<string, unknown>,
        coutCents: collecte.coutCents,
        progress: null,
      },
      depth: 0,
    })
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : String(erreur)
    console.error('[geoscan] scan en erreur :', erreur)
    try {
      await payload.update({
        collection: 'scans',
        id: scanId,
        data: {
          status: 'error',
          error: `${SCAN_ERRORS.aucuneReponse}${SCAN_ERRORS.derniereErreur}${message}`,
        },
        depth: 0,
      })
    } catch (echec) {
      console.error('[geoscan] statut d erreur non enregistre :', echec)
    }
  }
}
