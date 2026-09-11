'use client'

import { LEAD_MESSAGES } from './texts'
import type { LeadFormOutcome, LeadFormValues } from './LeadForm'

/**
 * Envoi commun des formulaires d'outil vers les routes /api/tools/*.
 * Ajoute la page d'origine et les parametres UTM, et traduit la reponse
 * en verdict exploitable par LeadForm.
 */

/** Parametres UTM eventuellement presents dans l'URL courante. */
export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

/** Lit les parametres UTM de l'URL courante. */
export function readUtm(): UtmParams {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const lire = (nom: string): string | undefined => {
    const valeur = params.get(`utm_${nom}`)
    return valeur ? valeur.slice(0, 190) : undefined
  }
  return {
    source: lire('source'),
    medium: lire('medium'),
    campaign: lire('campaign'),
    term: lire('term'),
    content: lire('content'),
  }
}

/** Corps de reponse commun des routes d'outil. */
interface ReponseApi {
  ok?: boolean
  error?: string
  fake?: boolean
}

/**
 * Poste les valeurs d'un formulaire vers une route d'outil.
 *
 * `extra` complete le corps (identifiant de run, intention, donnees de
 * simulation). La page d'origine et les UTM sont ajoutes ici.
 */
export async function postLead(
  endpoint: string,
  valeurs: LeadFormValues,
  extra: Record<string, unknown> = {},
): Promise<LeadFormOutcome> {
  const reponse = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...extra,
      entreprise: valeurs.entreprise,
      email: valeurs.email,
      telephone: valeurs.telephone,
      prenom: valeurs.prenom,
      nom: valeurs.nom,
      consent: valeurs.consent,
      website: valeurs.website,
      ts: valeurs.ts,
      pageUrl: typeof window === 'undefined' ? undefined : window.location.href,
      utm: readUtm(),
    }),
  })

  let donnees: ReponseApi = {}
  try {
    donnees = (await reponse.json()) as ReponseApi
  } catch {
    donnees = {}
  }

  if (reponse.ok && donnees.ok !== false) {
    return { ok: true }
  }

  return { ok: false, message: donnees.error ?? LEAD_MESSAGES.erreurReseau }
}
