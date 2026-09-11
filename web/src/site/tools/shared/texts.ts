/**
 * Textes partages par les formulaires des outils (libelles, messages de
 * validation, etats). Repris mot pour mot du JavaScript WordPress.
 * Chaque outil peut les surcharger via les props de LeadForm.
 */

/** Champ mobilisable par un formulaire d'outil. */
export type LeadFieldName =
  | 'entreprise'
  | 'email'
  | 'telephone'
  | 'prenom'
  | 'nom'
  | 'consent'

/** Libelle, espace reserve et attribut d'auto-remplissage d'un champ. */
export interface LeadFieldTexts {
  label: string
  placeholder: string
  autoComplete: string
  type: 'text' | 'email' | 'tel'
}

export const LEAD_FIELDS: Record<
  Exclude<LeadFieldName, 'consent'>,
  LeadFieldTexts
> = {
  entreprise: {
    label: "Nom de l'entreprise *",
    placeholder: 'Ma Super Entreprise',
    autoComplete: 'organization',
    type: 'text',
  },
  email: {
    label: 'Email professionnel *',
    placeholder: 'jean@entreprise.fr',
    autoComplete: 'email',
    type: 'email',
  },
  telephone: {
    label: 'Téléphone *',
    placeholder: '06 12 34 56 78',
    autoComplete: 'tel',
    type: 'tel',
  },
  prenom: {
    label: 'Prénom *',
    placeholder: 'Jean',
    autoComplete: 'given-name',
    type: 'text',
  },
  nom: {
    label: 'Nom *',
    placeholder: 'Dupont',
    autoComplete: 'family-name',
    type: 'text',
  },
}

/** Case a cocher de consentement (outils qui rappellent sous 2 h). */
export const LEAD_CONSENT_LABEL =
  "J'accepte d'être recontacté par DGL Agency au sujet de mes résultats."

/** Messages de validation cote navigateur, identiques au JS WordPress. */
export const LEAD_MESSAGES = {
  entrepriseManquante: "Veuillez indiquer le nom de votre entreprise.",
  emailInvalide: 'Veuillez entrer une adresse email valide.',
  telephoneInvalide: 'Veuillez entrer un numéro de téléphone valide.',
  champsManquants: 'Veuillez remplir tous les champs obligatoires.',
  consentementManquant: "Veuillez accepter d'être recontacté.",
  erreurReseau: 'Une erreur est survenue. Réessayez.',
  envoiEnCours: 'Envoi en cours...',
} as const
