import { postJson } from './http'

/**
 * Acces a l'API Perplexity (chat/completions, modele sonar).
 *
 * Le modele repond en citant ses sources : les URL sont extraites de
 * citations et de search_results, dedoublonnees dans l'ordre d'apparition.
 */

const ENDPOINT = 'https://api.perplexity.ai/chat/completions'

/** Modele utilise par defaut, surchargeable par PERPLEXITY_MODEL. */
function modele(): string {
  return process.env.PERPLEXITY_MODEL ?? 'sonar'
}

/** true quand une cle API Perplexity est configuree. */
export function hasPerplexityKey(): boolean {
  return (process.env.PERPLEXITY_API_KEY ?? '') !== ''
}

/** Cle API, absente tant que PERPLEXITY_API_KEY n'est pas fournie. */
function cle(): string {
  const valeur = process.env.PERPLEXITY_API_KEY
  if (!valeur) throw new Error('[perplexity] PERPLEXITY_API_KEY absente.')
  return valeur
}

/** Resultat de recherche renvoye par l'API. */
interface PerplexitySearchResult {
  title?: string
  url?: string
  date?: string
}

/** Consommation de jetons d'un appel. */
export interface PerplexityUsage {
  prompt_tokens?: number
  completion_tokens?: number
}

/** Reponse brute de chat/completions. */
interface PerplexityResponse {
  choices?: { message?: { content?: string } }[]
  citations?: string[]
  search_results?: PerplexitySearchResult[]
  usage?: PerplexityUsage
}

/** Resultat d'un appel a Perplexity. */
export interface PerplexityResult {
  /** Texte de la reponse. */
  text: string
  /** URL citees directement dans la reponse. */
  citations: string[]
  /** URL des resultats de recherche utilises. */
  searchResults: string[]
  /** Union dedoublonnee de citations et searchResults. */
  sources: string[]
  /** Jetons consommes, quand l'API les renvoie. */
  usage: PerplexityUsage
}

/** Options de perplexitySonar. */
export interface PerplexityOptions {
  /** Delai maximal, en millisecondes. */
  timeoutMs?: number
  /** Temperature du modele. */
  temperature?: number
}

/**
 * Interroge Perplexity et retourne texte et sources.
 *
 * L'authentification se fait par en-tete Authorization: Bearer.
 */
export async function perplexitySonar(
  prompt: string,
  system?: string,
  options: PerplexityOptions = {},
): Promise<PerplexityResult> {
  const messages: { role: 'system' | 'user'; content: string }[] = []
  if (system) messages.push({ role: 'system', content: system })
  messages.push({ role: 'user', content: prompt })

  const reponse = await postJson<PerplexityResponse>(
    ENDPOINT,
    {
      model: modele(),
      messages,
      // Non transmise par defaut : le plugin WordPress laisse le
      // reglage du modele, ce qui fait varier les reponses d'une
      // repetition a l'autre (mesure de frequence).
      temperature: options.temperature,
    },
    {
      headers: { Authorization: `Bearer ${cle()}` },
      timeoutMs: options.timeoutMs ?? 90_000,
      label: 'perplexity',
    },
  )

  const citations = (reponse.citations ?? []).filter(
    (url): url is string => typeof url === 'string' && url !== '',
  )
  const searchResults = (reponse.search_results ?? [])
    .map((resultat) => resultat.url)
    .filter((url): url is string => typeof url === 'string' && url !== '')

  return {
    text: reponse.choices?.[0]?.message?.content?.trim() ?? '',
    citations,
    searchResults,
    sources: [...new Set([...citations, ...searchResults])],
    usage: reponse.usage ?? {},
  }
}
