import { postJson } from './http'

/**
 * Squelette d'acces a l'API Anthropic (Messages).
 *
 * Prevu pour les generateurs IA du lot suivant (strategie, roaster,
 * cahiers des charges). Aucune route ne l'appelle aujourd hui.
 */

const ENDPOINT = 'https://api.anthropic.com/v1/messages'
const VERSION_API = '2023-06-01'

/** Modele par defaut, surchargeable par ANTHROPIC_MODEL. */
const MODELE_DEFAUT = 'claude-sonnet-4-5'

/** Options de claudeJson. */
export interface ClaudeJsonOptions {
  /** Identifiant du modele principal. */
  model?: string
  /** Modele de repli si le principal echoue. */
  fallbackModel?: string
  /** Nombre maximal de jetons generes. */
  maxTokens?: number
  /** Temperature du modele. */
  temperature?: number
  /** Delai maximal, en millisecondes. */
  timeoutMs?: number
}

/** Bloc de contenu renvoye par l'API. */
interface AnthropicContentBlock {
  type?: string
  text?: string
}

/** Reponse brute de l'API Messages. */
interface AnthropicResponse {
  content?: AnthropicContentBlock[]
}

/** Cle API, absente tant que ANTHROPIC_API_KEY n'est pas fournie. */
function cle(): string {
  const valeur = process.env.ANTHROPIC_API_KEY
  if (!valeur) throw new Error('[anthropic] ANTHROPIC_API_KEY absente.')
  return valeur
}

/** Concatene les blocs texte de la reponse. */
function extraireTexte(reponse: AnthropicResponse): string {
  return (reponse.content ?? [])
    .filter((bloc) => bloc.type === 'text')
    .map((bloc) => bloc.text ?? '')
    .join('')
    .trim()
}

/** Retire les cloture de bloc de code autour d'une reponse JSON. */
function nettoyerJson(texte: string): string {
  const sansFence = texte
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  const debut = sansFence.search(/[[{]/)
  return debut > 0 ? sansFence.slice(debut) : sansFence
}

/** Appelle le modele une fois et parse la reponse JSON. */
async function appeler<T>(
  model: string,
  system: string,
  user: string,
  options: ClaudeJsonOptions,
): Promise<T> {
  const reponse = await postJson<AnthropicResponse>(
    ENDPOINT,
    {
      model,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.2,
      system,
      messages: [{ role: 'user', content: user }],
    },
    {
      headers: {
        'x-api-key': cle(),
        'anthropic-version': VERSION_API,
      },
      timeoutMs: options.timeoutMs ?? 120_000,
      label: 'anthropic',
    },
  )

  const texte = nettoyerJson(extraireTexte(reponse))
  return JSON.parse(texte) as T
}

/**
 * Demande une reponse JSON au modele, avec repli sur un second modele.
 *
 * Non utilisee pour l'instant : socle pour les generateurs IA a venir.
 */
export async function claudeJson<T>(
  system: string,
  user: string,
  options: ClaudeJsonOptions = {},
): Promise<T> {
  const principal = options.model ?? process.env.ANTHROPIC_MODEL ?? MODELE_DEFAUT
  try {
    return await appeler<T>(principal, system, user, options)
  } catch (erreur) {
    if (!options.fallbackModel) throw erreur
    console.error('[anthropic] repli sur', options.fallbackModel, erreur)
    return appeler<T>(options.fallbackModel, system, user, options)
  }
}
