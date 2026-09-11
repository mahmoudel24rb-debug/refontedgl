/**
 * Tokens partages du site racine DGL (refonte 2026).
 * Les couleurs sont dupliquees ici pour les usages inline (SVG, degrades,
 * filtres) ou les classes Tailwind ne suffisent pas.
 */
export const DGL = {
  page: '#F0EFE9',
  ink: '#002329',
  inkDeep: '#001519',
  primary: '#FE5752',
  primaryHover: '#E54A45',
  cream: '#F0EFE9',
  white: '#ffffff',
} as const

/** Les webp des logos clients sont livres en blanc : ce filtre les repasse en navy. */
export const LOGO_FILTER_INK =
  'brightness(0) invert(13%) sepia(21%) saturate(1600%) hue-rotate(140deg)'

/** Logo DGL : lettres blanches + fleche corail, pour les fonds sombres (navy). */
export const LOGO_DGL = '/assets/logos/logo-dgl-agency.webp'
/** Logo DGL : lettres navy + fleche corail, pour les fonds clairs (creme, blanc). */
export const LOGO_DGL_NAVY = '/assets/logos/logo-dgl-agency-navy.webp'

export const AUDIT_URL = 'https://dgl-agency.fr/audit-gratuit/'
export const CONTACT_URL = 'https://dgl-agency.fr/contact/'
/** Outil porte dans l'application (lot 6). */
export const TEST_IA_URL = '/outils/test-visibilite-ia'
/** Outil porte dans l'application (lot 4). */
export const PAGESPEED_URL = '/outils/test-pagespeed'
/** Outil porte dans l'application (lot 5). */
export const ROI_URL = '/outils/simulateur-roi'

export const PHONE = '02 55 99 40 94'
export const PHONE_HREF = 'tel:+33255994094'
export const EMAIL = 'contact@dgl-agency.fr'

export const MAHMOUD_AVATAR = '/composant-hero/team/Image-Equipe-Mahmoud.webp'
