import { getPayloadClient } from './payload'

/** Destinataire des notifications internes. */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@dgl-agency.fr'

/**
 * Envoie une notification interne a l'equipe.
 *
 * Sans adaptateur email configure (RESEND_API_KEY absente), Payload
 * journalise simplement le message. Les erreurs sont capturees : un
 * echec d'envoi ne doit jamais faire echouer la creation d'un lead.
 *
 * Retourne true quand l'envoi a abouti, false sinon.
 */
export async function notifyAdmin(subject: string, text: string): Promise<boolean> {
  try {
    const payload = await getPayloadClient()
    await payload.sendEmail({
      to: ADMIN_EMAIL,
      subject,
      text,
    })
    return true
  } catch (erreur) {
    console.error('[email] notification admin non envoyee :', erreur)
    return false
  }
}
