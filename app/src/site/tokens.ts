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

/** Logo DGL (fichier navy) repasse en blanc sur les fonds sombres. */
export const LOGO_FILTER_WHITE = 'brightness(0) invert(1)'

export const AUDIT_URL = 'https://dgl-agency.fr/audit-gratuit/'
export const CONTACT_URL = 'https://dgl-agency.fr/contact/'
export const TEST_IA_URL = 'https://dgl-agency.fr/test-visibilite-ia/'

export const PHONE = '02 55 99 40 94'
export const PHONE_HREF = 'tel:+33255994094'
export const EMAIL = 'contact@dgl-agency.fr'

export const MAHMOUD_AVATAR = '/composant-hero/team/Image-Equipe-Mahmoud.webp'
export const LOGO_DGL = '/assets/logos/logo-dgl-agency.webp'
