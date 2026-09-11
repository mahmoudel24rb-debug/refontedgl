import type { Lead } from '@/payload-types'

import { getPayloadClient } from './payload'

/* -------------------------------------------------------------------------- */
/* Listes partagees (collection Leads et routes d'API)                        */
/* -------------------------------------------------------------------------- */

/** Option de select Payload : valeur stockee + libelle affiche dans l'admin. */
export interface OptionSelect {
  label: string
  value: string
}

/**
 * Origine du lead. Les valeurs correspondent aux outils et formulaires du
 * site ; elles servent aussi de cle de regroupement dans le champ donnees.
 */
export const LEAD_SOURCES = [
  { label: 'Test PageSpeed', value: 'pagespeed' },
  { label: 'Simulateur de ROI', value: 'roi' },
  { label: 'Test de visibilite IA', value: 'geoscan' },
  { label: 'Generateur de strategie', value: 'strategie' },
  { label: 'Roaster de landing page', value: 'roaster' },
  { label: 'Cahier des charges SaaS', value: 'cdc-saas' },
  { label: 'Cahier des charges site web', value: 'cdc-web' },
  { label: 'Formation Ads', value: 'formation-ads' },
  { label: 'Machine a leads', value: 'machine-a-leads' },
  { label: 'Agence web Tours', value: 'agence-web-tours' },
  { label: 'Carriere', value: 'carriere' },
  { label: 'Contact', value: 'contact' },
  { label: 'Autre', value: 'autre' },
] as const satisfies readonly OptionSelect[]

/** Valeur possible du champ source d'un lead. */
export type LeadSource = (typeof LEAD_SOURCES)[number]['value']

/**
 * Etiquettes reprises telles quelles du CRM WordPress, pour que les
 * segments existants restent exploitables apres migration.
 */
export const LEAD_TAGS = [
  { label: 'PageSpeed Anonyme', value: 'pagespeed-anonyme' },
  { label: 'PageSpeed Tool', value: 'pagespeed-tool' },
  { label: 'Rapport Debloque', value: 'rapport-debloque' },
  { label: 'Audit Performance', value: 'audit-performance' },
  { label: 'Optimisation Site', value: 'optimisation-site' },
  { label: 'Calculateur ROI', value: 'calculateur-roi' },
  { label: 'Budget Ads', value: 'budget-ads' },
  { label: 'Lead Magnet', value: 'lead-magnet' },
  { label: 'GEO Scan', value: 'geo-scan' },
  { label: 'Visibilité IA', value: 'visibilite-ia' },
  { label: 'Lead Chaud', value: 'lead-chaud' },
  { label: 'Lead Qualifie', value: 'lead-qualifie' },
  { label: 'Strategie Marketing IA', value: 'strategie-marketing-ia' },
  { label: 'Landing Page Roaster', value: 'landing-page-roaster' },
  { label: 'Audit CRO IA', value: 'audit-cro-ia' },
  { label: 'Cahier des Charges App/SaaS', value: 'cahier-des-charges-app-saas' },
  { label: 'Projet App', value: 'projet-app' },
  { label: 'Formation Ads', value: 'formation-ads' },
  { label: 'Campagne Meta', value: 'campagne-meta' },
  { label: 'OPCO', value: 'opco' },
  { label: 'Machine à Leads', value: 'machine-a-leads' },
  { label: 'Blueprint PDF', value: 'blueprint-pdf' },
  { label: 'Landing Page DGL', value: 'landing-page-dgl' },
  { label: 'Agence Web Tours', value: 'agence-web-tours' },
  { label: 'Demande Devis', value: 'demande-devis' },
  { label: 'SEO Local Tours', value: 'seo-local-tours' },
  { label: 'Candidature', value: 'candidature' },
  { label: 'Recrutement', value: 'recrutement' },
] as const satisfies readonly OptionSelect[]

/** Valeur possible d'une etiquette de lead. */
export type LeadTag = (typeof LEAD_TAGS)[number]['value']

/** Statuts de suivi commercial. */
export const LEAD_STATUTS = [
  { label: 'Nouveau', value: 'nouveau' },
  { label: 'A rappeler', value: 'a_rappeler' },
  { label: 'Contacte', value: 'contacte' },
  { label: 'Client', value: 'client' },
  { label: 'Perdu', value: 'perdu' },
] as const satisfies readonly OptionSelect[]

/** Valeur possible du champ statut d'un lead. */
export type LeadStatut = (typeof LEAD_STATUTS)[number]['value']

/* -------------------------------------------------------------------------- */
/* Notes au format CRM WordPress                                              */
/* -------------------------------------------------------------------------- */

/** Bloc de la note : titre encadre de tirets puis lignes libres. */
export interface NoteSection {
  titre?: string
  lignes: (string | null | undefined)[]
}

/** Formate une date au format francais jj/mm/aaaa hh:mm (fuseau de Paris). */
export function formatDateFr(date: Date = new Date()): string {
  const parties = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date)
  const lire = (type: Intl.DateTimeFormatPartTypes): string =>
    parties.find((partie) => partie.type === type)?.value ?? ''
  return `${lire('day')}/${lire('month')}/${lire('year')} ${lire('hour')}:${lire('minute')}`
}

/**
 * Construit une note au format des notes du CRM WordPress.
 *
 * Rend un titre encadre (=== TITRE ===), des sections (--- SECTION ---)
 * puis une derniere ligne Date : jj/mm/aaaa hh:mm.
 */
export function buildNote(
  titre: string,
  sections: NoteSection[],
  date: Date = new Date(),
): string {
  const blocs: string[] = [`=== ${titre.toUpperCase()} ===`]

  for (const section of sections) {
    const lignes = section.lignes.filter(
      (ligne): ligne is string => typeof ligne === 'string' && ligne.trim() !== '',
    )
    if (section.titre) {
      blocs.push([`--- ${section.titre.toUpperCase()} ---`, ...lignes].join('\n'))
    } else if (lignes.length > 0) {
      blocs.push(lignes.join('\n'))
    }
  }

  blocs.push(`Date : ${formatDateFr(date)}`)
  return blocs.join('\n\n')
}

/* -------------------------------------------------------------------------- */
/* Creation et deduplication des leads                                        */
/* -------------------------------------------------------------------------- */

/** Champs UTM eventuellement transmis par le formulaire. */
export interface LeadUtm {
  source?: string | null
  medium?: string | null
  campaign?: string | null
  term?: string | null
  content?: string | null
}

/** Arguments de createOrUpdateLead. */
export interface CreateOrUpdateLeadArgs {
  email: string
  prenom?: string | null
  nom?: string | null
  entreprise?: string | null
  telephone?: string | null
  url?: string | null
  source: LeadSource
  tags: LeadTag[]
  note: string
  donnees?: Record<string, unknown>
  consentement?: boolean
  rappelSous2h?: boolean
  ip?: string | null
  userAgent?: string | null
  pageUrl?: string | null
  utm?: LeadUtm | null
}

/** Resultat de createOrUpdateLead. */
export interface CreateOrUpdateLeadResult {
  lead: Lead
  /** true quand le lead existait deja et vient d etre complete. */
  dedoublonne: boolean
}

/** Retourne la valeur si elle est reellement renseignee, sinon undefined. */
function nonVide(valeur: string | null | undefined): string | undefined {
  const propre = typeof valeur === 'string' ? valeur.trim() : ''
  return propre === '' ? undefined : propre
}

/** Objet json quelconque, tel que stocke par Payload. */
type Json = Record<string, unknown>

/** Convertit une valeur de champ json en objet exploitable. */
function versObjet(valeur: unknown): Json {
  return valeur && typeof valeur === 'object' && !Array.isArray(valeur)
    ? ({ ...(valeur as Json) })
    : {}
}

/**
 * Cree un lead ou complete le lead existant portant le meme email.
 *
 * Deduplication par email normalise : les champs vides sont completes,
 * les etiquettes sont unies, une entree datee est poussee dans le
 * journal, les donnees sont fusionnees par outil et le statut ne
 * revient a nouveau que s il valait perdu.
 */
export async function createOrUpdateLead(
  args: CreateOrUpdateLeadArgs,
): Promise<CreateOrUpdateLeadResult> {
  const payload = await getPayloadClient()
  const email = args.email.trim().toLowerCase()
  const maintenant = new Date().toISOString()

  const entreeJournal = {
    date: maintenant,
    source: args.source,
    texte: args.note,
  }

  const existants = await payload.find({
    collection: 'leads',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })

  const existant = existants.docs[0]

  if (!existant) {
    const lead = await payload.create({
      collection: 'leads',
      data: {
        email,
        prenom: nonVide(args.prenom),
        nom: nonVide(args.nom),
        entreprise: nonVide(args.entreprise),
        telephone: nonVide(args.telephone),
        url: nonVide(args.url),
        source: args.source,
        tags: [...new Set(args.tags)],
        statut: 'nouveau',
        rappelSous2h: args.rappelSous2h ?? false,
        consentement: args.consentement ?? false,
        consentementDate: args.consentement ? maintenant : undefined,
        journal: [entreeJournal],
        donnees: args.donnees ? { [args.source]: args.donnees } : {},
        ip: nonVide(args.ip),
        userAgent: nonVide(args.userAgent),
        pageUrl: nonVide(args.pageUrl),
        utm: {
          source: nonVide(args.utm?.source),
          medium: nonVide(args.utm?.medium),
          campaign: nonVide(args.utm?.campaign),
          term: nonVide(args.utm?.term),
          content: nonVide(args.utm?.content),
        },
        derniereActivite: maintenant,
      },
      depth: 0,
    })
    return { lead, dedoublonne: false }
  }

  const tags = [...new Set([...(existant.tags ?? []), ...args.tags])]
  const journal = [...(existant.journal ?? []), entreeJournal]

  const donnees = versObjet(existant.donnees)
  if (args.donnees) {
    donnees[args.source] = { ...versObjet(donnees[args.source]), ...args.donnees }
  }

  const utm = {
    source: nonVide(existant.utm?.source) ?? nonVide(args.utm?.source),
    medium: nonVide(existant.utm?.medium) ?? nonVide(args.utm?.medium),
    campaign: nonVide(existant.utm?.campaign) ?? nonVide(args.utm?.campaign),
    term: nonVide(existant.utm?.term) ?? nonVide(args.utm?.term),
    content: nonVide(existant.utm?.content) ?? nonVide(args.utm?.content),
  }

  const lead = await payload.update({
    collection: 'leads',
    id: existant.id,
    data: {
      prenom: nonVide(existant.prenom) ?? nonVide(args.prenom),
      nom: nonVide(existant.nom) ?? nonVide(args.nom),
      entreprise: nonVide(existant.entreprise) ?? nonVide(args.entreprise),
      telephone: nonVide(existant.telephone) ?? nonVide(args.telephone),
      url: nonVide(existant.url) ?? nonVide(args.url),
      source: args.source,
      tags,
      journal,
      donnees,
      utm,
      statut: existant.statut === 'perdu' ? 'nouveau' : existant.statut,
      rappelSous2h: args.rappelSous2h ? true : (existant.rappelSous2h ?? false),
      consentement: args.consentement ? true : (existant.consentement ?? false),
      consentementDate:
        existant.consentementDate ?? (args.consentement ? maintenant : undefined),
      ip: nonVide(args.ip) ?? nonVide(existant.ip),
      userAgent: nonVide(args.userAgent) ?? nonVide(existant.userAgent),
      pageUrl: nonVide(args.pageUrl) ?? nonVide(existant.pageUrl),
      derniereActivite: maintenant,
    },
    depth: 0,
  })

  return { lead, dedoublonne: true }
}
