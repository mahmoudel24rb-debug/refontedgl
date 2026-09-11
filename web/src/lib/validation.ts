import { z } from 'zod'

/** Adresse email, normalisee en minuscules. */
export const emailSchema = z
  .string({ message: 'Email requis.' })
  .trim()
  .min(5, 'Email requis.')
  .max(190, 'Email trop long.')
  .email('Adresse email invalide.')
  .transform((valeur) => valeur.toLowerCase())

/** Telephone francais ou international : au moins 8 chiffres. */
export const telephoneSchema = z
  .string({ message: 'Telephone requis.' })
  .trim()
  .min(1, 'Telephone requis.')
  .max(40, 'Telephone trop long.')
  .refine(
    (valeur) => (valeur.match(/\d/g) ?? []).length >= 8,
    'Numero de telephone invalide (8 chiffres minimum).',
  )

/** Hotes interdits : boucle locale et plages privees. */
const HOTES_INTERDITS = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|169\.254\.|\[?::1\]?$)/i

/**
 * URL publique en https, hote qualifie, hors reseaux prives.
 *
 * Le prefixe https:// est ajoute quand l'utilisateur saisit un domaine nu.
 */
export const urlSchema = z
  .string({ message: 'URL requise.' })
  .trim()
  .min(4, 'URL requise.')
  .max(500, 'URL trop longue.')
  .transform((valeur) => (/^https?:\/\//i.test(valeur) ? valeur : `https://${valeur}`))
  .superRefine((valeur, ctx) => {
    let parsee: URL
    try {
      parsee = new URL(valeur)
    } catch {
      ctx.addIssue({ code: 'custom', message: 'URL invalide.' })
      return
    }
    if (parsee.protocol !== 'https:') {
      ctx.addIssue({ code: 'custom', message: 'Seules les URL en https sont acceptees.' })
      return
    }
    const hote = parsee.hostname
    if (!hote.includes('.') || hote.startsWith('.') || hote.endsWith('.')) {
      ctx.addIssue({ code: 'custom', message: 'Nom de domaine invalide.' })
      return
    }
    if (HOTES_INTERDITS.test(hote)) {
      ctx.addIssue({ code: 'custom', message: 'Cette adresse n est pas accessible publiquement.' })
    }
  })

/** Nom ou prenom : lettres, espaces, tirets et apostrophes. */
export const nomSchema = z
  .string({ message: 'Nom requis.' })
  .trim()
  .min(2, 'Nom trop court.')
  .max(80, 'Nom trop long.')
  .regex(/^[\p{L}\s'-]+$/u, 'Nom invalide.')

/** Metier ou activite saisi par l'utilisateur. */
export const metierSchema = z
  .string({ message: 'Metier requis.' })
  .trim()
  .min(2, 'Metier trop court.')
  .max(80, 'Metier trop long.')
  .regex(/^[\p{L}0-9\s'\-&.]+$/u, 'Metier invalide.')

/** Ville ciblee par le scan de visibilite. */
export const villeSchema = z
  .string({ message: 'Ville requise.' })
  .trim()
  .min(2, 'Ville trop courte.')
  .max(80, 'Ville trop longue.')
  .regex(/^[\p{L}0-9\s'\-]+$/u, 'Ville invalide.')

/** Consentement RGPD : la case doit etre cochee. */
export const consentSchema = z.literal(true, {
  message: 'Vous devez accepter d etre recontacte.',
})

/** Champs UTM collectes cote client et stockes sur le lead. */
export const utmSchema = z
  .object({
    source: z.string().trim().max(120).optional(),
    medium: z.string().trim().max(120).optional(),
    campaign: z.string().trim().max(190).optional(),
    term: z.string().trim().max(190).optional(),
    content: z.string().trim().max(190).optional(),
  })
  .partial()

/** Champs anti-bot presents dans tous les formulaires. */
export const antiBotSchema = z.object({
  website: z.string().max(190).optional(),
  ts: z.union([z.number(), z.string()]).optional(),
})
