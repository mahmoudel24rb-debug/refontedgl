'use client'

import { ArrowRight, ChevronDown, Globe, Lock, Monitor, Smartphone } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { trackEvent, trackLead } from '@/lib/tracking'

import { useReducedMotion } from '../../hooks/useReducedMotion'
import GatedContent from '../shared/GatedContent'
import LeadForm, { type LeadFormValues } from '../shared/LeadForm'
import ScoreGauge, { SCORE_COLORS } from '../shared/ScoreGauge'
import { postLead } from '../shared/submit'
import { useUnlockSession } from '../shared/useUnlockSession'
import type {
  AuditCategory,
  AuditItem,
  PageSpeedReport,
  StrategyReport,
} from './report'
import {
  PAGESPEED_ERRORS,
  PAGESPEED_FORM,
  PAGESPEED_LOADING,
  PAGESPEED_REPORT,
  PAGESPEED_SCORE,
  PAGESPEED_TABS,
  PAGESPEED_UNLOCK,
} from './texts'

/**
 * Interface du test PageSpeed : saisie de l'URL, ecran de chargement a
 * six paliers, onglets mobile et ordinateur, jauge, verdict puis rapport
 * complet verrouille derriere un mini formulaire (portage de js.js).
 */

/** Identifiant du bloc de contenu SEO masque pendant l'analyse. */
export const SEO_CONTENT_ID = 'dgl-ps-seo-content'

/** Cle de session memorisant le deblocage du rapport. */
const UNLOCK_KEY = 'dglPsUnlocked'

type Etat = 'idle' | 'loading' | 'done' | 'error'
type Strategie = 'mobile' | 'desktop'

/** Reponse de la route d'analyse. */
interface ReponseAnalyse {
  ok?: boolean
  error?: string
  runId?: string
  report?: PageSpeedReport
  cacheHit?: boolean
}

/** Couleur de fond et de texte d'une pastille de score. */
const COULEURS: Record<AuditCategory, { fond: string; texte: string }> = {
  good: { fond: 'rgba(12, 206, 107, 0.12)', texte: '#0a8f4c' },
  average: { fond: 'rgba(255, 164, 0, 0.14)', texte: '#b36f00' },
  poor: { fond: 'rgba(255, 78, 66, 0.12)', texte: '#c0392b' },
  info: { fond: 'rgba(0, 35, 41, 0.06)', texte: 'rgba(0, 35, 41, 0.6)' },
}

/** Carte blanche du kit outil. */
function Carte({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl bg-white p-5${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

/** En-tete de bloc du rapport : pastille, titre, description. */
function EnteteBloc({
  tag,
  titleBefore,
  titleHighlight,
  desc,
}: {
  tag: string
  titleBefore: string
  titleHighlight?: string
  desc?: string
}) {
  return (
    <div>
      <span className="bg-ink/5 text-muted inline-block rounded-full px-3 py-1 font-mono text-xs uppercase">
        {tag}
      </span>
      <h2 className="-tracking-xl text-ink mt-3 text-2xl leading-tight font-medium text-balance">
        {titleBefore}
        {titleHighlight ? <span className="text-primary">{titleHighlight}</span> : null}
      </h2>
      {desc ? <p className="text-muted mt-2 text-sm leading-6">{desc}</p> : null}
    </div>
  )
}

/** Liste d'audits pliables. */
function ListeAudits({ items }: { items: AuditItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-muted py-6 text-center text-sm">{PAGESPEED_REPORT.vide}</p>
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-2">
      {items.map((audit) => (
        <details
          key={audit.id}
          className="border-ink/10 group rounded-xl border bg-white px-4 py-3"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COULEURS[audit.category].texte }}
            />
            <span className="text-ink flex-1 text-sm font-medium">{audit.title}</span>
            {audit.savings ? (
              <span className="bg-primary/8 text-primary shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
                {`-${audit.savings}`}
              </span>
            ) : null}
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="text-muted shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="mt-3">
            <p className="text-muted text-sm leading-6">
              {audit.description.map((segment, index) =>
                segment.href ? (
                  <a
                    key={`${audit.id}-d-${index}`}
                    href={segment.href}
                    target="_blank"
                    rel="noopener"
                    className="text-primary underline underline-offset-4"
                  >
                    {segment.text}
                  </a>
                ) : (
                  <span key={`${audit.id}-d-${index}`}>{segment.text}</span>
                ),
              )}
            </p>

            {audit.table ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead>
                    <tr className="text-muted">
                      {audit.table.headings.map((heading, index) => (
                        <th
                          key={`${audit.id}-h-${index}`}
                          className="border-ink/10 border-b px-2 py-2 font-medium"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {audit.table.rows.map((row, ligne) => (
                      <tr key={`${audit.id}-r-${ligne}`} className="text-ink/80">
                        {row.map((cellule, colonne) => (
                          <td
                            key={`${audit.id}-r-${ligne}-${colonne}`}
                            className="border-ink/5 border-b px-2 py-2 break-words"
                          >
                            {cellule}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {audit.table.reste > 0 ? (
                      <tr>
                        <td
                          colSpan={audit.table.headings.length}
                          className="text-muted px-2 py-2 text-center italic"
                        >
                          {PAGESPEED_REPORT.autresElements.replace(
                            '{n}',
                            String(audit.table.reste),
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  )
}

/** Rapport complet d'une strategie (contenu verrouille). */
function RapportDetaille({ rapport }: { rapport: StrategyReport }) {
  return (
    <div className="flex flex-col gap-3">
      <Carte>
        <EnteteBloc
          tag={PAGESPEED_REPORT.metrics.tag}
          titleBefore={PAGESPEED_REPORT.metrics.titleBefore}
          titleHighlight={PAGESPEED_REPORT.metrics.titleHighlight}
          desc={PAGESPEED_REPORT.metrics.desc}
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rapport.labMetrics.map((metrique) => (
            <div
              key={metrique.id}
              className="border-ink/10 rounded-xl border p-4 text-center"
            >
              <span
                className="mx-auto flex size-12 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: COULEURS[metrique.category].fond,
                  color: COULEURS[metrique.category].texte,
                }}
              >
                {metrique.scorePercent ?? '-'}
              </span>
              <p className="text-ink mt-3 text-sm font-medium">{metrique.name}</p>
              <p
                className="mt-1 text-lg font-semibold"
                style={{ color: COULEURS[metrique.category].texte }}
              >
                {metrique.displayValue}
              </p>
              <p className="text-muted mt-1 font-mono text-xs uppercase">
                {metrique.abbr}
              </p>
            </div>
          ))}
        </div>
      </Carte>

      {rapport.overallCategory && rapport.fieldMetrics.length > 0 ? (
        <Carte>
          <EnteteBloc
            tag={PAGESPEED_REPORT.field.tag}
            titleBefore={PAGESPEED_REPORT.field.titleBefore}
            titleHighlight={PAGESPEED_REPORT.field.titleHighlight}
            desc={PAGESPEED_REPORT.field.desc}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rapport.fieldMetrics.map((metrique) => (
              <div key={metrique.id} className="border-ink/10 rounded-xl border p-4">
                <p className="text-ink text-sm font-medium">{metrique.name}</p>
                <p
                  className="mt-1 text-xl font-semibold"
                  style={{ color: COULEURS[metrique.category].texte }}
                >
                  {metrique.valeur}
                </p>
                <p className="text-muted mt-1 font-mono text-xs uppercase">
                  {`${metrique.abbr} ${PAGESPEED_REPORT.field.percentile}`}
                </p>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full">
                  <span
                    style={{
                      width: `${metrique.distributions[0]}%`,
                      backgroundColor: SCORE_COLORS.good,
                    }}
                  />
                  <span
                    style={{
                      width: `${metrique.distributions[1]}%`,
                      backgroundColor: SCORE_COLORS.average,
                    }}
                  />
                  <span
                    style={{
                      width: `${metrique.distributions[2]}%`,
                      backgroundColor: SCORE_COLORS.poor,
                    }}
                  />
                </div>
                <div className="text-muted mt-2 flex justify-between text-xs">
                  <span>{`${PAGESPEED_REPORT.field.bon} ${metrique.distributions[0]} %`}</span>
                  <span>{`${PAGESPEED_REPORT.field.moyen} ${metrique.distributions[1]} %`}</span>
                  <span>{`${PAGESPEED_REPORT.field.lent} ${metrique.distributions[2]} %`}</span>
                </div>
              </div>
            ))}
          </div>
        </Carte>
      ) : null}

      <Carte>
        <EnteteBloc
          tag={PAGESPEED_REPORT.opportunities.tag}
          titleBefore={PAGESPEED_REPORT.opportunities.titleBefore}
          titleHighlight={PAGESPEED_REPORT.opportunities.titleHighlight}
          desc={PAGESPEED_REPORT.opportunities.desc}
        />
        <ListeAudits items={rapport.opportunities} />
      </Carte>

      <Carte>
        <EnteteBloc
          tag={PAGESPEED_REPORT.diagnostics.tag}
          titleBefore={PAGESPEED_REPORT.diagnostics.titleBefore}
          titleHighlight={PAGESPEED_REPORT.diagnostics.titleHighlight}
          desc={PAGESPEED_REPORT.diagnostics.desc}
        />
        <ListeAudits items={rapport.diagnostics} />
      </Carte>

      <Carte>
        <details className="group">
          <summary className="text-ink flex cursor-pointer list-none items-center gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="text-muted transition-transform group-open:rotate-180"
            />
            {`${PAGESPEED_REPORT.passed.label} (${rapport.passed.length})`}
          </summary>
          <ListeAudits items={rapport.passed} />
        </details>
      </Carte>
    </div>
  )
}

export default function PageSpeedTool() {
  const reduced = useReducedMotion()
  const { unlocked, unlock } = useUnlockSession(UNLOCK_KEY)

  const [url, setUrl] = useState('')
  const [website, setWebsite] = useState('')
  const [etat, setEtat] = useState<Etat>('idle')
  const [erreur, setErreur] = useState('')
  const [rapport, setRapport] = useState<PageSpeedReport | null>(null)
  const [runId, setRunId] = useState<string | undefined>(undefined)
  const [strategie, setStrategie] = useState<Strategie>('mobile')
  const [palier, setPalier] = useState(0)

  const tsRef = useRef(0)
  const resultatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    tsRef.current = Date.now()
  }, [])

  // Le contenu SEO laisse la place au rapport, comme sur WordPress.
  useEffect(() => {
    const bloc = document.getElementById(SEO_CONTENT_ID)
    if (!bloc) return
    bloc.hidden = etat === 'loading' || etat === 'done'
    return () => {
      bloc.hidden = false
    }
  }, [etat])

  // Paliers de la barre de progression : un toutes les trois secondes.
  useEffect(() => {
    if (etat !== 'loading') return
    const minuteur = window.setInterval(() => {
      setPalier((precedent) =>
        Math.min(precedent + 1, PAGESPEED_LOADING.steps.length - 1),
      )
    }, 3000)
    return () => window.clearInterval(minuteur)
  }, [etat])

  const defiler = useCallback(
    (cible: HTMLElement | null) => {
      if (!cible) return
      cible.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [reduced],
  )

  async function analyser(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (etat === 'loading') return

    const saisie = url.trim()
    if (!saisie) {
      setErreur(PAGESPEED_ERRORS.urlManquante)
      setEtat('error')
      return
    }

    const complete = /^https?:\/\//i.test(saisie) ? saisie : `https://${saisie}`
    setUrl(complete)

    try {
      new URL(complete)
    } catch {
      setErreur(PAGESPEED_ERRORS.urlInvalide)
      setEtat('error')
      return
    }

    setErreur('')
    setPalier(0)
    setEtat('loading')
    trackEvent('tool_started', { tool: 'pagespeed' })

    try {
      const reponse = await fetch('/api/tools/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: complete, ts: tsRef.current, website }),
      })

      let donnees: ReponseAnalyse = {}
      try {
        donnees = (await reponse.json()) as ReponseAnalyse
      } catch {
        donnees = {}
      }

      if (!reponse.ok || !donnees.report) {
        setErreur(donnees.error ?? PAGESPEED_ERRORS.generique)
        setEtat('error')
        trackEvent('tool_error', { tool: 'pagespeed' })
        return
      }

      setRapport(donnees.report)
      setRunId(donnees.runId)
      setEtat('done')
      trackEvent('tool_completed', {
        tool: 'pagespeed',
        score_mobile: donnees.report.mobile.score,
        score_desktop: donnees.report.desktop.score,
        cache_hit: donnees.cacheHit ?? false,
      })
      window.setTimeout(() => defiler(resultatsRef.current), 50)
    } catch {
      setErreur(PAGESPEED_ERRORS.generique)
      setEtat('error')
      trackEvent('tool_error', { tool: 'pagespeed' })
    }
  }

  async function debloquer(valeurs: LeadFormValues) {
    const resultat = await postLead('/api/tools/pagespeed/unlock', valeurs, { runId })
    if (resultat.ok) {
      unlock()
      trackLead('pagespeed_unlock')
      window.setTimeout(() => defiler(document.getElementById('metrics')), 80)
    }
    return resultat
  }

  const courant = rapport ? rapport[strategie] : null
  const progression =
    etat === 'loading'
      ? (PAGESPEED_LOADING.steps[palier]?.pct ?? 15)
      : etat === 'done'
        ? 100
        : 0

  return (
    <>
      <Carte>
        {/* noValidate : un domaine nu est accepte, le prefixe https est
            ajoute avant l'envoi. */}
        <form noValidate onSubmit={analyser} className="relative">
          <label
            htmlFor="pagespeed-url"
            className="text-ink/70 text-xs font-medium"
          >
            {PAGESPEED_FORM.label}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="relative flex-1">
              <Globe
                size={18}
                aria-hidden="true"
                className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                id="pagespeed-url"
                name="url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder={PAGESPEED_FORM.placeholder}
                value={url}
                onChange={(evenement) => setUrl(evenement.target.value)}
                className="border-ink/10 text-ink placeholder:text-muted focus:border-primary w-full rounded-lg border py-3 pr-3 pl-10 text-sm focus:outline-none"
              />
            </span>
            <button
              type="submit"
              disabled={etat === 'loading'}
              className={`shiny-cta shiny-cta--sm justify-center${
                etat === 'loading' ? ' opacity-70' : ''
              }`}
            >
              <span>
                {etat === 'loading'
                  ? PAGESPEED_FORM.submitLoading
                  : PAGESPEED_FORM.submit}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Pot de miel : hors ecran, jamais atteint au clavier. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(evenement) => setWebsite(evenement.target.value)}
            />
          </div>

          {etat === 'error' && erreur ? (
            <p
              role="alert"
              className="mt-3 rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }}
            >
              {erreur}
            </p>
          ) : null}
        </form>
      </Carte>

      {etat === 'loading' ? (
        <Carte>
          <p className="text-ink text-center text-base font-medium">
            {PAGESPEED_LOADING.titre}
          </p>
          <p className="text-muted mt-1 text-center text-sm">
            {PAGESPEED_LOADING.steps[palier]?.text}
          </p>
          <div className="bg-ink/8 mt-4 h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${progression}%`,
                transition: reduced ? undefined : 'width 600ms ease-out',
              }}
            />
          </div>
        </Carte>
      ) : null}

      {courant && rapport ? (
        <div ref={resultatsRef} className="flex flex-col gap-3">
          <Carte>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label={PAGESPEED_SCORE.title}
                className="bg-ink/5 inline-flex rounded-xl p-1"
              >
                {(['mobile', 'desktop'] as Strategie[]).map((valeur) => {
                  const actif = strategie === valeur
                  const Icone = valeur === 'mobile' ? Smartphone : Monitor
                  return (
                    <button
                      key={valeur}
                      type="button"
                      role="tab"
                      aria-selected={actif}
                      onClick={() => setStrategie(valeur)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
                        actif ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                      }`}
                    >
                      <Icone size={16} aria-hidden="true" />
                      {valeur === 'mobile'
                        ? PAGESPEED_TABS.mobile
                        : PAGESPEED_TABS.desktop}
                    </button>
                  )
                })}
              </div>
              <p className="text-muted truncate font-mono text-xs uppercase">
                {`${PAGESPEED_TABS.analysedPrefix}${rapport.url}`}
              </p>
            </div>
          </Carte>

          <Carte>
            <EnteteBloc
              tag={PAGESPEED_SCORE.tag}
              titleBefore={PAGESPEED_SCORE.title}
            />
            <div className="mt-6">
              <ScoreGauge key={strategie} value={courant.score} />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {PAGESPEED_SCORE.legend.map((item) => (
                <span
                  key={item.label}
                  className="text-muted flex items-center gap-2 text-xs"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
            <p className="text-muted mx-auto mt-5 max-w-xl text-center text-sm leading-6">
              <strong className="text-ink">
                {`${PAGESPEED_SCORE.verdict.mobile} ${rapport.mobile.score}${PAGESPEED_SCORE.verdict.sur} · ${PAGESPEED_SCORE.verdict.desktop} ${rapport.desktop.score}${PAGESPEED_SCORE.verdict.sur}`}
              </strong>
              {' : '}
              {(() => {
                const pire = Math.min(rapport.mobile.score, rapport.desktop.score)
                if (pire >= 90) return PAGESPEED_SCORE.verdict.bon
                if (pire >= 50) return PAGESPEED_SCORE.verdict.moyen
                return PAGESPEED_SCORE.verdict.mauvais
              })()}
            </p>
          </Carte>

          <div id="metrics">
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
                    {PAGESPEED_UNLOCK.title}
                  </h3>
                  <p className="text-muted mt-2 text-center text-sm leading-6">
                    {PAGESPEED_UNLOCK.text}
                  </p>
                  <div className="mt-5">
                    <LeadForm
                      fields={['entreprise', 'email', 'telephone']}
                      submitLabel={PAGESPEED_UNLOCK.submit}
                      loadingLabel={PAGESPEED_UNLOCK.submitLoading}
                      privacy={PAGESPEED_UNLOCK.privacy}
                      onSubmit={debloquer}
                    />
                  </div>
                </div>
              }
            >
              <RapportDetaille rapport={courant} />
            </GatedContent>
          </div>
        </div>
      ) : null}
    </>
  )
}
