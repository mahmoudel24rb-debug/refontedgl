'use client'

/** Evenements pousses dans le dataLayer par les outils du site. */
export type TrackingEvent =
  | 'tool_started'
  | 'tool_completed'
  | 'generate_lead'
  | 'tool_error'

/** Valeurs de lead_source attendues par GTM pour les deblocages. */
export type LeadSourceTracking =
  | 'pagespeed_unlock'
  | 'roi_unlock'
  | 'geoscan_unlock'
  | 'audit_request'
  | 'contact'

/** Signature minimale du dataLayer GTM. */
type DataLayer = Record<string, unknown>[]

/** Retourne le dataLayer, en le creant si GTM n a pas encore ete charge. */
function getDataLayer(): DataLayer | null {
  if (typeof window === 'undefined') return null
  const fenetre = window as Window & { dataLayer?: DataLayer }
  if (!Array.isArray(fenetre.dataLayer)) {
    fenetre.dataLayer = []
  }
  return fenetre.dataLayer
}

/**
 * Pousse un evenement dans le dataLayer.
 *
 * Sans conteneur GTM charge, l evenement est simplement empile : aucune
 * erreur, aucune dependance a NEXT_PUBLIC_GTM_ID cote composant.
 */
export function trackEvent(
  event: TrackingEvent,
  params: Record<string, unknown> = {},
): void {
  const dataLayer = getDataLayer()
  if (!dataLayer) return
  dataLayer.push({ event, ...params })
}

/** Pousse un evenement generate_lead avec sa source. */
export function trackLead(
  leadSource: LeadSourceTracking,
  params: Record<string, unknown> = {},
): void {
  trackEvent('generate_lead', { lead_source: leadSource, ...params })
}
