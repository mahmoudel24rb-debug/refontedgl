/**
 * Matrices de reference du simulateur de ROI publicitaire.
 *
 * Portage fidele de `roi-calculator.js` (WordPress) : deux plateformes,
 * treize secteurs, pre-selection de la recurrence par secteur et aide
 * contextuelle sur le ticket moyen. Aucune valeur n'est arrondie ni
 * reinterpretee : les chiffres sont ceux du calculateur en production.
 *
 * Sources annoncees : WordStream 2025, LocaliQ, donnees moyennes agence.
 */

/** Plateforme publicitaire simulee. */
export type Platform = 'meta' | 'google'

/** Cle d'un des treize secteurs d'activite. */
export type SecteurKey =
  | 'b2b'
  | 'ecommerce'
  | 'immobilier'
  | 'sante'
  | 'juridique'
  | 'artisan'
  | 'automobile'
  | 'formation'
  | 'restauration'
  | 'assurance'
  | 'voyage'
  | 'tech'
  | 'autre'

/** Type de vente, qui determine la valeur vie client. */
export type Recurrence = 'unique' | 'mensuel' | 'annuel' | 'visite'

/** Moyennes de marche d'un secteur sur une plateforme. */
export interface Benchmark {
  /** Cout par clic moyen, en euros. */
  cpc: number
  /** Taux de conversion moyen, en pourcentage. */
  cvr: number
  /** Taux de closing moyen (lead vers client), en pourcentage. */
  closeRate: number
  /** Libelle du secteur repris dans les diagnostics. */
  label: string
}

/** Benchmarks par plateforme et par secteur (roi-calculator.js:14-45). */
export const BENCHMARKS: Record<Platform, Record<SecteurKey, Benchmark>> = {
  meta: {
    b2b: { cpc: 1.65, cvr: 9.3, closeRate: 12, label: 'B2B / Services Pro' },
    ecommerce: { cpc: 0.7, cvr: 3.8, closeRate: 100, label: 'E-commerce' },
    immobilier: { cpc: 1.45, cvr: 9.5, closeRate: 3, label: 'Immobilier' },
    sante: { cpc: 2.25, cvr: 5.6, closeRate: 18, label: 'Santé / Bien-être' },
    juridique: { cpc: 3.75, cvr: 10.5, closeRate: 10, label: 'Juridique (Avocats)' },
    artisan: { cpc: 2.05, cvr: 5.2, closeRate: 35, label: 'Artisanat / Travaux' },
    automobile: { cpc: 1.75, cvr: 6.0, closeRate: 8, label: 'Automobile' },
    formation: { cpc: 1.5, cvr: 10.0, closeRate: 12, label: 'Éducation / Formation' },
    restauration: { cpc: 0.68, cvr: 18.0, closeRate: 55, label: 'Restauration' },
    assurance: { cpc: 2.75, cvr: 5.0, closeRate: 10, label: 'Assurances / Finance' },
    voyage: { cpc: 1.0, cvr: 5.5, closeRate: 15, label: 'Voyage / Tourisme' },
    tech: { cpc: 1.85, cvr: 7.0, closeRate: 10, label: 'Tech / SaaS' },
    autre: { cpc: 1.75, cvr: 7.7, closeRate: 10, label: 'Autre' },
  },
  google: {
    b2b: { cpc: 4.2, cvr: 4.5, closeRate: 20, label: 'B2B / Services Pro' },
    ecommerce: { cpc: 0.85, cvr: 2.5, closeRate: 100, label: 'E-commerce' },
    immobilier: { cpc: 1.6, cvr: 3.2, closeRate: 5, label: 'Immobilier' },
    sante: { cpc: 1.9, cvr: 6.5, closeRate: 25, label: 'Santé / Bien-être' },
    juridique: { cpc: 6.8, cvr: 3.8, closeRate: 15, label: 'Juridique (Avocats)' },
    artisan: { cpc: 5.5, cvr: 12.0, closeRate: 45, label: 'Artisanat / Travaux' },
    automobile: { cpc: 2.1, cvr: 3.0, closeRate: 12, label: 'Automobile' },
    formation: { cpc: 2.8, cvr: 5.5, closeRate: 18, label: 'Éducation / Formation' },
    restauration: { cpc: 1.1, cvr: 9.0, closeRate: 70, label: 'Restauration' },
    assurance: { cpc: 7.5, cvr: 4.0, closeRate: 15, label: 'Assurances / Finance' },
    voyage: { cpc: 1.3, cvr: 4.0, closeRate: 20, label: 'Voyage / Tourisme' },
    tech: { cpc: 5.0, cvr: 6.0, closeRate: 15, label: 'Tech / SaaS' },
    autre: { cpc: 2.5, cvr: 4.0, closeRate: 15, label: 'Autre' },
  },
}

/** Coefficients du scenario « avec DGL Agency » (roi-calculator.js:369-371). */
export const UPLIFTS = {
  /** Cout par clic reduit de 30 %. */
  cpc: 0.7,
  /** Taux de conversion ameliore de 40 %. */
  cvr: 1.4,
  /** Taux de closing ameliore de 20 %. */
  closeRate: 1.2,
} as const

/** Option du menu deroulant des secteurs. */
export interface SecteurOption {
  value: SecteurKey
  label: string
}

/** Les treize secteurs, dans l'ordre du menu deroulant WordPress. */
export const SECTEURS: readonly SecteurOption[] = [
  { value: 'b2b', label: 'B2B / Services aux entreprises' },
  { value: 'ecommerce', label: 'E-commerce / Boutique en ligne' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'sante', label: 'Santé / Bien-être' },
  { value: 'juridique', label: 'Juridique (Avocats)' },
  { value: 'artisan', label: 'Artisanat / Travaux' },
  { value: 'automobile', label: 'Automobile' },
  { value: 'formation', label: 'Éducation / Formation' },
  { value: 'restauration', label: 'Restauration' },
  { value: 'assurance', label: 'Assurances / Finance' },
  { value: 'voyage', label: 'Voyage / Tourisme' },
  { value: 'tech', label: 'Tech / SaaS' },
  { value: 'autre', label: 'Autre' },
] as const

/** Liste brute des cles de secteur, pour les schemas de validation. */
export const SECTEUR_KEYS = SECTEURS.map((secteur) => secteur.value) as SecteurKey[]

/** Reglage du champ retention associe a un type de vente. */
export interface RecurrenceOption {
  value: Recurrence
  /** Libelle du menu deroulant « Type de vente ». */
  label: string
  /** Champ retention affiche (faux pour l'achat unique). */
  retention: null | {
    label: string
    placeholder: string
    unit: string
    min: number
    max: number
    /** Valeur posee quand le champ est vide. */
    defaut: number
  }
}

/** Les quatre types de vente (roi-calculator.html + updateRetentionField). */
export const RECURRENCES: readonly RecurrenceOption[] = [
  {
    value: 'unique',
    label: 'Achat unique (ex : e-commerce, artisan)',
    retention: null,
  },
  {
    value: 'mensuel',
    label: 'Abonnement mensuel (ex : salle de sport, SaaS)',
    retention: {
      label: "Durée moyenne d'abonnement",
      placeholder: 'ex : 10',
      unit: 'mois',
      min: 1,
      max: 60,
      defaut: 10,
    },
  },
  {
    value: 'annuel',
    label: 'Abonnement annuel (ex : assurance, formation)',
    retention: {
      label: 'Nombre de renouvellements',
      placeholder: 'ex : 2',
      unit: 'ans',
      min: 1,
      max: 10,
      defaut: 2,
    },
  },
  {
    value: 'visite',
    label: 'Visites récurrentes (ex : restaurant, coiffeur)',
    retention: {
      label: 'Visites par an en moyenne',
      placeholder: 'ex : 8',
      unit: 'fois/an',
      min: 1,
      max: 100,
      defaut: 8,
    },
  },
] as const

/** Retourne le reglage d'un type de vente. */
export function recurrenceOption(valeur: Recurrence): RecurrenceOption {
  const trouve = RECURRENCES.find((option) => option.value === valeur)
  return trouve ?? RECURRENCES[0]!
}

/** Pre-selection appliquee quand le visiteur choisit un secteur. */
export interface SecteurDefaults {
  type: Recurrence
  /** 0 quand aucune retention n'a de sens (achat unique). */
  retention: number
  /** Espace reserve du champ ticket moyen. */
  placeholder: string
}

/** Pre-selection de la recurrence par secteur (CHANGEMENT 1 du JS WP). */
export const DEFAULT_RECURRENCE: Record<SecteurKey, SecteurDefaults> = {
  b2b: { type: 'mensuel', retention: 12, placeholder: 'ex : 2 000' },
  ecommerce: { type: 'visite', retention: 4, placeholder: 'ex : 65' },
  immobilier: { type: 'unique', retention: 0, placeholder: 'ex : 8 000' },
  sante: { type: 'visite', retention: 6, placeholder: 'ex : 80' },
  juridique: { type: 'unique', retention: 0, placeholder: 'ex : 3 000' },
  artisan: { type: 'unique', retention: 0, placeholder: 'ex : 2 500' },
  automobile: { type: 'unique', retention: 0, placeholder: 'ex : 15 000' },
  formation: { type: 'unique', retention: 0, placeholder: 'ex : 3 500' },
  restauration: { type: 'visite', retention: 8, placeholder: 'ex : 25' },
  assurance: { type: 'annuel', retention: 3, placeholder: 'ex : 1 200' },
  voyage: { type: 'unique', retention: 0, placeholder: 'ex : 800' },
  tech: { type: 'mensuel', retention: 18, placeholder: 'ex : 49' },
  autre: { type: 'unique', retention: 0, placeholder: 'ex : 150' },
}

/** Aide contextuelle sous le champ ticket moyen (CHANGEMENT 6c du JS WP). */
export const TICKET_HELP: Record<SecteurKey, string> = {
  b2b: "Valeur moyenne d'un contrat ou d'une prestation",
  ecommerce: 'Panier moyen de votre boutique en ligne',
  immobilier: 'Commission moyenne ou honoraires par transaction',
  sante: "Prix moyen d'une consultation ou séance",
  juridique: 'Honoraires moyens par dossier',
  artisan: "Montant moyen d'un chantier ou intervention",
  automobile: 'Marge moyenne par véhicule ou réparation',
  formation: "Prix moyen d'une formation ou d'un cursus",
  restauration: 'Addition moyenne par client',
  assurance: "Prime annuelle moyenne d'un contrat",
  voyage: "Panier moyen d'un séjour ou voyage",
  tech: 'Prix de votre abonnement mensuel',
  autre: 'Montant moyen par transaction',
}

/** Montants proposes sous le champ budget (roi-calculator.html). */
export const PRESETS_BUDGET: readonly number[] = [500, 1000, 2000, 5000] as const

/** Libelles des plateformes utilises dans les resultats et le CRM. */
export const PLATFORM_LABELS: Record<Platform, string> = {
  meta: 'Meta Ads',
  google: 'Google Ads',
}

/** Mention des sources affichee sous le simulateur. */
export const BENCHMARK_SOURCES =
  'Sources : WordStream 2025, LocaliQ et données moyennes agence.'
