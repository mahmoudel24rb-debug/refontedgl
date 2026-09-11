/**
 * Rapport PageSpeed : types partages par la route d'API et l'interface,
 * et construction du rapport a partir de la reponse PageSpeed Insights v5.
 *
 * Le decoupage reproduit le JavaScript WordPress (js.js) : memes
 * metriques, memes regles de tri, memes formats d'affichage.
 */

/* -------------------------------------------------------------------------- */
/* Metriques suivies                                                          */
/* -------------------------------------------------------------------------- */

/** Metriques de laboratoire, dans l'ordre d'affichage. */
export const LAB_METRICS = [
  { id: 'first-contentful-paint', name: 'First Contentful Paint', abbr: 'FCP' },
  { id: 'largest-contentful-paint', name: 'Largest Contentful Paint', abbr: 'LCP' },
  { id: 'total-blocking-time', name: 'Total Blocking Time', abbr: 'TBT' },
  { id: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', abbr: 'CLS' },
  { id: 'speed-index', name: 'Speed Index', abbr: 'SI' },
  { id: 'interactive', name: 'Time to Interactive', abbr: 'TTI' },
] as const

/** Metriques terrain (CrUX), dans l'ordre d'affichage. */
export const FIELD_METRICS = [
  { id: 'FIRST_CONTENTFUL_PAINT_MS', name: 'First Contentful Paint', abbr: 'FCP' },
  { id: 'LARGEST_CONTENTFUL_PAINT_MS', name: 'Largest Contentful Paint', abbr: 'LCP' },
  { id: 'INTERACTION_TO_NEXT_PAINT', name: 'Interaction to Next Paint', abbr: 'INP' },
  { id: 'CUMULATIVE_LAYOUT_SHIFT_SCORE', name: 'Cumulative Layout Shift', abbr: 'CLS' },
  { id: 'EXPERIMENTAL_TIME_TO_FIRST_BYTE', name: 'Time to First Byte', abbr: 'TTFB' },
  { id: 'FIRST_INPUT_DELAY_MS', name: 'First Input Delay', abbr: 'FID' },
] as const

/* -------------------------------------------------------------------------- */
/* Types du rapport                                                           */
/* -------------------------------------------------------------------------- */

/** Qualite d'un score Lighthouse. */
export type AuditCategory = 'good' | 'average' | 'poor' | 'info'

/** Fragment de description : texte simple ou lien (markdown Lighthouse). */
export interface DescriptionSegment {
  text: string
  href?: string
}

/** Tableau de details d'un audit, tronque a dix lignes. */
export interface AuditTable {
  headings: string[]
  rows: string[][]
  /** Nombre de lignes non affichees. */
  reste: number
}

/** Audit Lighthouse pret a l'affichage. */
export interface AuditItem {
  id: string
  title: string
  description: DescriptionSegment[]
  category: AuditCategory
  /** Economie estimee, deja formatee (« 1,2 s », « 320 ms »). */
  savings?: string
  table?: AuditTable
}

/** Metrique de laboratoire prete a l'affichage. */
export interface LabMetricView {
  id: string
  name: string
  abbr: string
  /** Score sur 100, null quand Lighthouse ne le fournit pas. */
  scorePercent: number | null
  displayValue: string
  category: AuditCategory
}

/** Metrique terrain prete a l'affichage. */
export interface FieldMetricView {
  id: string
  name: string
  abbr: string
  /** 75e percentile deja formate (« 1 840 ms », « 0,08 »). */
  valeur: string
  category: AuditCategory
  /** Repartition bon / moyen / lent, en pourcentages entiers. */
  distributions: [number, number, number]
}

/** Rapport pour une strategie (mobile ou ordinateur). */
export interface StrategyReport {
  score: number
  labMetrics: LabMetricView[]
  fieldMetrics: FieldMetricView[]
  /** Verdict global CrUX (FAST, AVERAGE, SLOW), absent sans donnees terrain. */
  overallCategory: string | null
  opportunities: AuditItem[]
  diagnostics: AuditItem[]
  passed: AuditItem[]
}

/** Rapport complet renvoye par /api/tools/pagespeed. */
export interface PageSpeedReport {
  url: string
  finalUrl?: string
  analyzedAt: string
  mobile: StrategyReport
  desktop: StrategyReport
}

/** Reponse de la route d'analyse. */
export interface PageSpeedAnalyzeResponse {
  ok: true
  runId: string
  report: PageSpeedReport
  cacheHit: boolean
}

/* -------------------------------------------------------------------------- */
/* Reponse brute PageSpeed Insights                                           */
/* -------------------------------------------------------------------------- */

interface PsiHeading {
  key?: string | null
  label?: string
  text?: string
  valueType?: string
  itemType?: string
}

interface PsiDetails {
  type?: string
  headings?: PsiHeading[]
  items?: Record<string, unknown>[]
  overallSavingsMs?: number
}

interface PsiAudit {
  id?: string
  title?: string
  description?: string
  score?: number | null
  scoreDisplayMode?: string
  displayValue?: string
  numericValue?: number
  details?: PsiDetails
}

interface PsiAuditRef {
  id: string
  group?: string
}

interface PsiLighthouse {
  finalUrl?: string
  categories?: { performance?: { score?: number | null; auditRefs?: PsiAuditRef[] } }
  audits?: Record<string, PsiAudit>
}

interface PsiMetric {
  percentile?: number
  category?: string
  distributions?: { proportion?: number }[]
}

interface PsiLoadingExperience {
  overall_category?: string
  metrics?: Record<string, PsiMetric>
}

/** Reponse utile de l'API PageSpeed Insights v5. */
export interface PsiResponse {
  id?: string
  lighthouseResult?: PsiLighthouse
  loadingExperience?: PsiLoadingExperience
}

/* -------------------------------------------------------------------------- */
/* Formatage                                                                  */
/* -------------------------------------------------------------------------- */

/** Categorie d'un score Lighthouse (0 a 1). */
export function categoriePourScore(score: number | null | undefined): AuditCategory {
  if (score === null || score === undefined) return 'info'
  if (score >= 0.9) return 'good'
  if (score >= 0.5) return 'average'
  return 'poor'
}

/** Categorie d'une metrique terrain CrUX. */
function categoriePourCrux(categorie: string | undefined): AuditCategory {
  const valeur = (categorie ?? '').toLowerCase()
  if (valeur === 'fast') return 'good'
  if (valeur === 'average') return 'average'
  if (valeur === 'slow') return 'poor'
  return 'average'
}

/** Duree en millisecondes, basculee en secondes au dela de 1000 ms. */
export function formatMs(valeur: number): string {
  const ms = Math.round(valeur)
  if (ms >= 1000) return `${(ms / 1000).toFixed(1).replace('.', ',')} s`
  return `${ms} ms`
}

/** Poids en kilo ou mega octets. */
function formatOctets(valeur: number): string {
  const ko = Number(valeur) / 1024
  if (ko >= 1024) return `${(ko / 1024).toFixed(1).replace('.', ',')} MB`
  return `${ko.toFixed(1).replace('.', ',')} KB`
}

/** URL tronquee a 80 caracteres. */
function tronquerUrl(url: string): string {
  return url.length > 80 ? `${url.substring(0, 77)}...` : url
}

/** Valeur d'une cellule de tableau, selon le type declare par Lighthouse. */
function formatValeurAudit(valeur: unknown, type: string | undefined): string {
  if (valeur === undefined || valeur === null) return '-'

  if (typeof valeur === 'object') {
    const objet = valeur as { url?: unknown; text?: unknown }
    if (typeof objet.url === 'string') return tronquerUrl(objet.url)
    if (typeof objet.text === 'string') return objet.text
    return '-'
  }

  switch (type) {
    case 'ms':
    case 'timespanMs':
      return formatMs(Number(valeur))
    case 'bytes':
      return formatOctets(Number(valeur))
    case 'url':
    case 'source-location':
      return tronquerUrl(String(valeur))
    case 'numeric':
      return Number(valeur).toLocaleString('fr-FR')
    default:
      return String(valeur)
  }
}

/** true quand un lien de description peut etre rendu tel quel. */
function lienSur(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/**
 * Convertit une description Lighthouse (markdown `[texte](url)`) en
 * fragments. Les liens qui ne sont pas en http(s) restent du texte.
 */
export function parseDescription(description: string): DescriptionSegment[] {
  const segments: DescriptionSegment[] = []
  const motif = /\[([^\]]+)\]\(([^)]+)\)/g
  let index = 0
  let correspondance = motif.exec(description)

  while (correspondance) {
    if (correspondance.index > index) {
      segments.push({ text: description.slice(index, correspondance.index) })
    }
    const texte = correspondance[1] ?? ''
    const href = (correspondance[2] ?? '').trim()
    segments.push(lienSur(href) ? { text: texte, href } : { text: texte })
    index = correspondance.index + correspondance[0].length
    correspondance = motif.exec(description)
  }

  if (index < description.length) {
    segments.push({ text: description.slice(index) })
  }

  return segments.filter((segment) => segment.text !== '')
}

/* -------------------------------------------------------------------------- */
/* Construction du rapport                                                    */
/* -------------------------------------------------------------------------- */

/** Nombre maximal de lignes affichees par tableau d'audit. */
const LIGNES_MAX = 10

/** Groupes d'audits jamais affiches dans les listes. */
const GROUPES_EXCLUS = new Set(['metrics', 'budgets', 'hidden'])

/** Tableau de details d'un audit, quand il y en a un d'exploitable. */
function construireTable(details: PsiDetails | undefined): AuditTable | undefined {
  if (!details || !details.items || details.items.length === 0) return undefined
  if (details.type !== 'table' && details.type !== 'opportunity') return undefined

  const headings = details.headings ?? []
  if (headings.length === 0) return undefined

  const rows = details.items.slice(0, LIGNES_MAX).map((item) =>
    headings.map((heading) => {
      const cle = heading.key ?? heading.valueType ?? ''
      return formatValeurAudit(item[cle], heading.valueType ?? heading.itemType)
    }),
  )

  return {
    headings: headings.map(
      (heading) => heading.label ?? heading.text ?? heading.key ?? '',
    ),
    rows,
    reste: Math.max(0, details.items.length - LIGNES_MAX),
  }
}

/** Economie estimee d'une opportunite, deja formatee. */
function economie(audit: PsiAudit): string | undefined {
  const brut =
    typeof audit.details?.overallSavingsMs === 'number'
      ? audit.details.overallSavingsMs
      : audit.numericValue

  if (typeof brut !== 'number' || !Number.isFinite(brut)) return undefined
  const ms = Math.round(brut)
  if (ms <= 100) return undefined
  return formatMs(ms)
}

/** Transforme un audit Lighthouse en element de liste. */
function versAuditItem(
  id: string,
  audit: PsiAudit,
  avecEconomie: boolean,
): AuditItem {
  return {
    id,
    title: audit.title ?? id,
    description: parseDescription(audit.description ?? ''),
    category: categoriePourScore(audit.score),
    savings: avecEconomie ? economie(audit) : undefined,
    table: construireTable(audit.details),
  }
}

/** Metriques de laboratoire du rapport. */
function construireLabMetrics(
  audits: Record<string, PsiAudit> | undefined,
): LabMetricView[] {
  if (!audits) return []

  return LAB_METRICS.flatMap((metrique) => {
    const audit = audits[metrique.id]
    if (!audit) return []
    const score = audit.score ?? null
    return [
      {
        id: metrique.id,
        name: metrique.name,
        abbr: metrique.abbr,
        scorePercent: score === null ? null : Math.round(score * 100),
        displayValue: audit.displayValue ?? '-',
        category: categoriePourScore(score),
      },
    ]
  })
}

/** Metriques terrain du rapport (vides sans donnees CrUX). */
function construireFieldMetrics(
  experience: PsiLoadingExperience | undefined,
): FieldMetricView[] {
  const metrics = experience?.metrics
  if (!metrics || !experience?.overall_category) return []

  return FIELD_METRICS.flatMap((metrique) => {
    const donnees = metrics[metrique.id]
    if (!donnees) return []

    const estCls = metrique.id.includes('LAYOUT_SHIFT')
    const percentile = donnees.percentile
    let valeur = '-'
    if (typeof percentile === 'number') {
      valeur = estCls
        ? (percentile / 100).toFixed(2).replace('.', ',')
        : `${percentile.toLocaleString('fr-FR')} ms`
    }

    const parts = donnees.distributions ?? []
    const pourcentage = (index: number): number =>
      Math.round((parts[index]?.proportion ?? 0) * 100)

    return [
      {
        id: metrique.id,
        name: metrique.name,
        abbr: metrique.abbr,
        valeur,
        category: categoriePourCrux(donnees.category),
        distributions: [pourcentage(0), pourcentage(1), pourcentage(2)] as [
          number,
          number,
          number,
        ],
      },
    ]
  })
}

/**
 * Construit le rapport d'une strategie a partir de la reponse PSI.
 *
 * Renvoie null quand Lighthouse n'a pas pu analyser la page (categorie
 * performance absente) : l'appelant transforme alors le run en echec.
 */
export function buildStrategyReport(reponse: PsiResponse): StrategyReport | null {
  const lighthouse = reponse.lighthouseResult
  const performance = lighthouse?.categories?.performance
  if (!lighthouse || !performance) return null

  const audits = lighthouse.audits ?? {}
  const opportunities: AuditItem[] = []
  const diagnostics: AuditItem[] = []
  const passed: AuditItem[] = []
  const scores = new Map<string, number>()

  for (const ref of performance.auditRefs ?? []) {
    const audit = audits[ref.id]
    if (!audit) continue
    if (ref.group && GROUPES_EXCLUS.has(ref.group)) continue

    if (audit.score === 1) {
      passed.push(versAuditItem(ref.id, audit, false))
      continue
    }
    if (audit.score === null && audit.scoreDisplayMode === 'notApplicable') {
      continue
    }

    const estOpportunite = ref.group === 'load-opportunities'
    const element = versAuditItem(ref.id, audit, estOpportunite)
    scores.set(ref.id, audit.score ?? 0)
    if (estOpportunite) {
      opportunities.push(element)
    } else {
      diagnostics.push(element)
    }
  }

  // Tri par score croissant : les problemes les plus lourds en premier.
  const parScore = (a: AuditItem, b: AuditItem): number =>
    (scores.get(a.id) ?? 0) - (scores.get(b.id) ?? 0)
  opportunities.sort(parScore)
  diagnostics.sort(parScore)

  return {
    score: Math.round((performance.score ?? 0) * 100),
    labMetrics: construireLabMetrics(audits),
    fieldMetrics: construireFieldMetrics(reponse.loadingExperience),
    overallCategory: reponse.loadingExperience?.overall_category ?? null,
    opportunities,
    diagnostics,
    passed,
  }
}
