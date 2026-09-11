/**
 * Client HTTP commun aux fournisseurs de modeles de langage.
 *
 * Timeout par AbortSignal, relances sur les codes transitoires
 * (429, 500, 503, 529) avec un repli progressif 2 s puis 4 s.
 */

/** Codes HTTP consideres comme transitoires et donc rejouables. */
const CODES_REJOUABLES = new Set([429, 500, 503, 529])

/** Attentes successives entre deux tentatives, en millisecondes. */
const BACKOFF_MS = [2000, 4000]

/** Options de postJson. */
export interface PostJsonOptions {
  /** En-tetes ajoutes a Content-Type: application/json. */
  headers?: Record<string, string>
  /** Delai maximal d'une tentative, en millisecondes (defaut 60 s). */
  timeoutMs?: number
  /** Nombre de relances apres la premiere tentative (defaut 2). */
  retries?: number
  /** Nom du fournisseur, utilise dans les messages d'erreur. */
  label?: string
}

/** Erreur levee quand un appel echoue definitivement. */
export class LlmHttpError extends Error {
  readonly status: number
  readonly body: string

  constructor(message: string, status: number, body: string) {
    super(message)
    this.name = 'LlmHttpError'
    this.status = status
    this.body = body
  }
}

/** Suspend l'execution pendant la duree demandee. */
function attendre(ms: number): Promise<void> {
  return new Promise((resoudre) => setTimeout(resoudre, ms))
}

/**
 * Poste un corps JSON et retourne la reponse JSON typee.
 *
 * Les erreurs transitoires sont rejouees ; les autres remontent
 * immediatement sous forme de LlmHttpError.
 */
export async function postJson<T>(
  url: string,
  body: unknown,
  options: PostJsonOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 60_000
  const retries = options.retries ?? BACKOFF_MS.length
  const label = options.label ?? 'llm'

  let derniereErreur: unknown = null

  for (let tentative = 0; tentative <= retries; tentative += 1) {
    if (tentative > 0) {
      await attendre(BACKOFF_MS[Math.min(tentative - 1, BACKOFF_MS.length - 1)] ?? 4000)
    }

    try {
      const reponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (reponse.ok) {
        return (await reponse.json()) as T
      }

      const texte = await reponse.text().catch(() => '')
      const erreur = new LlmHttpError(
        `[${label}] reponse ${reponse.status}`,
        reponse.status,
        texte.slice(0, 2000),
      )

      if (!CODES_REJOUABLES.has(reponse.status)) throw erreur
      derniereErreur = erreur
    } catch (erreur) {
      if (erreur instanceof LlmHttpError && !CODES_REJOUABLES.has(erreur.status)) {
        throw erreur
      }
      derniereErreur = erreur
    }
  }

  if (derniereErreur instanceof Error) throw derniereErreur
  throw new LlmHttpError(`[${label}] echec apres ${retries + 1} tentatives`, 0, '')
}
