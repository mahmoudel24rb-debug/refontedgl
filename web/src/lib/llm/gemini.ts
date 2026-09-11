import { postJson } from './http'

/**
 * Acces a l'API Gemini (generateContent).
 *
 * Deux usages : geminiSearch pour une reponse ancree sur la recherche
 * Google (grounding), geminiJson pour une sortie JSON stricte. Les deux
 * remontent la consommation de jetons, dont les outils tirent un cout
 * estime en centimes.
 */

/** Modele utilise par defaut, surchargeable par GEMINI_MODEL. */
function modele(): string {
  return process.env.GEMINI_MODEL ?? 'gemini-3.1-flash-lite'
}

/** Point d'entree generateContent du modele courant. */
function endpoint(): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    modele(),
  )}:generateContent`
}

/** true quand une cle API Gemini est configuree. */
export function hasGeminiKey(): boolean {
  return (process.env.GEMINI_API_KEY ?? '') !== ''
}

/** Cle API, absente en local tant que GEMINI_API_KEY n'est pas fournie. */
function cle(): string {
  const valeur = process.env.GEMINI_API_KEY
  if (!valeur) throw new Error('[gemini] GEMINI_API_KEY absente.')
  return valeur
}

/** Partie textuelle d'un candidat. */
interface GeminiPart {
  text?: string
}

/** Metadonnees de grounding : sources citees par la recherche Google. */
interface GeminiGroundingChunk {
  web?: { uri?: string; title?: string }
}

/** Candidat renvoye par l'API. */
interface GeminiCandidate {
  content?: { parts?: GeminiPart[] }
  groundingMetadata?: {
    groundingChunks?: GeminiGroundingChunk[]
    webSearchQueries?: string[]
  }
}

/** Consommation de jetons d'un appel. */
export interface GeminiUsage {
  promptTokenCount?: number
  candidatesTokenCount?: number
}

/** Reponse brute de generateContent. */
interface GeminiResponse {
  candidates?: GeminiCandidate[]
  usageMetadata?: GeminiUsage
}

/** Resultat d'un appel ancre sur la recherche Google. */
export interface GeminiSearchResult {
  /** Texte de la reponse, parties concatenees. */
  text: string
  /** URL des sources utilisees par le grounding. */
  sources: string[]
  /** Requetes reellement envoyees a la recherche Google. */
  requetes: string[]
  /** Jetons consommes, quand l'API les renvoie. */
  usage: GeminiUsage
}

/** Options de geminiSearch. */
export interface GeminiSearchOptions {
  /** Consigne systeme envoyee dans system_instruction. */
  system?: string
  /** Plafond de jetons produits (1024 par defaut, comme le plugin). */
  maxOutputTokens?: number
  /** Delai maximal, en millisecondes. */
  timeoutMs?: number
}

/** Concatene les parties textuelles du premier candidat. */
function extraireTexte(reponse: GeminiResponse): string {
  const parts = reponse.candidates?.[0]?.content?.parts ?? []
  return parts
    .map((part) => part.text ?? '')
    .join('')
    .trim()
}

/**
 * Interroge Gemini avec l'outil de recherche Google active.
 *
 * Le prompt est transmis tel quel : la localisation passe par la
 * consigne systeme, comme dans le plugin WordPress.
 */
export async function geminiSearch(
  prompt: string,
  options: GeminiSearchOptions = {},
): Promise<GeminiSearchResult> {
  const reponse = await postJson<GeminiResponse>(
    endpoint(),
    {
      system_instruction: options.system
        ? { parts: [{ text: options.system }] }
        : undefined,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // Grounding Google Search : objet vide obligatoire.
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: options.maxOutputTokens ?? 1024 },
    },
    {
      headers: { 'x-goog-api-key': cle() },
      timeoutMs: options.timeoutMs ?? 75_000,
      label: 'gemini',
    },
  )

  const candidat = reponse.candidates?.[0]
  const chunks = candidat?.groundingMetadata?.groundingChunks ?? []
  const sources = [
    ...new Set(
      chunks
        .map((chunk) => chunk.web?.uri)
        .filter((uri): uri is string => typeof uri === 'string' && uri !== ''),
    ),
  ]

  return {
    text: extraireTexte(reponse),
    sources,
    requetes: candidat?.groundingMetadata?.webSearchQueries ?? [],
    usage: reponse.usageMetadata ?? {},
  }
}

/**
 * Decode un JSON produit par un modele : cloture de code eventuelle
 * retiree, puis repli sur la portion comprise entre la premiere et la
 * derniere accolade. Retourne null quand rien n'est exploitable.
 */
export function decodeJsonSouple<T>(texte: string): T | null {
  const nettoye = texte
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')

  try {
    return JSON.parse(nettoye) as T
  } catch {
    // Repli ci dessous.
  }

  const debut = nettoye.indexOf('{')
  const fin = nettoye.lastIndexOf('}')
  if (debut !== -1 && fin !== -1 && fin > debut) {
    try {
      return JSON.parse(nettoye.slice(debut, fin + 1)) as T
    } catch {
      return null
    }
  }

  return null
}

/** Options de geminiJson. */
export interface GeminiJsonOptions {
  /** Plafond de jetons produits. */
  maxOutputTokens?: number
  /** Delai maximal, en millisecondes. */
  timeoutMs?: number
}

/** Resultat d'un appel JSON : donnees decodees et jetons consommes. */
export interface GeminiJsonResult<T> {
  data: T | null
  usage: GeminiUsage
}

/**
 * Interroge Gemini en exigeant une reponse JSON.
 *
 * Une reponse non parsable retourne data a null : l'appelant decide de
 * relancer ou de poursuivre sans extraction.
 */
export async function geminiJson<T>(
  system: string,
  user: string,
  options: GeminiJsonOptions = {},
): Promise<GeminiJsonResult<T>> {
  const reponse = await postJson<GeminiResponse>(
    endpoint(),
    {
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        maxOutputTokens: options.maxOutputTokens ?? 3000,
        responseMimeType: 'application/json',
      },
    },
    {
      headers: { 'x-goog-api-key': cle() },
      timeoutMs: options.timeoutMs ?? 90_000,
      label: 'gemini',
    },
  )

  return {
    data: decodeJsonSouple<T>(extraireTexte(reponse)),
    usage: reponse.usageMetadata ?? {},
  }
}
