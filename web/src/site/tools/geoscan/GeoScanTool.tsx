'use client'

import { Check, Loader2, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { trackEvent, trackLead } from '@/lib/tracking'

import { useReducedMotion } from '../../hooks/useReducedMotion'
import GatedContent from '../shared/GatedContent'
import LeadForm, { type LeadFormOutcome, type LeadFormValues } from '../shared/LeadForm'
import ScoreGauge from '../shared/ScoreGauge'
import { readUtm } from '../shared/submit'
import { LEAD_MESSAGES } from '../shared/texts'
import GeoScanStartForm from './GeoScanStartForm'
import {
  GEOSCAN_ERRORS,
  GEOSCAN_FORM,
  GEOSCAN_HERO,
  GEOSCAN_PROGRESS,
  GEOSCAN_REPORT,
  GEOSCAN_SCORE,
  GEOSCAN_UNLOCK,
  engineLabel,
} from './texts'

/**
 * Interface du test de visibilite IA : reprise d'un test en cours par
 * le parametre run, progression reelle renvoyee par le serveur, score
 * gratuit puis rapport complet derriere le formulaire de deblocage.
 * Portage de landing.js.
 */

/** Adresse de la page de l'outil. */
const PAGE_OUTIL = '/outils/test-visibilite-ia'

/** Intervalle de scrutation de l'etat du scan. */
const POLL_MS = 3000

/** Delai au dela duquel le navigateur cesse d'attendre. */
const TIMEOUT_MS = 6 * 60 * 1000

/** Seuils de la jauge du score de visibilite IA. */
const SEUILS = { good: 70, average: 40 }

type Etat = 'idle' | 'running' | 'done' | 'error'

/** Progression renvoyee par la route status. */
interface Progression {
  label: string
  step: number
  total: number
}

/** Resultat gratuit renvoye par la route status. */
interface ResultatLibre {
  score: number
  cited: number
  total: number
  devant: number
}

/** Detail par moteur du rapport complet. */
interface MoteurStats {
  total: number
  cited: number
}

/** Concurrent du podium. */
interface PodiumEntry {
  nom: string
  count: number
  total: number
  moteurs: string[]
}

/** Rapport complet renvoye par la route unlock. */
interface Rapport {
  score: number
  cited: number
  total: number
  sourcesOk: boolean
  podium: PodiumEntry[]
  moteurs: Record<string, MoteurStats>
  recos: string[]
}

/** Reponse de la route status. */
interface ReponseStatus {
  ok?: boolean
  error?: string
  status?: 'running' | 'done' | 'error'
  message?: string
  progress?: Progression
  score?: number
  cited?: number
  total?: number
  devant?: number
}

/** Reponse de la route unlock. */
interface ReponseUnlock extends Partial<Rapport> {
  ok?: boolean
  error?: string
  status?: string
}

/** Carte blanche du kit outil. */
function Carte({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white p-5">{children}</div>
}

/** Titre de bloc du rapport. */
function TitreBloc({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="-tracking-xl text-ink mt-8 text-xl leading-tight font-medium first:mt-0">
      {children}
    </h3>
  )
}

/** Barre grise du squelette de rapport. */
function BarreSquelette({ largeur }: { largeur: string }) {
  return (
    <span
      aria-hidden="true"
      className="bg-ink/8 mt-2 block h-3 rounded-full"
      style={{ width: largeur }}
    />
  )
}

/** Rapport factice affiche tant que le visiteur n'a pas debloque. */
function RapportSquelette() {
  return (
    <Carte>
      <TitreBloc>{GEOSCAN_REPORT.podiumTitle}</TitreBloc>
      <div className="mt-4 flex flex-col gap-3">
        {[1, 2, 3].map((rang) => (
          <div key={rang} className="border-ink/10 flex items-center gap-4 rounded-xl border p-4">
            <span className="bg-ink/5 text-ink flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {rang}
            </span>
            <span className="flex-1">
              <BarreSquelette largeur="60%" />
              <BarreSquelette largeur="80%" />
            </span>
          </div>
        ))}
      </div>

      <TitreBloc>{GEOSCAN_REPORT.enginesTitle}</TitreBloc>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {['gemini', 'perplexity'].map((cle) => (
          <div key={cle} className="border-ink/10 rounded-xl border p-4">
            <p className="text-ink text-sm font-medium">{engineLabel(cle)}</p>
            <BarreSquelette largeur="70%" />
          </div>
        ))}
      </div>

      <TitreBloc>{GEOSCAN_REPORT.planTitle}</TitreBloc>
      <div className="mt-4">
        <BarreSquelette largeur="100%" />
        <BarreSquelette largeur="80%" />
        <BarreSquelette largeur="60%" />
      </div>
    </Carte>
  )
}

/** Rapport complet, affiche apres le deblocage. */
function RapportComplet({
  rapport,
  onRelancer,
}: {
  rapport: Rapport
  onRelancer: () => void
}) {
  return (
    <Carte>
      <p
        className="rounded-xl px-4 py-3 text-sm leading-6"
        style={{ backgroundColor: 'rgba(12, 206, 107, 0.12)', color: '#0a8f4c' }}
      >
        {GEOSCAN_REPORT.success}
      </p>

      <TitreBloc>{GEOSCAN_REPORT.podiumTitle}</TitreBloc>
      {rapport.podium.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {rapport.podium.map((concurrent, index) => (
            <div
              key={`${concurrent.nom}-${index}`}
              className="border-ink/10 flex items-center gap-4 rounded-xl border p-4"
            >
              <span className="bg-ink flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-ink text-base font-medium">{concurrent.nom}</p>
                <p className="text-muted mt-1 text-sm">
                  {`${GEOSCAN_REPORT.podiumMetaBefore}${concurrent.count}${GEOSCAN_REPORT.podiumMetaMiddle}${concurrent.total}${GEOSCAN_REPORT.podiumMetaAfter} · ${concurrent.moteurs
                    .map(engineLabel)
                    .join(', ')}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mt-4 text-sm leading-6">{GEOSCAN_REPORT.podiumVide}</p>
      )}

      <TitreBloc>{GEOSCAN_REPORT.enginesTitle}</TitreBloc>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {Object.entries(rapport.moteurs).map(([cle, stats]) => (
          <div key={cle} className="border-ink/10 rounded-xl border p-4">
            <p className="text-ink text-sm font-medium">{engineLabel(cle)}</p>
            <p className="-tracking-xl text-primary mt-2 text-2xl font-semibold">
              {`${stats.cited} / ${stats.total}`}
            </p>
            <p className="text-muted mt-1 text-xs">{GEOSCAN_REPORT.engineCaption}</p>
          </div>
        ))}
      </div>

      <p
        className="mt-6 rounded-xl px-4 py-3 text-sm leading-6"
        style={
          rapport.sourcesOk
            ? { backgroundColor: 'rgba(12, 206, 107, 0.12)', color: '#0a8f4c' }
            : { backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }
        }
      >
        {rapport.sourcesOk ? GEOSCAN_REPORT.sourcesOk : GEOSCAN_REPORT.sourcesKo}
      </p>

      <TitreBloc>{GEOSCAN_REPORT.planTitle}</TitreBloc>
      <ul className="mt-4 flex flex-col gap-3">
        {rapport.recos.map((reco) => (
          <li key={reco.slice(0, 40)} className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
              <Check size={14} aria-hidden="true" />
            </span>
            <span className="text-muted text-sm leading-6">{reco}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center">
        <button type="button" onClick={onRelancer} className="shiny-cta shiny-cta--sm">
          <span>{GEOSCAN_REPORT.cta}</span>
        </button>
      </div>
    </Carte>
  )
}

/** Mentions de confiance de la landing. */
function Confiance() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-2 py-1">
      {GEOSCAN_HERO.trust.map((mention) => (
        <span key={mention} className="flex items-center gap-2 text-xs text-white/70">
          <Check size={14} aria-hidden="true" className="shrink-0 text-white/50" />
          {mention}
        </span>
      ))}
    </div>
  )
}

/**
 * Une session de test : un identifiant, un etat.
 *
 * Le composant est remonte (cle React) des que l'identifiant change,
 * ce qui remet naturellement l'etat a zero sans effet de synchronisation.
 */
function GeoScanSession({
  runId,
  onStarted,
  onRelancer,
}: {
  runId: string | null
  onStarted: (runId: string) => void
  onRelancer: () => void
}) {
  const reduced = useReducedMotion()

  const [etat, setEtat] = useState<Etat>(runId ? 'running' : 'idle')
  const [progression, setProgression] = useState<Progression>({
    label: GEOSCAN_PROGRESS.defaultLabel,
    step: 0,
    total: 3,
  })
  const [resultat, setResultat] = useState<ResultatLibre | null>(null)
  const [rapport, setRapport] = useState<Rapport | null>(null)
  const [erreur, setErreur] = useState('')
  const resultatsRef = useRef<HTMLDivElement>(null)

  const defiler = useCallback(
    (cible: HTMLElement | null) => {
      if (!cible) return
      cible.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    },
    [reduced],
  )

  // Scrutation de l'etat du scan toutes les trois secondes.
  useEffect(() => {
    if (!runId || etat !== 'running') return

    const debut = Date.now()
    let actif = true

    const interroger = async (): Promise<void> => {
      try {
        const reponse = await fetch(
          `/api/tools/geoscan/status?id=${encodeURIComponent(runId)}`,
          { cache: 'no-store' },
        )
        const donnees = (await reponse.json()) as ReponseStatus
        if (!actif) return

        if (!reponse.ok) {
          setErreur(donnees.error ?? GEOSCAN_ERRORS.scan)
          setEtat('error')
          return
        }

        if (donnees.status === 'error') {
          setErreur(donnees.message ?? GEOSCAN_ERRORS.scan)
          setEtat('error')
          trackEvent('tool_error', { tool: 'geoscan' })
          return
        }

        if (donnees.status === 'done') {
          setResultat({
            score: donnees.score ?? 0,
            cited: donnees.cited ?? 0,
            total: donnees.total ?? 0,
            devant: donnees.devant ?? 0,
          })
          setEtat('done')
          trackEvent('tool_completed', { tool: 'geoscan', score: donnees.score ?? 0 })
          window.setTimeout(() => defiler(resultatsRef.current), 80)
          return
        }

        if (donnees.progress) setProgression(donnees.progress)
        if (Date.now() - debut > TIMEOUT_MS) {
          setErreur(GEOSCAN_ERRORS.tropLong)
          setEtat('error')
        }
      } catch {
        // Erreur reseau ponctuelle : le prochain tour reessaie.
      }
    }

    void interroger()
    const minuteur = window.setInterval(() => void interroger(), POLL_MS)
    return () => {
      actif = false
      window.clearInterval(minuteur)
    }
  }, [runId, etat, defiler])

  /** Envoi du formulaire de deblocage. */
  async function debloquer(valeurs: LeadFormValues): Promise<LeadFormOutcome> {
    if (!runId) return { ok: false, message: GEOSCAN_ERRORS.scan }

    const reponse = await fetch('/api/tools/geoscan/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId,
        prenom: valeurs.prenom,
        telephone: valeurs.telephone,
        email: valeurs.email,
        consent: valeurs.consent,
        website: valeurs.website,
        ts: valeurs.ts,
        pageUrl: window.location.href,
        utm: readUtm(),
      }),
    })

    let donnees: ReponseUnlock = {}
    try {
      donnees = (await reponse.json()) as ReponseUnlock
    } catch {
      donnees = {}
    }

    if (!reponse.ok || !donnees.podium || !donnees.moteurs || !donnees.recos) {
      return { ok: false, message: donnees.error ?? LEAD_MESSAGES.erreurReseau }
    }

    setRapport({
      score: donnees.score ?? 0,
      cited: donnees.cited ?? 0,
      total: donnees.total ?? 0,
      sourcesOk: donnees.sourcesOk ?? false,
      podium: donnees.podium,
      moteurs: donnees.moteurs,
      recos: donnees.recos,
    })
    trackLead('geoscan_unlock')
    return { ok: true }
  }

  const pourcentage =
    progression.total > 0
      ? Math.max(5, Math.round((progression.step / progression.total) * 90))
      : 5

  return (
    <>
      {etat === 'idle' || etat === 'error' ? (
        <GeoScanStartForm variant="tool" onStarted={onStarted} />
      ) : null}

      {etat === 'error' && erreur ? (
        <Carte>
          <p
            role="alert"
            className="rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }}
          >
            {erreur}
          </p>
        </Carte>
      ) : null}

      {etat === 'running' ? (
        <Carte>
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={28}
              aria-hidden="true"
              className={`text-primary${reduced ? '' : ' animate-spin'}`}
            />
            <h2 className="-tracking-xl text-ink mt-4 text-2xl leading-tight font-medium">
              {GEOSCAN_PROGRESS.title}
            </h2>
            <p className="text-muted mt-2 text-sm" aria-live="polite">
              {progression.label}
            </p>
            <div className="bg-ink/8 mt-4 h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${pourcentage}%`,
                  transition: reduced ? undefined : 'width 600ms ease-out',
                }}
              />
            </div>
            <p className="text-muted mt-4 text-xs leading-5">{GEOSCAN_PROGRESS.hint}</p>
          </div>
        </Carte>
      ) : null}

      {etat === 'done' && resultat ? (
        <div ref={resultatsRef} className="flex flex-col gap-3">
          <Carte>
            <div className="text-center">
              <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 font-mono text-xs uppercase">
                {GEOSCAN_SCORE.tag}
              </span>
              <h2 className="-tracking-xl text-ink mt-3 text-2xl leading-tight font-medium text-balance">
                {GEOSCAN_SCORE.titleBefore}
                <span className="text-primary">{GEOSCAN_SCORE.titleHighlight}</span>
              </h2>
            </div>

            <div className="mt-6">
              <ScoreGauge value={resultat.score} thresholds={SEUILS} />
            </div>

            <p className="text-muted mx-auto mt-6 max-w-xl text-center text-sm leading-6">
              {GEOSCAN_SCORE.citedBefore}
              <strong className="text-ink">
                {`${resultat.cited}${GEOSCAN_SCORE.citedMiddle}${resultat.total}${GEOSCAN_SCORE.citedAfter}`}
              </strong>
              {GEOSCAN_SCORE.citedEnd}
            </p>

            {resultat.devant > 0 ? (
              <p
                className="mx-auto mt-4 max-w-xl rounded-xl px-4 py-3 text-center text-sm leading-6"
                style={{ backgroundColor: 'rgba(255, 78, 66, 0.08)', color: '#c0392b' }}
              >
                <strong>
                  {`${resultat.devant}${
                    resultat.devant > 1
                      ? GEOSCAN_SCORE.teaserPluriel
                      : GEOSCAN_SCORE.teaserSingulier
                  }`.trimEnd()}
                </strong>{' '}
                {resultat.devant > 1
                  ? GEOSCAN_SCORE.teaserVerbePluriel
                  : GEOSCAN_SCORE.teaserVerbeSingulier}
                {GEOSCAN_SCORE.teaserSuite}
              </p>
            ) : resultat.cited === 0 ? (
              <p
                className="mx-auto mt-4 max-w-xl rounded-xl px-4 py-3 text-center text-sm leading-6"
                style={{ backgroundColor: 'rgba(255, 78, 66, 0.08)', color: '#c0392b' }}
              >
                {GEOSCAN_SCORE.teaserAucuneCitationAvant}
                <strong>{GEOSCAN_SCORE.teaserAucuneCitationFort}</strong>
                {GEOSCAN_SCORE.teaserAucuneCitationApres}
              </p>
            ) : null}
          </Carte>

          <GatedContent
            unlocked={rapport !== null}
            overlay={
              <div className="rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,35,41,0.18)]">
                <span
                  className="text-primary mx-auto flex size-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(254, 87, 82, 0.1)' }}
                >
                  <Lock size={20} aria-hidden="true" />
                </span>
                <h3 className="text-ink mt-4 text-center text-lg font-semibold text-balance">
                  {GEOSCAN_UNLOCK.title}
                </h3>
                <p className="text-muted mt-2 text-center text-sm leading-6">
                  {GEOSCAN_UNLOCK.text}
                </p>
                <div className="mt-5">
                  <LeadForm
                    fields={['prenom', 'telephone', 'email', 'consent']}
                    submitLabel={GEOSCAN_UNLOCK.submit}
                    loadingLabel={GEOSCAN_UNLOCK.submitLoading}
                    consentLabel={GEOSCAN_UNLOCK.consent}
                    privacy={GEOSCAN_UNLOCK.privacy}
                    onSubmit={debloquer}
                  />
                </div>
              </div>
            }
          >
            {rapport ? (
              <RapportComplet rapport={rapport} onRelancer={onRelancer} />
            ) : (
              <RapportSquelette />
            )}
          </GatedContent>
        </div>
      ) : null}

      <Confiance />
    </>
  )
}

/**
 * Lecture du parametre run et pilotage de la session.
 *
 * L'identifiant vient de l'URL, ou de l'etat local juste apres un
 * lancement (la mise a jour de l'URL est asynchrone).
 */
function GeoScanToolInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reduced = useReducedMotion()
  const [runLocal, setRunLocal] = useState<string | null>(null)

  const runId = searchParams.get('run') ?? runLocal

  /** Lancement depuis la page de l'outil : l'URL garde l'identifiant. */
  function demarrer(nouveauRun: string): void {
    setRunLocal(nouveauRun)
    router.replace(`${PAGE_OUTIL}?run=${encodeURIComponent(nouveauRun)}`, { scroll: false })
  }

  /** Retour au formulaire vierge. */
  function relancer(): void {
    setRunLocal(null)
    router.replace(PAGE_OUTIL, { scroll: false })
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <GeoScanSession
      key={runId ?? 'nouveau'}
      runId={runId}
      onStarted={demarrer}
      onRelancer={relancer}
    />
  )
}

/** Repli rendu pendant la lecture des parametres d'URL. */
function GeoScanToolFallback() {
  return (
    <>
      <div className="rounded-2xl bg-white p-5">
        <p className="text-muted text-sm">{GEOSCAN_FORM.submitLoading}</p>
      </div>
      <Confiance />
    </>
  )
}

export default function GeoScanTool() {
  return (
    <Suspense fallback={<GeoScanToolFallback />}>
      <GeoScanToolInner />
    </Suspense>
  )
}
