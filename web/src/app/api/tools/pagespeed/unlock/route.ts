import { z } from 'zod'

import { notifyAdmin } from '@/lib/email'
import { buildNote, createOrUpdateLead, type LeadTag } from '@/lib/leads'
import { getPayloadClient } from '@/lib/payload'
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
 * Deblocage du rapport PageSpeed et demande d'audit de performance.
 *
 * Cree ou complete le lead, passe le run en debloque et notifie
 * l'equipe avec les sujets d'email du CRM WordPress.
 */

/** Messages renvoyes au visiteur. */
const MESSAGES = {
  tropDeTentatives: 'Trop de tentatives. Réessayez dans 15 minutes.',
  champsManquants: 'Veuillez remplir tous les champs obligatoires.',
  erreur: "Erreur lors de l'enregistrement. Réessayez.",
} as const

const bodySchema = antiBotSchema
  .extend({
    runId: z.string().max(60).optional(),
    entreprise: z
      .string({ message: MESSAGES.champsManquants })
      .trim()
      .min(1, "Veuillez indiquer le nom de votre entreprise.")
      .max(190, 'Nom trop long.'),
    email: emailSchema,
    telephone: telephoneSchema,
    prenom: nomSchema.optional(),
    nom: nomSchema.optional(),
    intent: z.literal('audit').optional(),
    pageUrl: z.string().trim().max(500).optional(),
    utm: utmSchema.optional(),
  })
  .superRefine((valeur, ctx) => {
    // Le formulaire de bas de page demande l'identite complete.
    if (valeur.intent === 'audit' && (!valeur.prenom || !valeur.nom)) {
      ctx.addIssue({ code: 'custom', message: MESSAGES.champsManquants })
    }
  })

/** Etiquettes posees sur le lead selon l'intention. */
function etiquettes(intent: 'audit' | undefined): LeadTag[] {
  return intent === 'audit'
    ? ['audit-performance', 'pagespeed-tool', 'optimisation-site']
    : ['pagespeed-tool', 'rapport-debloque']
}

/** Score formate pour les notes et les emails. */
function score(valeur: number | null | undefined): string {
  return `${typeof valeur === 'number' ? valeur : 0}/100`
}

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
  const [limite, fenetre] = RATE_LIMITS['ps:unlock']
  const quota = await consumeRateLimit(`ps:unlock:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeTentatives },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const { runId, entreprise, email, telephone, prenom, nom, intent, pageUrl, utm } =
    corps.data

  const payload = await getPayloadClient()

  // Analyse liee au deblocage, quand le visiteur vient de lancer un test.
  let url: string | undefined
  let scoreMobile: number | null | undefined
  let scoreDesktop: number | null | undefined

  if (runId) {
    try {
      const run = await payload.findByID({
        collection: 'tool-runs',
        id: runId,
        depth: 0,
      })
      url = run.url ?? undefined
      scoreMobile = run.scoreMobile
      scoreDesktop = run.scoreDesktop
    } catch {
      // Run introuvable (cache vide, identifiant errone) : on continue,
      // le lead vaut plus que la liaison au run.
    }
  }

  const note =
    intent === 'audit'
      ? buildNote('DEMANDE AUDIT PERFORMANCE', [
          {
            lignes: [
              'Source : Page Outil PageSpeed',
              `Entreprise : ${entreprise}`,
              url ? `URL analysee : ${url}` : undefined,
            ],
          },
          {
            lignes: [
              'Le prospect souhaite un accompagnement pour optimiser la performance de son site web.',
            ],
          },
        ])
      : buildNote('RAPPORT PAGESPEED DEBLOQUE', [
          {
            lignes: [
              `Entreprise : ${entreprise}`,
              url ? `URL analysee : ${url}` : undefined,
              url ? `Score Mobile : ${score(scoreMobile)}` : undefined,
              url ? `Score Desktop : ${score(scoreDesktop)}` : undefined,
            ],
          },
          {
            lignes: [
              'Le prospect a rempli le mini formulaire pour debloquer le rapport complet de performance.',
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
      url,
      source: 'pagespeed',
      tags: etiquettes(intent),
      note,
      donnees: {
        runId: runId ?? null,
        url: url ?? null,
        scoreMobile: scoreMobile ?? null,
        scoreDesktop: scoreDesktop ?? null,
        intent: intent ?? 'unlock',
      },
      ip,
      userAgent: request.headers.get('user-agent'),
      pageUrl,
      utm,
    })
    leadId = lead.id
  } catch (erreur) {
    console.error('[pagespeed/unlock] lead non enregistre :', erreur)
    return jsonError(MESSAGES.erreur, 500)
  }

  // Le run passe en debloque et pointe vers le lead.
  if (runId) {
    try {
      await payload.update({
        collection: 'tool-runs',
        id: runId,
        data: { statut: 'debloque', entreprise, lead: leadId },
        depth: 0,
      })
    } catch (erreur) {
      console.error('[pagespeed/unlock] run non mis a jour :', erreur)
    }
  }

  const sujet =
    intent === 'audit'
      ? `Demande Audit Performance : ${prenom ?? ''} ${nom ?? ''} - ${entreprise}`
      : `Rapport PageSpeed debloque : ${entreprise}`

  const corpsEmail =
    intent === 'audit'
      ? [
          "Nouvelle demande d'audit performance !",
          '',
          '=== COORDONNEES ===',
          `Prenom : ${prenom ?? ''}`,
          `Nom : ${nom ?? ''}`,
          `Entreprise : ${entreprise}`,
          `Email : ${email}`,
          `Telephone : ${telephone}`,
          '',
          '=== SOURCE ===',
          'Page : Outil PageSpeed',
          '',
          '=== CRM ===',
          `Lead : ${leadId}`,
        ].join('\n')
      : [
          'Un prospect a debloque son rapport PageSpeed complet !',
          '',
          '=== COORDONNEES ===',
          `Entreprise : ${entreprise}`,
          `Email : ${email}`,
          `Telephone : ${telephone}`,
          '',
          '=== ANALYSE ===',
          `URL analysee : ${url ?? 'non renseignee'}`,
          `Score Mobile : ${score(scoreMobile)}`,
          `Score Desktop : ${score(scoreDesktop)}`,
          '',
          '=== CRM ===',
          `Lead : ${leadId}`,
        ].join('\n')

  await notifyAdmin(sujet, corpsEmail)

  return Response.json({ ok: true, leadId })
}
