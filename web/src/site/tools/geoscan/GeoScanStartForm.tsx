'use client'

import { ArrowUp, Globe, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { trackEvent } from '@/lib/tracking'

import { CARD_SHEEN } from '../shared/ToolShell'
import { GEOSCAN_ERRORS, GEOSCAN_FORM, GEOSCAN_HERO } from './texts'

/**
 * Formulaire de lancement du test de visibilite IA (trois champs).
 *
 * Deux presentations : hero de la page Outils (carte navy complete) et
 * outil (carte blanche posee dans la coquille ToolShell). Le lancement
 * cree le scan puis renvoie vers la page de l'outil avec ?run=.
 */

/** Adresse de la page de l'outil. */
const PAGE_OUTIL = '/outils/test-visibilite-ia'

/** Reponse de la route de lancement. */
interface ReponseStart {
  ok?: boolean
  error?: string
  runId?: string
}

export interface GeoScanStartFormProps {
  /** hero : carte navy autonome. tool : carte blanche dans ToolShell. */
  variant?: 'hero' | 'tool'
  /** Appele avec l'identifiant du test au lieu de naviguer. */
  onStarted?: (runId: string) => void
}

export default function GeoScanStartForm({
  variant = 'tool',
  onStarted,
}: GeoScanStartFormProps) {
  const router = useRouter()
  const uid = useId()

  const [entreprise, setEntreprise] = useState('')
  const [metier, setMetier] = useState('')
  const [ville, setVille] = useState('')
  const [website, setWebsite] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const tsRef = useRef(0)

  // Le piege temporel compare cet horodatage a l'heure d'envoi.
  useEffect(() => {
    tsRef.current = Date.now()
  }, [])

  async function lancer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (chargement) return

    const valeurs = {
      entreprise: entreprise.trim(),
      metier: metier.trim(),
      ville: ville.trim(),
    }
    if (
      valeurs.entreprise.length < 2 ||
      valeurs.metier.length < 2 ||
      valeurs.ville.length < 2
    ) {
      setErreur(GEOSCAN_ERRORS.champsManquants)
      return
    }

    setErreur('')
    setChargement(true)
    trackEvent('tool_started', { tool: 'geoscan' })

    try {
      const reponse = await fetch('/api/tools/geoscan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...valeurs, website, ts: tsRef.current }),
      })

      let donnees: ReponseStart = {}
      try {
        donnees = (await reponse.json()) as ReponseStart
      } catch {
        donnees = {}
      }

      if (!reponse.ok || !donnees.runId) {
        setErreur(donnees.error ?? GEOSCAN_ERRORS.lancement)
        setChargement(false)
        trackEvent('tool_error', { tool: 'geoscan' })
        return
      }

      if (onStarted) {
        onStarted(donnees.runId)
        setChargement(false)
        return
      }
      router.push(`${PAGE_OUTIL}?run=${encodeURIComponent(donnees.runId)}`)
    } catch {
      setErreur(GEOSCAN_ERRORS.lancement)
      setChargement(false)
      trackEvent('tool_error', { tool: 'geoscan' })
    }
  }

  const champs = [
    {
      nom: 'entreprise',
      texte: GEOSCAN_FORM.entreprise,
      valeur: entreprise,
      poser: setEntreprise,
      autoComplete: 'organization',
    },
    {
      nom: 'metier',
      texte: GEOSCAN_FORM.metier,
      valeur: metier,
      poser: setMetier,
      autoComplete: 'off',
    },
    {
      nom: 'ville',
      texte: GEOSCAN_FORM.ville,
      valeur: ville,
      poser: setVille,
      autoComplete: 'address-level2',
    },
  ]

  const formulaire = (
    <form noValidate onSubmit={lancer} className="relative">
      <div className="grid gap-3 md:grid-cols-3">
        {champs.map((champ) => (
          <div key={champ.nom}>
            <label htmlFor={`${uid}-${champ.nom}`} className="sr-only">
              {champ.texte.label}
            </label>
            <input
              id={`${uid}-${champ.nom}`}
              name={champ.nom}
              type="text"
              autoComplete={champ.autoComplete}
              placeholder={champ.texte.placeholder}
              value={champ.valeur}
              onChange={(evenement) => champ.poser(evenement.target.value)}
              className="border-ink/10 text-ink placeholder:text-muted focus:border-primary w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
        ))}
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
          className="mt-3 rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }}
        >
          {erreur}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="bg-ink/5 text-muted inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
          <Globe size={14} aria-hidden="true" className="shrink-0" />
          {GEOSCAN_FORM.chip}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-muted hidden text-xs sm:inline">
            {chargement ? GEOSCAN_FORM.submitLoading : GEOSCAN_FORM.submit}
          </span>
          <button
            type="submit"
            disabled={chargement}
            aria-label={GEOSCAN_FORM.submit}
            className={`bg-ink flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-opacity${
              chargement ? ' opacity-60' : ' hover:opacity-90'
            }`}
          >
            {chargement ? (
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
            ) : (
              <ArrowUp size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </form>
  )

  if (variant === 'tool') {
    return <div className="rounded-2xl bg-white p-5">{formulaire}</div>
  }

  return (
    <div className="bg-ink relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl p-3 shadow-[0_24px_48px_-28px_rgba(0,21,25,0.65)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: CARD_SHEEN }}
      />
      <div className="relative flex items-center gap-2 px-2 py-2 text-sm text-white/70">
        <Sparkles size={16} aria-hidden="true" className="shrink-0" />
        {GEOSCAN_HERO.hint}
      </div>
      <div className="relative rounded-2xl bg-white p-5">{formulaire}</div>
    </div>
  )
}
