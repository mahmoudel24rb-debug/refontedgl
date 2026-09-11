import { z } from 'zod'

import { notifyAdmin } from '@/lib/email'
import { buildReport, podiumTexte } from '@/lib/geoscan/report'
import { evaluate, type ScanResults } from '@/lib/geoscan/scoring'
import { buildNote, createOrUpdateLead } from '@/lib/leads'
import { getPayloadClient } from '@/lib/payload'
import { RATE_LIMITS, consumeRateLimit } from '@/lib/rate-limit'
import { checkAntiBot, getClientIp, jsonError, readJson } from '@/lib/request'
import { antiBotSchema, emailSchema, nomSchema, utmSchema } from '@/lib/validation'
import type { Scan } from '@/payload-types'

/**
 * Deblocage du rapport de visibilite IA.
 *
 * Portage de DGLGS_Ajax::handle_unlock : consentement obligatoire,
 * telephone exige pour le rappel, creation du lead avec le podium dans
 * la note, email interne servant de script d'appel, puis rapport
 * complet renvoye au visiteur.
 */

/** Messages renvoyes au visiteur, repris du plugin WordPress. */
const MESSAGES = {
  tropDeTentatives: 'Trop de tentatives. Réessayez dans 15 minutes.',
  champsManquants: 'Veuillez remplir tous les champs obligatoires.',
  telephone: 'Veuillez indiquer un numéro de téléphone valide pour le rappel.',
  consentement: 'Le consentement est requis pour être recontacté.',
  testIntrouvable: 'Test introuvable. Relancez une analyse.',
  resultatsIndisponibles: 'Résultats indisponibles. Relancez une analyse.',
  tropRapide: 'Formulaire envoyé trop rapidement. Réessayez.',
  erreur: "Erreur lors de l'enregistrement. Réessayez.",
} as const

const bodySchema = antiBotSchema.extend({
  runId: z.string({ message: MESSAGES.testIntrouvable }).trim().min(1, MESSAGES.testIntrouvable),
  prenom: nomSchema,
  email: emailSchema,
  telephone: z
    .string({ message: MESSAGES.telephone })
    .trim()
    .max(40, MESSAGES.telephone)
    .refine((valeur) => (valeur.match(/\d/g) ?? []).length >= 8, MESSAGES.telephone),
  consent: z.literal(true, { message: MESSAGES.consentement }),
  pageUrl: z.string().trim().max(500).optional(),
  utm: utmSchema.optional(),
})

/** Lit les resultats stockes sur le scan. */
function lireResultats(scan: Scan): ScanResults | null {
  const brut = scan.results
  if (brut && typeof brut === 'object' && !Array.isArray(brut)) {
    const valeur = brut as { reponses?: unknown }
    if (Array.isArray(valeur.reponses)) {
      return { reponses: valeur.reponses as ScanResults['reponses'] }
    }
  }
  return null
}

export async function POST(request: Request): Promise<Response> {
  const corps = await readJson(request, bodySchema)
  if (!corps.ok) return jsonError(corps.message, 400)

  const antiBot = checkAntiBot(corps.data)
  if (!antiBot.ok) {
    if (antiBot.raison === 'honeypot') {
      return Response.json({ ok: true, fake: true })
    }
    return jsonError(MESSAGES.tropRapide, 400)
  }

  const ip = getClientIp(request)
  const [limite, fenetre] = RATE_LIMITS['geo:unlock']
  const quota = await consumeRateLimit(`geo:unlock:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeTentatives },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const { runId, prenom, email, telephone, pageUrl, utm } = corps.data
  const payload = await getPayloadClient()

  let run
  try {
    run = await payload.findByID({ collection: 'tool-runs', id: runId, depth: 0 })
  } catch {
    return jsonError(MESSAGES.testIntrouvable, 404)
  }

  const scanId = typeof run.scan === 'string' ? run.scan : (run.scan?.id ?? null)
  if (!scanId) return jsonError(MESSAGES.resultatsIndisponibles, 404)

  let scan: Scan
  try {
    scan = await payload.findByID({ collection: 'scans', id: scanId, depth: 0 })
  } catch {
    return jsonError(MESSAGES.resultatsIndisponibles, 404)
  }

  const resultats = lireResultats(scan)
  if (!resultats) return jsonError(MESSAGES.resultatsIndisponibles, 409)

  const entreprise = run.entreprise ?? ''
  const evaluation = evaluate(resultats, entreprise)
  const rapport = buildReport(resultats, evaluation, entreprise)

  const note = buildNote('Test de visibilité IA locale', [
    {
      lignes: [
        `Entreprise : ${entreprise}`,
        `Métier : ${scan.metier} / Ville : ${scan.ville}`,
        `Score : ${evaluation.score}/100 (cité ${evaluation.citedCount} fois sur ${evaluation.total} réponses)`,
        `Site dans les sources : ${evaluation.sourcesOk ? 'oui' : 'NON'}`,
      ],
    },
    { titre: 'Concurrents les plus cités', lignes: [podiumTexte(rapport.podium)] },
    {
      lignes: [
        'LEAD TRÈS CHAUD : a vu le podium de ses concurrents, promesse de rappel sous 2 h ouvrées.',
      ],
    },
  ])

  let leadId: string
  try {
    const { lead } = await createOrUpdateLead({
      email,
      prenom,
      entreprise,
      telephone,
      source: 'geoscan',
      tags: ['geo-scan', 'visibilite-ia'],
      note,
      rappelSous2h: true,
      consentement: true,
      donnees: {
        runId,
        scanId,
        metier: scan.metier,
        ville: scan.ville,
        score: evaluation.score,
        cited: evaluation.citedCount,
        total: evaluation.total,
        devant: evaluation.devant,
        sourcesOk: evaluation.sourcesOk,
        podium: rapport.podium.map((concurrent) => ({
          nom: concurrent.nom,
          count: concurrent.count,
        })),
      },
      ip,
      userAgent: request.headers.get('user-agent'),
      pageUrl,
      utm,
    })
    leadId = lead.id
  } catch (erreur) {
    console.error('[geoscan/unlock] lead non enregistre :', erreur)
    return jsonError(MESSAGES.erreur, 500)
  }

  try {
    await payload.update({
      collection: 'tool-runs',
      id: runId,
      data: {
        statut: 'debloque',
        lead: leadId,
        score: evaluation.score,
        cited: evaluation.citedCount,
        total: evaluation.total,
        donnees: rapport as unknown as Record<string, unknown>,
      },
      depth: 0,
    })
  } catch (erreur) {
    console.error('[geoscan/unlock] run non mis a jour :', erreur)
  }

  const sujet = `[RAPPEL SOUS 2H] Scan visibilité IA : ${prenom} - ${entreprise} (${evaluation.score}/100)`
  const corpsEmail = [
    'Nouveau lead TEST VISIBILITÉ IA (promesse : rappel sous 2 h ouvrées) !',
    '',
    '=== COORDONNÉES ===',
    `Prénom : ${prenom}`,
    `Téléphone : ${telephone}`,
    `Email : ${email}`,
    '',
    '=== SON TEST ===',
    `Entreprise : ${entreprise}`,
    `Métier : ${scan.metier} / Ville : ${scan.ville}`,
    `Score : ${evaluation.score}/100, cité ${evaluation.citedCount} fois sur ${evaluation.total}`,
    `Concurrents devant : ${evaluation.devant}`,
    `Site dans les sources : ${evaluation.sourcesOk ? 'oui' : 'NON'}`,
    '',
    "Angle d'appel : il/elle vient de voir les concurrents que les IA recommandent à sa place.",
    '',
    '=== CRM ===',
    `Lead : ${leadId}`,
  ].join('\n')

  await notifyAdmin(sujet, corpsEmail)

  return Response.json({ ok: true, ...rapport })
}
