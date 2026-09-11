/**
 * Normalisation et rapprochement de noms du scan de visibilite IA.
 *
 * Portage fidele de DGLGS_DB::normalize et de la partie matching de
 * DGLGS_Scoring : accents replies sur l'alphabet latin, retrait des
 * formes juridiques et des mots vides, containment prudent (au moins
 * cinq caracteres) et heuristique de domaine pour les sources.
 * En cas de doute, l'entreprise est consideree NON citee.
 */

/** Table d'accents de DGLGS_DB::normalize, reprise a l'identique. */
const ACCENTS: Record<string, string> = {
  à: 'a',
  â: 'a',
  ä: 'a',
  á: 'a',
  é: 'e',
  è: 'e',
  ê: 'e',
  ë: 'e',
  î: 'i',
  ï: 'i',
  í: 'i',
  ô: 'o',
  ö: 'o',
  ó: 'o',
  ù: 'u',
  û: 'u',
  ü: 'u',
  ú: 'u',
  ç: 'c',
  ñ: 'n',
  œ: 'oe',
  æ: 'ae',
}

/**
 * Formes juridiques et mots vides retires avant rapprochement.
 * Dix neuf entrees, identiques a DGLGS_Scoring::STOPWORDS.
 */
export const STOPWORDS: readonly string[] = [
  'sarl',
  'sas',
  'sasu',
  'eurl',
  'sa',
  'sci',
  'ei',
  'entreprise',
  'societe',
  'ets',
  'etablissements',
  'chez',
  'le',
  'la',
  'les',
  'de',
  'du',
  'des',
  'et',
]

/**
 * Minuscules, accents replies, tout caractere non alphanumerique
 * remplace par une espace, espaces multiples reduits.
 */
export function normalize(text: string): string {
  const minuscules = String(text ?? '')
    .trim()
    .toLowerCase()
  let translittere = ''
  for (const caractere of minuscules) {
    translittere += ACCENTS[caractere] ?? caractere
  }
  return translittere
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Normalise un nom d'entreprise et retire les mots vides. */
export function normalizeName(name: string): string {
  const norme = normalize(name)
  if (norme === '') return ''
  return norme
    .split(' ')
    .filter((mot) => mot !== '' && !STOPWORDS.includes(mot))
    .join(' ')
    .trim()
}

/**
 * Deux noms d'entreprise designent-ils la meme enseigne ?
 *
 * Prudent : egalite stricte, egalite sans espaces, puis containment
 * uniquement sur des chaines d'au moins cinq caracteres.
 */
export function namesMatch(a: string, b: string): boolean {
  const gauche = normalizeName(a)
  const droite = normalizeName(b)
  if (gauche === '' || droite === '') return false
  if (gauche === droite) return true

  const gaucheCompact = gauche.replace(/ /g, '')
  const droiteCompact = droite.replace(/ /g, '')
  if (gaucheCompact === droiteCompact) return true

  if (gaucheCompact.length >= 5 && droiteCompact.includes(gaucheCompact)) return true
  if (droiteCompact.length >= 5 && gaucheCompact.includes(droiteCompact)) return true

  return false
}

/** Hote d'une URL, ou chaine vide quand l'URL est illisible. */
function hote(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

/**
 * Le site de l'entreprise apparait-il dans les sources citees ?
 *
 * Heuristique de domaine : le nom compacte doit se retrouver dans
 * l'hote normalise d'au moins une source.
 */
export function sourcesMatch(entreprise: string, sources: string[]): boolean {
  const compact = normalizeName(entreprise).replace(/ /g, '')
  if (compact.length < 4) return false

  for (const url of sources) {
    const host = hote(url)
    if (host === '') continue
    const hostNorm = normalize(host.replace(/-/g, '')).replace(/ /g, '')
    if (hostNorm.includes(compact)) return true
  }

  return false
}
