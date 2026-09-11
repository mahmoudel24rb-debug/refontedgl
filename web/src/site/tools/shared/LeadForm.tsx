'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import {
  LEAD_CONSENT_LABEL,
  LEAD_FIELDS,
  LEAD_MESSAGES,
  type LeadFieldName,
} from './texts'

/**
 * Formulaire de capture des outils : champs configurables, pot de miel
 * hors ecran, horodatage pose au montage (piege temporel serveur),
 * validation identique au JavaScript WordPress et etats
 * idle / loading / success / error.
 */

export type { LeadFieldName }

/** Valeurs transmises a l'appelant lors de l'envoi. */
export interface LeadFormValues {
  entreprise?: string
  email?: string
  telephone?: string
  prenom?: string
  nom?: string
  consent?: boolean
  /** Pot de miel : vide chez un humain. */
  website: string
  /** Horodatage (ms) pose a l'affichage du formulaire. */
  ts: number
}

/** Reponse attendue de l'appelant apres envoi. */
export type LeadFormOutcome = { ok: true } | { ok: false; message: string }

export interface LeadFormProps {
  fields: LeadFieldName[]
  submitLabel: string
  loadingLabel?: string
  /** Mention sous le bouton. */
  privacy?: string
  consentLabel?: string
  successTitle?: string
  successText?: string
  /** Disposition des champs : une ou deux colonnes. */
  columns?: 1 | 2
  /** Formulaire pose sur une surface claire ou sur un fond navy. */
  tone?: 'light' | 'navy'
  onSubmit: (values: LeadFormValues) => Promise<LeadFormOutcome>
}

type EtatFormulaire = 'idle' | 'loading' | 'success' | 'error'

/** Regex email du JavaScript WordPress. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Champs qui occupent toute la largeur meme en deux colonnes. */
const PLEINE_LARGEUR: LeadFieldName[] = ['entreprise', 'consent']

export default function LeadForm({
  fields,
  submitLabel,
  loadingLabel = LEAD_MESSAGES.envoiEnCours,
  privacy,
  consentLabel = LEAD_CONSENT_LABEL,
  successTitle,
  successText,
  columns = 1,
  tone = 'light',
  onSubmit,
}: LeadFormProps) {
  const [valeurs, setValeurs] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [etat, setEtat] = useState<EtatFormulaire>('idle')
  const [erreur, setErreur] = useState('')
  const tsRef = useRef(0)
  // Plusieurs formulaires coexistent sur une page outil : les
  // identifiants doivent rester uniques pour les labels.
  const uid = useId()

  // Le piege temporel compare cet horodatage a l'heure d'envoi.
  useEffect(() => {
    tsRef.current = Date.now()
  }, [])

  const lire = (nom: LeadFieldName): string => (valeurs[nom] ?? '').trim()

  /** Reproduit la validation navigateur du JS WordPress, dans son ordre. */
  function valider(): string | null {
    if (fields.includes('entreprise') && !lire('entreprise')) {
      return LEAD_MESSAGES.entrepriseManquante
    }
    if (fields.includes('prenom') && !lire('prenom')) {
      return LEAD_MESSAGES.champsManquants
    }
    if (fields.includes('nom') && !lire('nom')) {
      return LEAD_MESSAGES.champsManquants
    }
    if (fields.includes('email')) {
      const email = lire('email')
      if (!email || !EMAIL_REGEX.test(email)) return LEAD_MESSAGES.emailInvalide
    }
    if (fields.includes('telephone')) {
      const chiffres = lire('telephone').replace(/\D/g, '')
      if (chiffres.length < 8) return LEAD_MESSAGES.telephoneInvalide
    }
    if (fields.includes('consent') && !consent) {
      return LEAD_MESSAGES.consentementManquant
    }
    return null
  }

  async function envoyer(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (etat === 'loading') return

    const probleme = valider()
    if (probleme) {
      setErreur(probleme)
      setEtat('error')
      return
    }

    setErreur('')
    setEtat('loading')

    try {
      const resultat = await onSubmit({
        entreprise: lire('entreprise') || undefined,
        email: lire('email') || undefined,
        telephone: lire('telephone') || undefined,
        prenom: lire('prenom') || undefined,
        nom: lire('nom') || undefined,
        consent: fields.includes('consent') ? consent : undefined,
        website,
        ts: tsRef.current,
      })

      if (resultat.ok) {
        setEtat('success')
        return
      }
      setErreur(resultat.message)
      setEtat('error')
    } catch {
      setErreur(LEAD_MESSAGES.erreurReseau)
      setEtat('error')
    }
  }

  if (etat === 'success' && (successTitle || successText)) {
    return (
      <div className="text-center">
        <span
          className="mx-auto flex size-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(12, 206, 107, 0.12)', color: '#0cce6b' }}
        >
          <Check size={24} aria-hidden="true" />
        </span>
        {successTitle ? (
          <h3
            className={`mt-4 text-lg font-semibold ${
              tone === 'navy' ? 'text-white' : 'text-ink'
            }`}
          >
            {successTitle}
          </h3>
        ) : null}
        {successText ? (
          <p
            className={`mt-2 text-sm leading-6 ${
              tone === 'navy' ? 'text-white/70' : 'text-muted'
            }`}
          >
            {successText}
          </p>
        ) : null}
      </div>
    )
  }

  const classesLabel =
    tone === 'navy'
      ? 'text-xs font-medium text-white/70'
      : 'text-ink/70 text-xs font-medium'
  const classesInput =
    tone === 'navy'
      ? 'mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none'
      : 'border-ink/10 text-ink placeholder:text-muted focus:border-primary mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none'

  return (
    <form noValidate onSubmit={envoyer} className="relative text-left">
      <div className={columns === 2 ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3'}>
        {fields.map((nom) => {
          const pleine = columns === 1 || PLEINE_LARGEUR.includes(nom)

          if (nom === 'consent') {
            return (
              <label
                key={nom}
                className={`flex items-start gap-2 text-xs leading-5 ${
                  tone === 'navy' ? 'text-white/70' : 'text-muted'
                }${pleine ? ' sm:col-span-2' : ''}`}
              >
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(evenement) => setConsent(evenement.target.checked)}
                  className="accent-primary mt-0.5 size-4 shrink-0"
                />
                <span>{consentLabel}</span>
              </label>
            )
          }

          const champ = LEAD_FIELDS[nom]
          return (
            <div key={nom} className={pleine ? 'sm:col-span-2' : undefined}>
              <label className={classesLabel} htmlFor={`${uid}-${nom}`}>
                {champ.label}
              </label>
              <input
                id={`${uid}-${nom}`}
                name={nom}
                type={champ.type}
                autoComplete={champ.autoComplete}
                placeholder={champ.placeholder}
                value={valeurs[nom] ?? ''}
                onChange={(evenement) =>
                  setValeurs((precedent) => ({
                    ...precedent,
                    [nom]: evenement.target.value,
                  }))
                }
                className={classesInput}
              />
            </div>
          )
        })}
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

      {etat === 'error' && erreur ? (
        <p
          role="alert"
          className="mt-3 rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: 'rgba(255, 78, 66, 0.1)', color: '#c0392b' }}
        >
          {erreur}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={etat === 'loading'}
        className={`shiny-cta shiny-cta--sm mt-4 w-full justify-center${
          etat === 'loading' ? ' opacity-70' : ''
        }`}
      >
        <span>
          {etat === 'loading' ? loadingLabel : submitLabel}
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </button>

      {privacy ? (
        <p
          className={`mt-3 text-center text-xs ${
            tone === 'navy' ? 'text-white/50' : 'text-muted'
          }`}
        >
          {privacy}
        </p>
      ) : null}
    </form>
  )
}
