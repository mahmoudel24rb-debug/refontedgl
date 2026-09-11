/**
 * Utilitaires HTML partages entre l'import WordPress et le rendu du blog.
 *
 * Les regles sont identiques a celles de scripts/fetch-blog.mjs pour que
 * les ancres du sommaire restent stables entre les articles importes en
 * mode legacy et ceux rediges dans l'editeur Lexical.
 */

/** Entites HTML nommees rencontrees dans les contenus WordPress. */
export const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  laquo: '«',
  raquo: '»',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  eacute: 'é',
  egrave: 'è',
  ecirc: 'ê',
  agrave: 'à',
  acirc: 'â',
  ccedil: 'ç',
  ugrave: 'ù',
  ucirc: 'û',
  icirc: 'î',
  iuml: 'ï',
  ocirc: 'ô',
  euro: '€',
  deg: '°',
  times: '×',
  bull: '•',
  middot: '·',
  shy: '',
  reg: '®',
  copy: '©',
  trade: '™',
}

/** Decode les entites HTML (nommees et numeriques) d'une chaine. */
export function decodeEntities(input: string): string {
  return String(input).replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (correspondance, code: string) => {
      if (code[0] === '#') {
        const num =
          code[1] === 'x' || code[1] === 'X'
            ? Number.parseInt(code.slice(2), 16)
            : Number.parseInt(code.slice(1), 10)
        return Number.isFinite(num) ? String.fromCodePoint(num) : correspondance
      }
      const nommee = NAMED_ENTITIES[code]
      return nommee === undefined ? correspondance : nommee
    },
  )
}

/** Retire les balises et normalise les blancs. */
export function stripTags(html: string): string {
  return decodeEntities(
    String(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim()
}

/**
 * Texte d'un fragment HTML, a l'identique de `element.textContent`.
 *
 * Contrairement a stripTags, aucune espace n'est inseree a la place des
 * balises : « <strong>Orleans</strong>, c'est » donne « Orleans, c'est »
 * et non « Orleans , c'est ». C'est la regle a suivre pour tout texte
 * affiche tel quel (le chapo d'un article) ; stripTags reste reserve au
 * comptage de mots et aux titres du sommaire.
 */
export function htmlToText(html: string): string {
  return decodeEntities(String(html).replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}

/** Slug ASCII a partir d'un texte francais (accents retires, 80 caracteres). */
export function slugify(text: string): string {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u201c\u201d]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Entree du sommaire d'un article. */
export interface TocEntry {
  id: string
  text: string
}

/** Resultat de addHeadingIds : HTML annote et sommaire. */
export interface HeadingIdsResult {
  html: string
  toc: TocEntry[]
}

/**
 * Ajoute un identifiant a chaque h2 et construit le sommaire.
 *
 * Memes regles que scripts/fetch-blog.mjs : slug du texte, suffixe
 * numerique en cas de doublon, et exclusion du sommaire des h2 places
 * dans un aside (encarts, pas des sections de l'article).
 */
export function addHeadingIds(htmlSource: string): HeadingIdsResult {
  const toc: TocEntry[] = []
  const utilises = new Set<string>()

  const html = htmlSource.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2\s*>/gi,
    (complet, attributs: string | undefined, interieur: string, offset: number) => {
      const texte = stripTags(interieur)
      if (!texte) return complet

      let id = slugify(texte) || `section-${toc.length + 1}`
      let n = 2
      while (utilises.has(id)) {
        id = `${slugify(texte)}-${n}`
        n += 1
      }
      utilises.add(id)

      const avant = htmlSource.slice(0, offset)
      const dansAside = avant.lastIndexOf('<aside') > avant.lastIndexOf('</aside>')
      if (!dansAside) toc.push({ id, text: texte })

      const restants = (attributs ?? '').replace(/\s+id=(?:"[^"]*"|'[^']*')/gi, '')
      return `<h2 id="${id}"${restants}>${interieur}</h2>`
    },
  )

  return { html, toc }
}
