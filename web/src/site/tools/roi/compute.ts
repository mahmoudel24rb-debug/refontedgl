import {
  BENCHMARKS,
  UPLIFTS,
  recurrenceOption,
  type Platform,
  type Recurrence,
  type SecteurKey,
  PLATFORM_LABELS,
} from './benchmarks'
import {
  ROI_DIAGNOSTIC_HEADINGS,
  ROI_DIAGNOSTIC_REASONS,
  ROI_ERRORS,
  ROI_PERIODES,
  type DiagnosticReason,
} from './texts'

/**
 * Calculs purs du simulateur de ROI.
 *
 * Portage ligne a ligne de `calculate()` et `showDiagnostic()` de
 * `roi-calculator.js` : memes arrondis, memes coefficients et memes
 * conditions. Aucune dependance au navigateur : le module est utilisable
 * par le composant client comme par un script de verification.
 */

export { formatCpc, formatCurrency, formatNumber, formatPercent, formatRoi } from './format'
export type { Platform, Recurrence, SecteurKey } from './benchmarks'

/** Donnees saisies par le visiteur. */
export interface RoiInput {
  platform: Platform
  secteur: SecteurKey
  /** Budget publicitaire mensuel, en euros. */
  budget: number
  /** Ticket moyen, en euros. */
  ticket: number
  recurrence: Recurrence
  /** Duree de retention ou frequence, ignoree pour l'achat unique. */
  retention: number
}

/** Scenario aux moyennes de marche. */
export interface RoiBrut {
  /** Retour sur investissement, arrondi a l'entier (en pourcentage). */
  roi: number
  /** Chiffre d'affaires estime. */
  ca: number
  clients: number
  clics: number
  leads: number
  /** Benefice net : chiffre d'affaires moins budget. */
  profit: number
  cpc: number
  cvr: number
  /** Cout d'acquisition client. */
  cac: number
  /** Ticket multiplie par la valeur vie client. */
  ticketLTV: number
  ltvMultiplier: number
  /** Libelle du secteur, tel qu'affiche dans les diagnostics. */
  secteurLabel: string
  /** Libelle de la plateforme (Meta Ads, Google Ads). */
  platformLabel: string
  budget: number
  ticket: number
  recurrence: Recurrence
  /** Retention retenue, 0 pour un achat unique. */
  retention: number
}

/** Scenario « avec DGL Agency ». */
export interface RoiOptimise {
  roi: number
  ca: number
  clients: number
  clics: number
  leads: number
  profit: number
}

/** Bloc de diagnostic affiche quand au moins un ROI est negatif. */
export interface RoiDiagnostic {
  title: string
  subtitle: string
  reasons: DiagnosticReason[]
}

/** Resultat complet d'une simulation. */
export interface RoiResult {
  brut: RoiBrut
  optimise: RoiOptimise
  /** Mention de la periode de reference, absente pour un achat unique. */
  periode: string | null
  /** Diagnostic, absent quand les deux scenarios sont positifs. */
  diagnostic: RoiDiagnostic | null
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Controle la retention selon le type de vente.
 *
 * Retourne le message d'erreur WordPress, ou null quand la valeur passe :
 * mensuel 1 a 60, annuel 1 a 10, visite 1 a 100. L'achat unique
 * n'impose rien.
 */
export function validateRetention(
  recurrence: Recurrence,
  retention: number,
): string | null {
  if (recurrence === 'unique') return null

  if (!retention || retention < 1 || !Number.isFinite(retention)) {
    return ROI_ERRORS.retentionManquante
  }
  if (recurrence === 'mensuel' && retention > 60) return ROI_ERRORS.retentionMensuel
  if (recurrence === 'annuel' && retention > 10) return ROI_ERRORS.retentionAnnuel
  if (recurrence === 'visite' && retention > 100) return ROI_ERRORS.retentionVisite
  return null
}

/** Entree partielle du formulaire, avant validation. */
export interface RoiDraft {
  platform: Platform
  secteur: SecteurKey | ''
  budget: number | null
  ticket: number | null
  recurrence: Recurrence
  retention: number | null
}

/**
 * Controle l'ensemble du formulaire, dans l'ordre de `calculate()`.
 *
 * Retourne l'entree validee, ou le message d'erreur a afficher.
 */
export function validateRoiInput(
  draft: RoiDraft,
): { ok: true; input: RoiInput } | { ok: false; message: string } {
  if (!draft.secteur) return { ok: false, message: ROI_ERRORS.secteurManquant }
  if (!draft.budget || draft.budget < 100) {
    return { ok: false, message: ROI_ERRORS.budgetManquant }
  }
  if (!draft.ticket || draft.ticket < 1) {
    return { ok: false, message: ROI_ERRORS.ticketManquant }
  }

  const retention = draft.retention ?? 0
  const probleme = validateRetention(draft.recurrence, retention)
  if (probleme) return { ok: false, message: probleme }

  if (!BENCHMARKS[draft.platform][draft.secteur]) {
    return { ok: false, message: ROI_ERRORS.secteurInconnu }
  }

  return {
    ok: true,
    input: {
      platform: draft.platform,
      secteur: draft.secteur,
      budget: draft.budget,
      ticket: draft.ticket,
      recurrence: draft.recurrence,
      retention: draft.recurrence === 'unique' ? 0 : retention,
    },
  }
}

/* -------------------------------------------------------------------------- */
/* Calcul                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Multiplicateur de valeur vie client (getLTVMultiplier du JS WordPress).
 *
 * Achat unique : 1. Abonnement mensuel, annuel ou visites recurrentes :
 * la retention elle-meme.
 */
export function ltvMultiplier(recurrence: Recurrence, retention: number): number {
  switch (recurrence) {
    case 'unique':
      return 1
    case 'mensuel':
    case 'annuel':
    case 'visite':
      return retention
    default:
      return 1
  }
}

/** Mention de la periode de reference sous les colonnes de resultats. */
function periodeDeReference(brut: RoiBrut): string | null {
  if (brut.recurrence === 'unique') return null
  if (brut.recurrence === 'mensuel') return ROI_PERIODES.mensuel(brut.retention)
  if (brut.recurrence === 'annuel') return ROI_PERIODES.annuel(brut.retention)
  return ROI_PERIODES.visite(brut.retention, brut.ticket)
}

/**
 * Construit le diagnostic (showDiagnostic du JS WordPress).
 *
 * Trois cas : les deux scenarios positifs (aucun diagnostic), brut
 * negatif mais optimise positif (message d'encouragement), les deux
 * negatifs (causes conditionnelles). Le conseil actionnable ferme
 * toujours la liste.
 */
function construireDiagnostic(
  brut: RoiBrut,
  optimise: RoiOptimise,
): RoiDiagnostic | null {
  if (brut.roi >= 0 && optimise.roi >= 0) return null

  const reasons: DiagnosticReason[] = []
  let entete: { title: string; subtitle: string }

  if (brut.roi < 0 && optimise.roi >= 0) {
    entete = ROI_DIAGNOSTIC_HEADINGS.redressable
    reasons.push(ROI_DIAGNOSTIC_REASONS.leviers(brut.roi, optimise.roi))
  } else if (brut.roi < 0 && optimise.roi < 0) {
    entete = ROI_DIAGNOSTIC_HEADINGS.negatif

    const unique = brut.recurrence === 'unique'

    if (brut.ticketLTV < brut.cac) {
      reasons.push(
        ROI_DIAGNOSTIC_REASONS.valeurClient(
          unique,
          unique ? brut.ticket : brut.ticketLTV,
          brut.cac,
        ),
      )
    }
    if (brut.cpc >= 4) {
      reasons.push(ROI_DIAGNOSTIC_REASONS.cpcEleve(brut.secteurLabel, brut.cpc))
    }
    if (brut.clics < 100) {
      reasons.push(ROI_DIAGNOSTIC_REASONS.budgetFaible(brut.budget, brut.clics))
    }
    if (brut.cvr < 3) {
      reasons.push(ROI_DIAGNOSTIC_REASONS.conversionBasse(brut.secteurLabel, brut.cvr))
    }
    if (reasons.length === 0) {
      reasons.push(ROI_DIAGNOSTIC_REASONS.ratioDefavorable(brut.ticketLTV, brut.cac))
    }
  } else {
    // ROI brut positif mais optimise negatif : impossible avec les
    // coefficients actuels, aucun diagnostic ne serait pertinent.
    return null
  }

  // Conseil actionnable : valeur client minimale pour couvrir le CAC.
  const minTicketLTV = brut.cac * 1.3
  if (brut.recurrence === 'unique') {
    reasons.push(ROI_DIAGNOSTIC_REASONS.conseilUnique(minTicketLTV))
  } else if (brut.recurrence === 'mensuel') {
    reasons.push(
      ROI_DIAGNOSTIC_REASONS.conseilMensuel(
        minTicketLTV,
        brut.retention,
        Math.ceil(minTicketLTV / brut.retention),
      ),
    )
  } else if (brut.recurrence === 'annuel') {
    reasons.push(
      ROI_DIAGNOSTIC_REASONS.conseilAnnuel(
        minTicketLTV,
        brut.retention,
        Math.ceil(minTicketLTV / brut.retention),
      ),
    )
  } else {
    reasons.push(
      ROI_DIAGNOSTIC_REASONS.conseilVisite(
        minTicketLTV,
        brut.retention,
        Math.ceil(minTicketLTV / brut.retention),
      ),
    )
  }

  return { title: entete.title, subtitle: entete.subtitle, reasons }
}

/**
 * Calcule les deux scenarios d'une simulation.
 *
 * Scenario brut : moyennes de marche du secteur. Scenario optimise :
 * cout par clic x 0,70, taux de conversion x 1,40, taux de closing
 * x 1,20. Les arrondis intermediaires sont ceux du JavaScript
 * WordPress, y compris le plancher d'un client.
 */
export function computeRoi(input: RoiInput): RoiResult {
  const data = BENCHMARKS[input.platform][input.secteur]
  const retention = input.recurrence === 'unique' ? 0 : input.retention

  const multiplicateur = ltvMultiplier(
    input.recurrence,
    input.recurrence === 'unique' ? 1 : input.retention,
  )
  const ticketLTV = input.ticket * multiplicateur

  const clics = Math.round(input.budget / data.cpc)
  const leads = Math.round(clics * (data.cvr / 100))
  const clients = Math.max(1, Math.round(leads * (data.closeRate / 100)))
  const ca = clients * ticketLTV
  const profit = ca - input.budget
  const roi = ((ca - input.budget) / input.budget) * 100
  const cac = clients > 0 ? input.budget / clients : input.budget

  const brut: RoiBrut = {
    roi: Math.round(roi),
    ca,
    clients,
    clics,
    leads,
    profit,
    cpc: data.cpc,
    cvr: data.cvr,
    cac,
    ticketLTV,
    ltvMultiplier: multiplicateur,
    secteurLabel: data.label,
    platformLabel: PLATFORM_LABELS[input.platform],
    budget: input.budget,
    ticket: input.ticket,
    recurrence: input.recurrence,
    retention,
  }

  const optCpc = data.cpc * UPLIFTS.cpc
  const optCvr = data.cvr * UPLIFTS.cvr
  const optCloseRate = data.closeRate * UPLIFTS.closeRate

  const optClics = Math.round(input.budget / optCpc)
  const optLeads = Math.round(optClics * (optCvr / 100))
  const optClients = Math.max(1, Math.round(optLeads * (optCloseRate / 100)))
  const optCA = optClients * ticketLTV
  const optProfit = optCA - input.budget
  const optRoi = ((optCA - input.budget) / input.budget) * 100

  const optimise: RoiOptimise = {
    roi: Math.round(optRoi),
    ca: optCA,
    clients: optClients,
    clics: optClics,
    leads: optLeads,
    profit: optProfit,
  }

  return {
    brut,
    optimise,
    periode: periodeDeReference(brut),
    diagnostic: construireDiagnostic(brut, optimise),
  }
}

/** Reglage du champ retention pour un type de vente donne. */
export { recurrenceOption }
