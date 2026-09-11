import { getPayload, type Payload } from 'payload'

/**
 * Instance Payload memoisee pour le process courant.
 *
 * La configuration est chargee par import dynamique : lib/leads.ts est
 * importe par la collection Leads, elle-meme importee par la config.
 * Un import statique creerait un cycle au chargement.
 */
let instance: Promise<Payload> | null = null

/** Retourne le client Payload (local API) partage par l'application. */
export function getPayloadClient(): Promise<Payload> {
  if (!instance) {
    instance = import('@payload-config').then((module) =>
      getPayload({ config: module.default }),
    )
  }
  return instance
}
