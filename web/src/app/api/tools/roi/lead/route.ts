import { z } from 'zod'

import { notifyAdmin } from '@/lib/email'
import { buildNote, createOrUpdateLead } from '@/lib/leads'
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
import {
  PLATFORM_LABELS,
  SECTEUR_KEYS,
  SECTEURS,
  type SecteurKey,
} from '@/site/tools/roi/benchmarks'

/**
 * Deblocage du rapport detaille du simulateur de ROI.
 *
 * Reprend le handler `dgl_roi_lead_capture` de WordPress : pot de miel,
 * quota de trois envois par quart d'heure, creation ou completion du
 * lead avec les etiquettes du CRM, note au format WordPress, run
 * debloque et notification interne.
 */

/** Messages renvoyes au visiteur. */
const MESSAGES = {
  tropDeTentatives: 'Trop de tentatives. Réessayez dans 15 minutes.',
  champsManquants: 'Veuillez remplir tous les champs obligatoires.',
  erreur: "Erreur lors de l'enregistrement. Réessayez.",
} as const

/** Libelles des types de vente dans la note et l'email (roi-calculator-api.php). */
const RECURRENCE_LABELS = {
  unique: 'Achat unique',
  mensuel: 'Abonnement mensuel',
  annuel: 'Abonnement annuel',
  visite: 'Visites recurrentes',
} as const

type RecurrenceValue = keyof typeof RECURRENCE_LABELS

/** Libelle long d'un secteur, tel qu'affiche dans le menu deroulant. */
function libelleSecteur(valeur: SecteurKey): string {
  return SECTEURS.find((secteur) => secteur.value === valeur)?.label ?? valeur
}

/** Ligne de retention de la note, propre a chaque type de vente. */
function ligneRetention(
  recurrence: RecurrenceValue,
  retention: number,
): string | undefined {
  if (recurrence === 'mensuel') return `Duree de retention : ${retention} mois`
  if (recurrence === 'annuel') return `Renouvellements : ${retention} ans`
  if (recurrence === 'visite') return `Frequence : ${retention} visites/an`
  return undefined
}

/** Entier borne, tolerant aux nombres transmis sous forme de chaine. */
function entierBorne(min: number, max: number) {
  return z.coerce.number().finite().min(min).max(max)
}

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

  platform: z.enum(['meta', 'google']),
  secteur: z.enum(SECTEUR_KEYS as [SecteurKey, ...SecteurKey[]]),
  budget: entierBorne(50, 100_000),
  ticket: entierBorne(1, 100_000),
  recurrence: z.enum(['unique', 'mensuel', 'annuel', 'visite']),
  retention: entierBorne(0, 100).optional(),
  ltv: entierBorne(0, 10_000_000).optional(),

  roiBrut: entierBorne(-100, 10_000_000),
  roiOptimise: entierBorne(-100, 10_000_000),
  caBrut: entierBorne(0, 1_000_000_000),
  caOptimise: entierBorne(0, 1_000_000_000),
  clients: entierBorne(0, 1_000_000),

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
  const [limite, fenetre] = RATE_LIMITS['roi:lead']
  const quota = await consumeRateLimit(`roi:lead:${ip}`, limite, fenetre)
  if (!quota.ok) {
    return Response.json(
      { ok: false, error: MESSAGES.tropDeTentatives },
      { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } },
    )
  }

  const {
    prenom,
    nom,
    telephone,
    email,
    entreprise,
    platform,
    secteur,
    budget,
    ticket,
    recurrence,
    roiBrut,
    roiOptimise,
    caBrut,
    caOptimise,
    clients,
    pageUrl,
    utm,
  } = corps.data

  const retention = recurrence === 'unique' ? 0 : (corps.data.retention ?? 0)
  const ltv = corps.data.ltv ?? 0
  const plateformeLabel = PLATFORM_LABELS[platform]
  const secteurLabel = libelleSecteur(secteur)
  const venteLabel = RECURRENCE_LABELS[recurrence]

  const note = buildNote('SIMULATION ROI PUBLICITAIRE', [
    {
      lignes: [
        `Plateforme : ${plateformeLabel}`,
        `Secteur : ${secteurLabel}`,
        `Budget mensuel : ${budget} EUR`,
        `Ticket moyen : ${ticket} EUR`,
        `Type de vente : ${venteLabel}`,
        ligneRetention(recurrence, retention),
        ltv > 0 && recurrence !== 'unique'
          ? `Valeur vie client : ${Math.round(ltv).toLocaleString('fr-FR')} EUR`
          : undefined,
      ],
    },
    {
      titre: 'RESULTATS',
      lignes: [
        `ROI sans optimisation : ${roiBrut}%`,
        `ROI avec DGL Agency : ${roiOptimise}%`,
        `CA estime sans optim : ${caBrut} EUR`,
        `CA estime avec DGL : ${caOptimise} EUR`,
        `Clients estimes : ${clients}`,
      ],
    },
    {
      lignes: [
        'Le prospect a utilise le calculateur ROI et souhaite en savoir plus sur la gestion de ses campagnes publicitaires.',
      ],
    },
  ])

  const donnees = {
    platform,
    platformLabel: plateformeLabel,
    secteur,
    secteurLabel,
    budget,
    ticket,
    recurrence,
    retention,
    ltv,
    roiBrut,
    roiOptimise,
    caBrut,
    caOptimise,
    clients,
  }

  let leadId: string
  try {
    const { lead } = await createOrUpdateLead({
      email,
      prenom,
      nom,
      entreprise,
      telephone,
      source: 'roi',
      tags: ['calculateur-roi', 'budget-ads', 'lead-magnet'],
      note,
      // createOrUpdateLead range deja les donnees sous la cle de source,
      // le lead porte donc donnees.roi = { ... }.
      donnees,
      ip,
      userAgent: request.headers.get('user-agent'),
      pageUrl,
      utm,
    })
    leadId = lead.id
  } catch (erreur) {
    console.error('[roi/lead] lead non enregistre :', erreur)
    return jsonError(MESSAGES.erreur, 500)
  }

  // Trace de la simulation, reliee au lead qui vient de la debloquer.
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'tool-runs',
      data: {
        tool: 'roi',
        statut: 'debloque',
        entreprise,
        donnees,
        lead: leadId,
        ip,
      },
      depth: 0,
    })
  } catch (erreur) {
    console.error('[roi/lead] run non enregistre :', erreur)
  }

  const corpsEmail = [
    'Nouvelle simulation ROI Ads !',
    '',
    '=== COORDONNEES ===',
    `Prenom : ${prenom}`,
    `Nom : ${nom}`,
    `Entreprise : ${entreprise}`,
    `Email : ${email}`,
    `Telephone : ${telephone}`,
    '',
    '=== SIMULATION ===',
    `Plateforme : ${plateformeLabel}`,
    `Secteur : ${secteurLabel}`,
    `Budget mensuel : ${budget} EUR`,
    `Ticket moyen : ${ticket} EUR`,
    `Type de vente : ${venteLabel}`,
    ligneRetention(recurrence, retention),
    `ROI sans optim : ${roiBrut}%`,
    `ROI avec DGL : ${roiOptimise}%`,
    `CA sans optim : ${caBrut} EUR`,
    `CA avec DGL : ${caOptimise} EUR`,
    '',
    '=== CRM ===',
    `Lead : ${leadId}`,
  ]
    .filter((ligne): ligne is string => typeof ligne === 'string')
    .join('\n')

  await notifyAdmin(
    `Simulation ROI Ads : ${prenom} ${nom} - ${entreprise}`,
    corpsEmail,
  )

  return Response.json({ ok: true })
}
