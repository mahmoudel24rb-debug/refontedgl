/**
 * Questions d'acheteurs localisees et consignes envoyees aux moteurs IA.
 *
 * Portage fidele de DGLGS_Engine::build_prompts, de la constante
 * ANSWER_STYLE de DGLGS_API et du prompt d'extraction structuree.
 * Les gabarits sont figes : deux visiteurs qui demandent le meme couple
 * metier + ville partagent le meme scan.
 */

/** Les huit gabarits de questions, dans l'ordre du plugin. */
export const PROMPT_TEMPLATES: readonly string[] = [
  'Quel est le meilleur {metier} à {ville} ?',
  'Peux-tu me recommander un bon {metier} à {ville} ? Donne-moi des noms.',
  'Je cherche un {metier} fiable à {ville}, lequel me conseilles-tu ?',
  'Quels sont les {metier} les mieux notés à {ville} ?',
  'Top 3 des meilleurs {metier} à {ville} ?',
  'À qui faire appel pour trouver un {metier} près de {ville} ?',
  'Quel {metier} choisir à {ville} ?',
  '{metier} recommandé à {ville} : tu as des noms à me donner ?',
]

/** Nombre de questions posees par moteur (reglage nb_prompts). */
export const NB_PROMPTS = 4

/** Repetitions par question pour le moteur ancre sur la recherche Google. */
export const REPS_GEMINI = 1

/** Repetitions par question pour le moteur de recherche conversationnel. */
export const REPS_PERPLEXITY = 2

/** Taille des lots d'appels envoyes au moteur de recherche Google. */
export const CHUNK_SIZE = 4

/** Nombre de reponses analysees par appel d'extraction. */
export const EXTRACTION_BATCH = 12

/** Nombre maximal de tentatives d'un appel d'extraction. */
export const EXTRACTION_ATTEMPTS = 3

/** Consigne commune aux deux moteurs (DGLGS_API::ANSWER_STYLE). */
export const ANSWER_STYLE =
  "Réponds en français, comme tu répondrais à un particulier qui cherche un prestataire. Cite nommément des entreprises locales réelles quand tu en connais (noms précis), avec si possible un ordre de préférence. Reste concis."

/** Consigne systeme du moteur ancre sur la recherche Google, avec la ville. */
export function systemInstructionAvecVille(ville: string): string {
  return `${ANSWER_STYLE} L'utilisateur se situe à ${ville}, en France.`
}

/** Consigne systeme de l'extraction structuree des entreprises citees. */
export const EXTRACTION_SYSTEM =
  "Tu extrais les noms d'entreprises locales citées dans des réponses d'assistants IA. Pour chaque réponse numérotée, liste les entreprises DANS L'ORDRE où elles sont recommandées (rang 1 = première recommandée). N'invente rien : uniquement les noms réellement présents dans le texte. Ignore les plateformes génériques (Pages Jaunes, Google Maps, Yelp, TripAdvisor...). Réponds UNIQUEMENT avec un objet JSON : {\"extractions\": [{\"n\": 1, \"entreprises\": [{\"nom\": \"...\", \"rang\": 1}]}]}"

/**
 * Construit les questions localisees.
 *
 * Le nombre demande est borne entre trois et huit, comme dans le plugin.
 */
export function buildPrompts(metier: string, ville: string, nb = NB_PROMPTS): string[] {
  const nombre = Math.max(3, Math.min(8, Math.trunc(nb)))
  return PROMPT_TEMPLATES.slice(0, nombre).map((gabarit) =>
    gabarit.replaceAll('{metier}', metier).replaceAll('{ville}', ville),
  )
}

/** Assemble le corps d'un appel d'extraction (reponses numerotees). */
export function buildExtractionUser(textes: string[]): string {
  let corps = ''
  textes.forEach((texte, index) => {
    corps += `===== Réponse ${index + 1} =====\n${texte.slice(0, 2500)}\n\n`
  })
  return corps
}
