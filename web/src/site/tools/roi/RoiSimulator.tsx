'use client'

import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  Lightbulb,
  Lock,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { trackEvent, trackLead } from '@/lib/tracking'

import { useReducedMotion } from '../../hooks/useReducedMotion'
import GatedContent from '../shared/GatedContent'
import LeadForm, { type LeadFormValues } from '../shared/LeadForm'
import { SCORE_COLORS } from '../shared/ScoreGauge'
import { postLead } from '../shared/submit'
import ToolShell from '../shared/ToolShell'
import { useUnlockSession } from '../shared/useUnlockSession'
import {
  DEFAULT_RECURRENCE,
  PLATFORM_LABELS,
  PRESETS_BUDGET,
  RECURRENCES,
  SECTEURS,
  TICKET_HELP,
  recurrenceOption,
  type Platform,
  type Recurrence,
  type SecteurKey,
} from './benchmarks'
import {
  computeRoi,
  formatCpc,
  formatCurrency,
  formatNumber,
  formatPercent,
  validateRoiInput,
  type RoiInput,
  type RoiResult,
} from './compute'
import {
  ROI_DETAIL,
  ROI_DIAGNOSTIC_CTA,
  ROI_FORM,
  ROI_HERO,
  ROI_RESULTS,
  ROI_UNLOCK,
  type DiagIcon,
  type DiagSegment,
} from './texts'

/**
 * Simulateur de ROI publicitaire (portage de `roi-calculator.js`).
 *
 * Le formulaire vit dans la carte navy du kit outil ; les resultats,
 * trop hauts pour cette carte, sont poses juste en dessous par le slot
 * `below` de ToolShell. Le recalcul est automatique apres la premiere
 * simulation, avec une temporisation de 500 ms.
 */

/** Cle de session memorisant le deblocage du detail. */
const UNLOCK_KEY = 'dglRoiUnlocked'

/** Ancre du bloc CTA de bas de page, cible du bouton du diagnostic. */
const ANCRE_FORMULAIRE = '#formulaire'

/** Duree des compteurs animes (roi-calculator.js:417-436). */
const DUREE_MONTANTS = 1500
const DUREE_CLIENTS = 1200

/** Temporisation du recalcul automatique (CHANGEMENT 6b du JS WordPress). */
const DEBOUNCE_MS = 500

/** Pictogrammes des cartes de diagnostic. */
const ICONES_DIAGNOSTIC: Record<DiagIcon, LucideIcon> = {
  tendance: TrendingUp,
  monnaie: CircleDollarSign,
  barres: BarChart3,
  conversion: RefreshCw,
  bouclier: ShieldCheck,
  ampoule: Lightbulb,
}

/** Couleur du ROI brut : seuils 200 et 50 (showResults du JS WordPress). */
function couleurRoi(roi: number): string {
  if (roi >= 200) return SCORE_COLORS.good
  if (roi >= 50) return SCORE_COLORS.average
  return SCORE_COLORS.poor
}

/** Carte blanche du kit outil. */
function Carte({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-5${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

/** Logo Meta des onglets de plateforme. */
function LogoMeta() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  )
}

/** Logo Google des onglets de plateforme. */
function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.02 10.02 0 001 12c0 1.61.39 3.14 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

/**
 * Compteur anime en easeOutCubic, de zero jusqu'a la valeur.
 *
 * Quand la personne demande de limiter les animations, la valeur finale
 * est posee directement, sans trame.
 */
function Compteur({
  value,
  duree,
  rendu,
  className,
  style,
}: {
  value: number
  duree: number
  rendu: (valeur: number) => string
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  // Avancement de 0 a 1, deja adouci : la valeur affichee en derive, ce
  // qui evite toute ecriture d'etat dans le corps de l'effet.
  const [avancement, setAvancement] = useState(0)
  const trameRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) return
    const debut = performance.now()
    const avancer = (maintenant: number) => {
      const progression = Math.min((maintenant - debut) / duree, 1)
      setAvancement(1 - Math.pow(1 - progression, 3))
      if (progression < 1) {
        trameRef.current = requestAnimationFrame(avancer)
      }
    }
    trameRef.current = requestAnimationFrame(avancer)
    return () => {
      if (trameRef.current !== null) cancelAnimationFrame(trameRef.current)
    }
  }, [duree, reduced])

  return (
    <span className={className} style={style}>
      {rendu(reduced ? value : value * avancement)}
    </span>
  )
}

/** Rend les fragments d'un texte de diagnostic (les gras du HTML WP). */
function TexteDiagnostic({ segments }: { segments: DiagSegment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        typeof segment === 'string' ? (
          <span key={`s-${index}`}>{segment}</span>
        ) : (
          <strong key={`f-${index}`} className="text-ink font-semibold">
            {segment.strong}
          </strong>
        ),
      )}
    </>
  )
}

/** Une metrique du detail verrouille. */
function CarteDetail({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="border-ink/10 rounded-xl border bg-white p-4">
      <p className="text-muted text-xs leading-5">{label}</p>
      <p className="-tracking-sm text-ink mt-1 text-xl font-semibold">{valeur}</p>
    </div>
  )
}

export default function RoiSimulator() {
  const { unlocked, unlock } = useUnlockSession(UNLOCK_KEY)

  const [platform, setPlatform] = useState<Platform>('meta')
  const [secteur, setSecteur] = useState<SecteurKey | ''>('')
  const [budget, setBudget] = useState('')
  const [ticket, setTicket] = useState('')
  const [ticketPlaceholder, setTicketPlaceholder] = useState<string>(ROI_FORM.ticketPlaceholder)
  const [recurrence, setRecurrence] = useState<Recurrence>('unique')
  const [retention, setRetention] = useState('')
  const [erreur, setErreur] = useState('')
  const [calcul, setCalcul] = useState<{ input: RoiInput; resultat: RoiResult } | null>(
    null,
  )
  const [website, setWebsite] = useState('')

  const faitRef = useRef(false)
  const minuteurRef = useRef<number | null>(null)
  const resultatsRef = useRef<HTMLDivElement>(null)

  const reglage = recurrenceOption(recurrence).retention
  const aideTicket = secteur ? TICKET_HELP[secteur] : ''

  /** Calcule et memorise le resultat, ou affiche le message de validation. */
  const calculer = useCallback(
    (
      valeurs: {
        platform: Platform
        secteur: SecteurKey | ''
        budget: string
        ticket: string
        recurrence: Recurrence
        retention: string
      },
      premier: boolean,
    ) => {
      const verdict = validateRoiInput({
        platform: valeurs.platform,
        secteur: valeurs.secteur,
        budget: valeurs.budget === '' ? null : Number(valeurs.budget),
        ticket: valeurs.ticket === '' ? null : Number(valeurs.ticket),
        recurrence: valeurs.recurrence,
        retention: valeurs.retention === '' ? null : Number(valeurs.retention),
      })

      if (!verdict.ok) {
        setErreur(verdict.message)
        if (premier) setCalcul(null)
        return
      }

      if (premier) trackEvent('tool_started', { tool: 'roi' })

      const resultat = computeRoi(verdict.input)
      setErreur('')
      setCalcul({ input: verdict.input, resultat })
      faitRef.current = true

      trackEvent('tool_completed', {
        tool: 'roi',
        platform: verdict.input.platform,
        secteur: verdict.input.secteur,
        roi_brut: resultat.brut.roi,
        roi_optimise: resultat.optimise.roi,
      })
    },
    [],
  )

  /** Programme un recalcul apres 500 ms, une fois la simulation lancee. */
  const programmerRecalcul = useCallback(
    (valeurs: Parameters<typeof calculer>[0]) => {
      if (!faitRef.current) return
      if (minuteurRef.current !== null) window.clearTimeout(minuteurRef.current)
      minuteurRef.current = window.setTimeout(() => {
        calculer(valeurs, false)
      }, DEBOUNCE_MS)
    },
    [calculer],
  )

  useEffect(() => {
    return () => {
      if (minuteurRef.current !== null) window.clearTimeout(minuteurRef.current)
    }
  }, [])

  /** Etat courant du formulaire, avec eventuelles substitutions. */
  function etatAvec(modification: Partial<Parameters<typeof calculer>[0]>) {
    return {
      platform,
      secteur,
      budget,
      ticket,
      recurrence,
      retention,
      ...modification,
    }
  }

  /** Onglet de plateforme : bascule puis recalcul (switchPlatform du JS WP). */
  function changerPlateforme(valeur: Platform) {
    setPlatform(valeur)
    if (faitRef.current) calculer(etatAvec({ platform: valeur }), false)
  }

  /** Pre-selection intelligente appliquee au changement de secteur. */
  function changerSecteur(valeur: SecteurKey | '') {
    setSecteur(valeur)
    if (!valeur) {
      programmerRecalcul(etatAvec({ secteur: valeur }))
      return
    }

    const defauts = DEFAULT_RECURRENCE[valeur]
    const reglageDefaut = recurrenceOption(defauts.type).retention
    const nouvelleRetention =
      defauts.retention > 0
        ? String(defauts.retention)
        : reglageDefaut
          ? String(reglageDefaut.defaut)
          : ''

    setRecurrence(defauts.type)
    setRetention(nouvelleRetention)
    setTicketPlaceholder(defauts.placeholder)

    programmerRecalcul(
      etatAvec({
        secteur: valeur,
        recurrence: defauts.type,
        retention: nouvelleRetention,
      }),
    )
  }

  /** Changement de type de vente : la retention reprend sa valeur par defaut. */
  function changerRecurrence(valeur: Recurrence) {
    const reglageCible = recurrenceOption(valeur).retention
    const nouvelleRetention = reglageCible ? String(reglageCible.defaut) : ''
    setRecurrence(valeur)
    setRetention(nouvelleRetention)
    programmerRecalcul(etatAvec({ recurrence: valeur, retention: nouvelleRetention }))
  }

  function soumettre(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (minuteurRef.current !== null) window.clearTimeout(minuteurRef.current)
    calculer(etatAvec({}), !faitRef.current)
  }

  /** Envoi du formulaire de deblocage avec les donnees de simulation. */
  async function debloquer(valeurs: LeadFormValues) {
    if (!calcul) return { ok: false as const, message: ROI_UNLOCK.text }

    const { input, resultat } = calcul
    const sortie = await postLead('/api/tools/roi/lead', valeurs, {
      platform: input.platform,
      secteur: input.secteur,
      budget: input.budget,
      ticket: input.ticket,
      recurrence: input.recurrence,
      retention: resultat.brut.retention,
      ltv: Math.round(resultat.brut.ticketLTV),
      roiBrut: resultat.brut.roi,
      roiOptimise: resultat.optimise.roi,
      caBrut: Math.round(resultat.brut.ca),
      caOptimise: Math.round(resultat.optimise.ca),
      clients: resultat.brut.clients,
    })

    if (sortie.ok) {
      unlock()
      trackLead('roi_unlock')
    }
    return sortie
  }

  const resultat = calcul?.resultat ?? null
  const brut = resultat?.brut ?? null
  const optimise = resultat?.optimise ?? null

  /* ---------------------------------------------------------------------- */
  /* Formulaire (carte navy)                                                */
  /* ---------------------------------------------------------------------- */

  const classesChamp =
    'border-ink/10 text-ink placeholder:text-muted focus:border-primary w-full rounded-lg border bg-white py-2.5 pr-3 pl-3 text-sm focus:outline-none'
  const classesLabel = 'text-ink/70 text-xs font-medium'

  const formulaire = (
    <Carte>
      <div>
        <h2 className="-tracking-sm text-ink text-lg font-semibold">{ROI_FORM.titre}</h2>
        <p className="text-muted mt-1 text-sm">{ROI_FORM.sousTitre}</p>
      </div>

      <form noValidate onSubmit={soumettre} className="relative mt-5">
        <div className="grid gap-4">
          {/* Plateforme */}
          <div>
            <span className={classesLabel}>{ROI_FORM.plateforme}</span>
            <div
              role="tablist"
              aria-label={ROI_FORM.plateforme}
              className="bg-ink/5 mt-2 inline-flex w-full rounded-xl p-1"
            >
              {(['meta', 'google'] as Platform[]).map((valeur) => {
                const actif = platform === valeur
                return (
                  <button
                    key={valeur}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    data-platform={valeur}
                    onClick={() => changerPlateforme(valeur)}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                      actif ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {valeur === 'meta' ? <LogoMeta /> : <LogoGoogle />}
                    {PLATFORM_LABELS[valeur]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Secteur */}
          <div>
            <label className={classesLabel} htmlFor="roi-secteur">
              {ROI_FORM.secteur}
            </label>
            <span className="relative mt-1.5 block">
              <select
                id="roi-secteur"
                name="secteur"
                value={secteur}
                onChange={(evenement) =>
                  changerSecteur(evenement.target.value as SecteurKey | '')
                }
                className={`${classesChamp} cursor-pointer appearance-none pr-10`}
              >
                <option value="">{ROI_FORM.secteurPlaceholder}</option>
                {SECTEURS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              />
            </span>
          </div>

          {/* Budget */}
          <div>
            <label className={classesLabel} htmlFor="roi-budget">
              {ROI_FORM.budget}
            </label>
            <span className="relative mt-1.5 block">
              <input
                id="roi-budget"
                name="budget"
                type="number"
                inputMode="numeric"
                min={100}
                step={100}
                placeholder={ROI_FORM.budgetPlaceholder}
                value={budget}
                onChange={(evenement) => {
                  setBudget(evenement.target.value)
                  programmerRecalcul(etatAvec({ budget: evenement.target.value }))
                }}
                className={`${classesChamp} pr-24`}
              />
              <span className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                {ROI_FORM.budgetSuffixe}
              </span>
            </span>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-label={ROI_FORM.presetsLabel}
            >
              {PRESETS_BUDGET.map((montant) => (
                <button
                  key={montant}
                  type="button"
                  data-preset={montant}
                  onClick={() => {
                    const valeur = String(montant)
                    setBudget(valeur)
                    programmerRecalcul(etatAvec({ budget: valeur }))
                  }}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs transition ${
                    budget === String(montant)
                      ? 'bg-ink text-white'
                      : 'bg-ink/5 text-muted hover:text-ink'
                  }`}
                >
                  {formatCurrency(montant)}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket moyen */}
          <div>
            <label className={classesLabel} htmlFor="roi-ticket">
              {ROI_FORM.ticket}
            </label>
            <span className="relative mt-1.5 block">
              <input
                id="roi-ticket"
                name="ticket"
                type="number"
                inputMode="numeric"
                min={1}
                step={10}
                placeholder={ticketPlaceholder}
                value={ticket}
                onChange={(evenement) => {
                  setTicket(evenement.target.value)
                  programmerRecalcul(etatAvec({ ticket: evenement.target.value }))
                }}
                className={`${classesChamp} pr-10`}
              />
              <span className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                {ROI_FORM.ticketSuffixe}
              </span>
            </span>
            {aideTicket ? (
              <p className="text-muted mt-1.5 text-xs" data-testid="roi-ticket-help">
                {aideTicket}
              </p>
            ) : null}
          </div>

          {/* Type de vente */}
          <div>
            <label className={classesLabel} htmlFor="roi-recurrence">
              {ROI_FORM.recurrence}
            </label>
            <span className="relative mt-1.5 block">
              <select
                id="roi-recurrence"
                name="recurrence"
                value={recurrence}
                onChange={(evenement) =>
                  changerRecurrence(evenement.target.value as Recurrence)
                }
                className={`${classesChamp} cursor-pointer appearance-none pr-10`}
              >
                {RECURRENCES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              />
            </span>
          </div>

          {/* Retention, affichee selon le type de vente */}
          {reglage ? (
            <div data-testid="roi-retention">
              <label className={classesLabel} htmlFor="roi-retention">
                {reglage.label}
              </label>
              <span className="relative mt-1.5 block">
                <input
                  id="roi-retention"
                  name="retention"
                  type="number"
                  inputMode="numeric"
                  min={reglage.min}
                  max={reglage.max}
                  placeholder={reglage.placeholder}
                  value={retention}
                  onChange={(evenement) => {
                    setRetention(evenement.target.value)
                    programmerRecalcul(etatAvec({ retention: evenement.target.value }))
                  }}
                  className={`${classesChamp} pr-20`}
                />
                <span className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                  {reglage.unit}
                </span>
              </span>
            </div>
          ) : null}
        </div>

        {/* Pot de miel : hors ecran, jamais atteint au clavier. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(evenement) => setWebsite(evenement.target.value)}
          />
        </div>

        {erreur ? (
          <p
            role="alert"
            className="mt-4 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }}
          >
            {erreur}
          </p>
        ) : null}

        <button type="submit" className="shiny-cta shiny-cta--sm mt-4 w-full justify-center">
          <span>
            {calcul ? ROI_FORM.submitRecalcul : ROI_FORM.submit}
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </button>

        <p className="text-muted mt-3 text-center text-xs">{ROI_FORM.sources}</p>
      </form>
    </Carte>
  )

  /* ---------------------------------------------------------------------- */
  /* Resultats (sous la carte navy)                                         */
  /* ---------------------------------------------------------------------- */

  const resultats =
    resultat && brut && optimise ? (
      <div ref={resultatsRef} className="flex flex-col gap-6" data-testid="roi-resultats">
        {/* Double colonne : moyennes du marche et scenario DGL */}
        <div>
          <span className="inline-block rounded-full bg-[#0cce6b]/12 px-4 py-1.5 text-sm font-medium text-[#0a8f4c]">
            {ROI_RESULTS.tag}
          </span>
          <h2 className="-tracking-xl text-ink mt-4 text-3xl leading-[1.12] font-medium text-balance md:text-4xl">
            {ROI_RESULTS.titleBefore}
            <span className="text-primary">{ROI_RESULTS.titleHighlight}</span>
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Sans optimisation */}
            <div
              className="border-ink/10 rounded-2xl border bg-white p-6"
              data-testid="roi-colonne-brut"
            >
              <span className="bg-ink/5 text-muted inline-block rounded-full px-3 py-1 font-mono text-xs uppercase">
                {ROI_RESULTS.brut.tag}
              </span>
              <div className="mt-5">
                <p className="text-muted text-xs">{ROI_RESULTS.brut.roi}</p>
                <Compteur
                  key={`brut-roi-${brut.roi}`}
                  value={brut.roi}
                  duree={DUREE_MONTANTS}
                  rendu={(valeur) => `${Math.round(valeur)}%`}
                  className="-tracking-sm mt-1 block text-4xl font-semibold tabular-nums md:text-5xl"
                  style={{ color: couleurRoi(brut.roi) }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted text-xs">{ROI_RESULTS.brut.ca}</p>
                  <Compteur
                    key={`brut-ca-${brut.ca}`}
                    value={brut.ca}
                    duree={DUREE_MONTANTS}
                    rendu={formatCurrency}
                    className="-tracking-sm text-ink mt-1 block text-xl font-semibold tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-muted text-xs">{ROI_RESULTS.brut.clients}</p>
                  <Compteur
                    key={`brut-cl-${brut.clients}`}
                    value={brut.clients}
                    duree={DUREE_CLIENTS}
                    rendu={formatNumber}
                    className="-tracking-sm text-ink mt-1 block text-xl font-semibold tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Avec DGL Agency */}
            <div
              className="border-primary/30 bg-primary/5 rounded-2xl border p-6"
              data-testid="roi-colonne-optimise"
            >
              <span className="bg-primary inline-block rounded-full px-3 py-1 font-mono text-xs text-white uppercase">
                {ROI_RESULTS.optimise.tag}
              </span>
              <div className="mt-5">
                <p className="text-muted text-xs">{ROI_RESULTS.optimise.roi}</p>
                <Compteur
                  key={`opt-roi-${optimise.roi}`}
                  value={optimise.roi}
                  duree={DUREE_MONTANTS}
                  rendu={(valeur) => `${Math.round(valeur)}%`}
                  className="-tracking-sm text-primary mt-1 block text-4xl font-semibold tabular-nums md:text-5xl"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted text-xs">{ROI_RESULTS.optimise.ca}</p>
                  <Compteur
                    key={`opt-ca-${optimise.ca}`}
                    value={optimise.ca}
                    duree={DUREE_MONTANTS}
                    rendu={formatCurrency}
                    className="-tracking-sm text-primary mt-1 block text-xl font-semibold tabular-nums"
                  />
                </div>
                <div>
                  <p className="text-muted text-xs">{ROI_RESULTS.optimise.clients}</p>
                  <Compteur
                    key={`opt-cl-${optimise.clients}`}
                    value={optimise.clients}
                    duree={DUREE_CLIENTS}
                    rendu={formatNumber}
                    className="-tracking-sm text-primary mt-1 block text-xl font-semibold tabular-nums"
                  />
                </div>
              </div>
              <p className="text-muted mt-5 text-xs">{ROI_RESULTS.optimise.note}</p>
              <a
                href={ANCRE_FORMULAIRE}
                className="text-primary mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
              >
                {ROI_RESULTS.optimise.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <p className="text-muted mt-4 text-xs leading-5">{ROI_RESULTS.disclaimer}</p>
          {resultat.periode ? (
            <p className="text-muted mt-1 text-xs leading-5" data-testid="roi-periode">
              {resultat.periode}
            </p>
          ) : null}
        </div>

        {/* Diagnostic */}
        {resultat.diagnostic ? (
          <div
            className="border-ink/10 rounded-2xl border bg-white p-6"
            data-testid="roi-diagnostic"
          >
            <span
              className="flex size-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'rgba(255, 164, 0, 0.14)', color: '#b36f00' }}
            >
              <TriangleAlert size={22} aria-hidden="true" />
            </span>
            <h3 className="-tracking-sm text-ink mt-4 text-xl font-semibold text-balance">
              {resultat.diagnostic.title}
            </h3>
            <p className="text-muted mt-2 text-sm leading-6">
              {resultat.diagnostic.subtitle}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {resultat.diagnostic.reasons.map((raison) => {
                const Icone = ICONES_DIAGNOSTIC[raison.icon]
                return (
                  <div
                    key={raison.title}
                    className="border-ink/10 rounded-xl border p-4"
                  >
                    <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                      <Icone size={18} aria-hidden="true" />
                    </span>
                    <h4 className="text-ink mt-3 text-sm font-semibold">
                      {raison.title}
                    </h4>
                    <p className="text-muted mt-1.5 text-sm leading-6">
                      <TexteDiagnostic segments={raison.text} />
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="border-ink/10 mt-5 border-t pt-5">
              <p className="text-muted text-sm leading-6">{ROI_DIAGNOSTIC_CTA.text}</p>
              <a
                href={ANCRE_FORMULAIRE}
                className="shiny-cta shiny-cta--sm mt-3 inline-flex justify-center"
              >
                <span>
                  {ROI_DIAGNOSTIC_CTA.bouton}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        ) : null}

        {/* Detail complet, verrouille */}
        <div id="detail">
          <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            {ROI_DETAIL.tag}
          </span>
          <h2 className="-tracking-xl text-ink mt-4 text-3xl leading-[1.12] font-medium text-balance md:text-4xl">
            {ROI_DETAIL.titleBefore}
            <span className="text-primary">{ROI_DETAIL.titleHighlight}</span>
          </h2>
          <p className="text-muted mt-3 max-w-3xl text-base leading-7">
            {ROI_DETAIL.desc}
          </p>

          <div className="mt-6">
            <GatedContent
              unlocked={unlocked}
              overlay={
                <div className="rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,35,41,0.18)]">
                  <span
                    className="text-primary mx-auto flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(254, 87, 82, 0.1)' }}
                  >
                    <Lock size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-ink mt-4 text-center text-lg font-semibold text-balance">
                    {ROI_UNLOCK.title}
                  </h3>
                  <p className="text-muted mt-2 text-center text-sm leading-6">
                    {ROI_UNLOCK.text}
                  </p>
                  <div className="mt-5">
                    <LeadForm
                      fields={['prenom', 'nom', 'telephone', 'email', 'entreprise']}
                      columns={2}
                      submitLabel={ROI_UNLOCK.submit}
                      loadingLabel={ROI_UNLOCK.submitLoading}
                      privacy={ROI_UNLOCK.privacy}
                      successTitle={ROI_UNLOCK.success.title}
                      successText={ROI_UNLOCK.success.text}
                      onSubmit={debloquer}
                    />
                  </div>
                </div>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <CarteDetail
                  label={ROI_DETAIL.cards.clics}
                  valeur={formatNumber(brut.clics)}
                />
                <CarteDetail label={ROI_DETAIL.cards.cpc} valeur={formatCpc(brut.cpc)} />
                <CarteDetail
                  label={ROI_DETAIL.cards.cvr}
                  valeur={formatPercent(brut.cvr)}
                />
                {brut.recurrence === 'unique' ? null : (
                  <CarteDetail
                    label={ROI_DETAIL.cards.ltv}
                    valeur={formatCurrency(brut.ticketLTV)}
                  />
                )}
                <CarteDetail
                  label={ROI_DETAIL.cards.leads}
                  valeur={formatNumber(brut.leads)}
                />
                <CarteDetail
                  label={ROI_DETAIL.cards.cac}
                  valeur={formatCurrency(brut.cac)}
                />
                <CarteDetail
                  label={ROI_DETAIL.cards.profit}
                  valeur={formatCurrency(brut.profit)}
                />
              </div>
            </GatedContent>
          </div>
        </div>
      </div>
    ) : null

  return (
    <ToolShell
      pill={ROI_HERO.pill}
      title={ROI_HERO.title}
      titleHighlight={ROI_HERO.titleHighlight}
      subtitle={ROI_HERO.subtitle}
      subtitleStrong={ROI_HERO.subtitleStrong}
      hint={ROI_HERO.hint}
      below={resultats}
    >
      {formulaire}
    </ToolShell>
  )
}
