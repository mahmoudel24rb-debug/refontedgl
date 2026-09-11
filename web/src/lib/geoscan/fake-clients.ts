/**
 * Moteurs factices du scan de visibilite IA.
 *
 * Utilises quand GEOSCAN_FAKE=1, ou en developpement sans cle API.
 * Ils rendent des reponses realistes en francais citant trois a cinq
 * entreprises locales et des sources web plausibles, ce qui permet de
 * derouler tout le parcours (progression, score, deblocage, rapport)
 * sans reseau. Jamais actifs en production.
 */

import type {
  EngineAnswer,
  ExtractionPayload,
  GeminiScanClient,
  PerplexityScanClient,
  ScanClients,
} from './engine'
import { normalize } from './normalize'

/** Compteur global des appels factices, lu par les scripts de test. */
let appelsFactices = 0

/**
 * Duree simulee d'un appel, en millisecondes.
 *
 * Un vrai scan demande une a deux minutes : sans attente, la phase de
 * progression serait invisible. GEOSCAN_FAKE_DELAY_MS permet de la
 * raccourcir (0 dans les tests hors ligne).
 */
function delaiSimule(): number {
  const brut = Number.parseInt(process.env.GEOSCAN_FAKE_DELAY_MS ?? '', 10)
  return Number.isFinite(brut) && brut >= 0 ? brut : 1500
}

/** Attend la duree simulee d'un appel. */
function patienter(): Promise<void> {
  const duree = delaiSimule()
  if (duree === 0) return Promise.resolve()
  return new Promise((resoudre) => setTimeout(resoudre, duree))
}

/** Nombre d'appels factices depuis le demarrage du process. */
export function getFakeCallCount(): number {
  return appelsFactices
}

/** Remet le compteur d'appels factices a zero. */
export function resetFakeCallCount(): void {
  appelsFactices = 0
}

/** Prefixes d'enseigne les plus courants par metier. */
const PREFIXES: Record<string, string> = {
  boulanger: 'Boulangerie',
  boulangerie: 'Boulangerie',
  patissier: 'Pâtisserie',
  plombier: 'Plomberie',
  electricien: 'Électricité',
  chauffagiste: 'Chauffage',
  menuisier: 'Menuiserie',
  serrurier: 'Serrurerie',
  couvreur: 'Toiture',
  macon: 'Maçonnerie',
  peintre: 'Peinture',
  coiffeur: 'Salon',
  fleuriste: 'Fleurs',
  garagiste: 'Garage',
  restaurant: 'Restaurant',
  avocat: 'Cabinet',
  dentiste: 'Cabinet',
  veterinaire: 'Clinique',
  paysagiste: 'Paysage',
}

/** Noms de famille utilises pour composer les enseignes. */
const FAMILLES = ['Martin', 'Dupont', 'Leroy', 'Bernard', 'Moreau'] as const

/** Premiere lettre en capitale. */
function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1)
}

/** Prefixe d'enseigne deduit du metier saisi. */
function prefixeEnseigne(metier: string): string {
  const cle = normalize(metier).split(' ')[0] ?? ''
  return PREFIXES[cle] ?? capitaliser(metier.trim())
}

/** Identifiant d'URL a partir d'un libelle. */
function slug(texte: string): string {
  return normalize(texte).replace(/ /g, '-')
}

/** Generateur pseudo aleatoire deterministe (mulberry32). */
function generateur(graine: number): () => number {
  let etat = graine >>> 0
  return () => {
    etat += 0x6d2b79f5
    let valeur = etat
    valeur = Math.imul(valeur ^ (valeur >>> 15), valeur | 1)
    valeur ^= valeur + Math.imul(valeur ^ (valeur >>> 7), valeur | 61)
    return ((valeur ^ (valeur >>> 14)) >>> 0) / 4294967296
  }
}

/** Empreinte entiere d'une chaine, pour amorcer le generateur. */
function empreinte(texte: string): number {
  let valeur = 2166136261
  for (let index = 0; index < texte.length; index += 1) {
    valeur ^= texte.charCodeAt(index)
    valeur = Math.imul(valeur, 16777619)
  }
  return valeur >>> 0
}

/** Phrases d'introduction, variees d'une reponse a l'autre. */
const INTROS = [
  'Voici les adresses qui reviennent le plus souvent à {ville} :',
  'À {ville}, plusieurs établissements sortent du lot :',
  "D'après les avis récents et les retours de clients à {ville} :",
  'Trois à quatre noms reviennent régulièrement à {ville} :',
] as const

/** Arguments de recommandation associes a chaque position. */
const ARGUMENTS = [
  'la plus recommandée, avec des avis très réguliers et une note moyenne de 4,8 sur 5',
  'un très bon rapport qualité prix, souvent citée par les habitants du centre ville',
  'appréciée pour son accueil et sa réactivité, avec plus de 200 avis publiés',
  'une adresse plus confidentielle, dont les clients parlent en très bons termes',
  'un choix solide quand les autres ne sont pas disponibles',
] as const

/** Phrase de cloture. */
const CLOTURE =
  "Le mieux reste d'appeler pour confirmer les disponibilités, les horaires changent souvent."

/** Sources generiques citees par les moteurs. */
function sourcesGeneriques(metier: string, ville: string): string[] {
  return [
    `https://www.google.com/maps/search/${encodeURIComponent(`${metier} ${ville}`)}`,
    `https://www.pagesjaunes.fr/annuaire/${slug(ville)}/${slug(metier)}`,
    `https://fr.trustpilot.com/search?query=${encodeURIComponent(`${metier} ${ville}`)}`,
  ]
}

/** Catalogue d'enseignes locales pour un couple metier + ville. */
export function enseignesFactices(metier: string, ville: string): string[] {
  const prefixe = prefixeEnseigne(metier)
  return [
    `${prefixe} ${FAMILLES[0]}`,
    `${prefixe} ${FAMILLES[1]}`,
    `${prefixe} du Centre`,
    `Maison ${FAMILLES[3]}`,
    `${prefixe} ${ville}`,
  ]
}

/** Etat partage par les deux moteurs factices d'un meme scan. */
interface EtatFactice {
  noms: string[]
  metier: string
  ville: string
}

/** Redige une reponse factice citant trois a cinq enseignes. */
function redigerReponse(
  etat: EtatFactice,
  prompt: string,
  moteur: string,
  index: number,
): EngineAnswer {
  const aleatoire = generateur(empreinte(`${moteur}|${prompt}|${index}`))
  const nombre = 3 + Math.floor(aleatoire() * 3)

  // Les premieres enseignes du catalogue restent les plus souvent
  // citees : le tirage est biaise vers le debut de la liste.
  const catalogue = [...etat.noms]
  const choisies: string[] = []
  while (choisies.length < nombre && catalogue.length > 0) {
    const tirage = Math.floor(Math.pow(aleatoire(), 1.6) * catalogue.length)
    choisies.push(catalogue.splice(tirage, 1)[0] as string)
  }

  const intro = INTROS[Math.floor(aleatoire() * INTROS.length)] ?? INTROS[0]
  const lignes = choisies.map(
    (nom, rang) => `${rang + 1}. ${nom} : ${ARGUMENTS[rang] ?? ARGUMENTS[4]}.`,
  )

  const sources = [
    ...choisies.slice(0, 3).map((nom) => `https://www.${slug(nom)}-${slug(etat.ville)}.fr/`),
    ...sourcesGeneriques(etat.metier, etat.ville),
  ]

  return {
    text: [intro.replace('{ville}', etat.ville), '', ...lignes, '', CLOTURE].join('\n'),
    sources: [...new Set(sources)],
    coutCents: moteur === 'perplexity' ? 1 : 0,
  }
}

/** Extrait les enseignes connues d'un bloc de texte, dans l'ordre. */
function extraireDuTexte(texte: string, noms: string[]): { nom: string; rang: number }[] {
  return noms
    .map((nom) => ({ nom, position: texte.indexOf(nom) }))
    .filter((entree) => entree.position >= 0)
    .sort((a, b) => a.position - b.position)
    .map((entree, index) => ({ nom: entree.nom, rang: index + 1 }))
}

/**
 * Construit une paire de moteurs factices.
 *
 * Une instance par scan : elle memorise le catalogue d'enseignes pour
 * que l'extraction retrouve exactement les noms qu'elle a cites.
 */
export function createFakeClients(): ScanClients {
  const etat: EtatFactice = { noms: [], metier: '', ville: '' }
  let compteur = 0

  const gemini: GeminiScanClient = {
    async search(prompt) {
      appelsFactices += 1
      // Rang de l'appel fige avant l'attente : la graine reste stable.
      const index = (compteur += 1)
      console.log(`[geoscan][factice] moteur n°1 : ${prompt}`)
      await patienter()
      return redigerReponse(etat, prompt, 'gemini', index)
    },
    async extract(_system, user) {
      appelsFactices += 1
      console.log('[geoscan][factice] extraction des entreprises citees')
      await patienter()
      const blocs = user
        .split(/=====\s*Réponse\s+\d+\s*=====/)
        .slice(1)
        .map((bloc) => bloc.trim())
      return {
        extractions: blocs.map((bloc, index) => ({
          n: index + 1,
          entreprises: extraireDuTexte(bloc, etat.noms),
        })),
      } satisfies ExtractionPayload
    },
  }

  const perplexity: PerplexityScanClient = {
    async search(prompt) {
      appelsFactices += 1
      // Rang de l'appel fige avant l'attente : la graine reste stable.
      const index = (compteur += 1)
      console.log(`[geoscan][factice] moteur n°2 : ${prompt}`)
      await patienter()
      return redigerReponse(etat, prompt, 'perplexity', index)
    },
  }

  return {
    gemini,
    perplexity,
    label: 'factices',
    prepare(metier, ville) {
      etat.metier = metier
      etat.ville = ville
      etat.noms = enseignesFactices(metier, ville)
    },
  }
}
