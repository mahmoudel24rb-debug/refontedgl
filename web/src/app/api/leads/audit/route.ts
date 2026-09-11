import { z } from 'zod'

import { notifyAdmin } from '@/lib/email'
import { buildNote, createOrUpdateLead } from '@/lib/leads'
import { RATE_LIMITS, consumeRateLimit } from '@/lib/rate-limit'
import { checkAntiBot, getClientIp, jsonError, readJson } from '@/lib/request'
import {
  antiBotSchema,
  emailSchema,
  nomSchema,
  telephoneSchema,
  utmSchema,
} from '@/lib/validation'

/**
 * Demande d'audit gratuit, depuis le bloc CTA de bas de page des outils.
 *
 * Route generique : elle n'est liee a aucun outil et ne cree pas de run.
 * Le lead est range dans la source contact avec l'etiquette
 * Audit Performance, et la page d'origine est conservee dans la note.
 */

/** Messages renvoyes au visiteur. */
const MESSAGES = {
  tropDeTentatives: 'Trop de tentatives. Réessayez dans 15 minutes.',
  champsManquants: 'Veuillez remplir tous les champs obligatoires.',
  erreur: "Erreur lors de l'enregistrement. Réessayez.",
} as const

const bodySchema = antiBotSchema.extend({
  prenom: nomSchema,
  nom: nomSchema,
  telephone: telephoneSchema,
  email: emailSchema,
  entreprise: z
    .string({ message: MESSAGES.champsManquants })
    .trim()
    .min(1, "Veuillez indiquer le nom de votre entreprise.")
    .max(190, 'Nom trop long.'),
  pageUrl: z.string().trim().max(500).optional(),
  utm: utmSchema.optional(),
})

export async function POST(request: Request): Promise<Response> {
  const corps = await readJson(request, bodySchema)
  if (!corps.ok) return jsonError(corps.message, 400)

  const antiBot = checkAntiBot(corps.data)
  if (!antiBot.ok) {
    if (antiBot.raison === 'honeypot') {
      return Response.json({ ok: true, fake: true })
    }
    return jsonError('Formulaire envoyé trop rapidement. Réessayez.', 400)
  }

  const ip = getClientIp(request)
  const [limite, fenetre] = RATE_LIMITS['leads:audit']
  const quota = await consumeRateLimit(`leads:audit:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeTentatives },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const { prenom, nom, telephone, email, entreprise, pageUrl, utm } = corps.data
  const origine = pageUrl ?? 'page inconnue'

  const note = buildNote('DEMANDE AUDIT GRATUIT', [
    {
      lignes: [
        `Demande audit gratuit depuis ${origine}`,
        `Entreprise : ${entreprise}`,
      ],
    },
  ])

  let leadId: string
  try {
    const { lead } = await createOrUpdateLead({
      email,
      prenom,
      nom,
      entreprise,
      telephone,
      source: 'contact',
      tags: ['audit-performance'],
      note,
      donnees: { origine },
      ip,
      userAgent: request.headers.get('user-agent'),
      pageUrl,
      utm,
    })
    leadId = lead.id
  } catch (erreur) {
    console.error('[leads/audit] lead non enregistre :', erreur)
    return jsonError(MESSAGES.erreur, 500)
  }

  await notifyAdmin(
    `Demande audit gratuit : ${prenom} ${nom} - ${entreprise}`,
    [
      "Nouvelle demande d'audit gratuit !",
      '',
      '=== COORDONNEES ===',
      `Prenom : ${prenom}`,
      `Nom : ${nom}`,
      `Entreprise : ${entreprise}`,
      `Email : ${email}`,
      `Telephone : ${telephone}`,
      '',
      '=== SOURCE ===',
      `Page : ${origine}`,
      '',
      '=== CRM ===',
      `Lead : ${leadId}`,
    ].join('\n'),
  )

  return Response.json({ ok: true })
}
