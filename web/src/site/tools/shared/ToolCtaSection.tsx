'use client'

import { ShieldCheck } from 'lucide-react'

import { trackLead, type LeadSourceTracking } from '@/lib/tracking'

import LeadForm, { type LeadFieldName, type LeadFormValues } from './LeadForm'
import ToolSection, { type ToolSectionTitle } from './ToolSection'
import { postLead } from './submit'

/**
 * Bloc CTA de bas de page des outils : section navy, carte blanche et
 * formulaire de demande d'audit. Reprend le formulaire CTA WordPress
 * (5 champs, envoi vers une route /api/tools/*).
 */
export interface ToolCtaSectionProps {
  id?: string
  title: ToolSectionTitle
  desc?: string
  card: { title: string; subtitle?: string }
  fields: LeadFieldName[]
  submitLabel: string
  privacy?: string
  success: { title: string; text: string }
  /** Route d'API qui enregistre le lead. */
  endpoint: string
  /** Champs ajoutes au corps de la requete (intention, identifiants). */
  extra?: Record<string, unknown>
  /** Source poussee dans le dataLayer apres un envoi reussi. */
  trackingSource?: LeadSourceTracking
}

export default function ToolCtaSection({
  id = 'formulaire',
  title,
  desc,
  card,
  fields,
  submitLabel,
  privacy,
  success,
  endpoint,
  extra,
  trackingSource,
}: ToolCtaSectionProps) {
  async function envoyer(valeurs: LeadFormValues) {
    const resultat = await postLead(endpoint, valeurs, extra)
    if (resultat.ok && trackingSource) {
      trackLead(trackingSource)
    }
    return resultat
  }

  return (
    <ToolSection id={id} title={title} desc={desc} tone="navy">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 md:p-8">
        <div className="text-center">
          <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-xl">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <h3 className="text-ink mt-4 text-xl font-semibold text-balance">
            {card.title}
          </h3>
          {card.subtitle ? (
            <p className="text-muted mt-2 text-sm">{card.subtitle}</p>
          ) : null}
        </div>

        <div className="mt-6">
          <LeadForm
            fields={fields}
            columns={2}
            submitLabel={submitLabel}
            privacy={privacy}
            successTitle={success.title}
            successText={success.text}
            onSubmit={envoyer}
          />
        </div>
      </div>
    </ToolSection>
  )
}
