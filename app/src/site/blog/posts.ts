import data from '@/data/blog.json'

/**
 * Acces aux articles du blog : snapshot fige des articles WordPress de
 * dgl-agency.fr (`src/data/blog.json`, genere par `scripts/fetch-blog.mjs`).
 * Aucune requete reseau au runtime.
 */

export interface TocEntry {
  id: string
  text: string
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  /** Date ISO WordPress (« 2026-09-02T14:22:56 »). */
  date: string
  /** Date lisible en francais (« 2 septembre 2026 »). */
  dateLabel: string
  readingMinutes: number
  categories: string[]
  seoTitle: string
  seoDescription: string
  toc: TocEntry[]
  contentHtml: string
}

/** Deja trie par date decroissante a la generation. */
const POSTS = data as BlogPost[]

const BY_SLUG = new Map(POSTS.map((post) => [post.slug, post]))

/** Tous les articles, du plus recent au plus ancien. */
export function getPosts(): BlogPost[] {
  return POSTS
}

/** Un article par son slug (undefined si inconnu). */
export function getPost(slug: string | undefined): BlogPost | undefined {
  return slug ? BY_SLUG.get(slug) : undefined
}

/**
 * Articles a lire ensuite : meme categorie d'abord (du plus recent au plus
 * ancien), puis les plus recents pour completer.
 */
export function getRelated(slug: string, n = 3): BlogPost[] {
  const current = BY_SLUG.get(slug)
  const others = POSTS.filter((post) => post.slug !== slug)
  if (!current) return others.slice(0, n)

  const categories = new Set(current.categories)
  const sameCategory = others.filter((post) =>
    post.categories.some((name) => categories.has(name)),
  )
  const rest = others.filter((post) => !sameCategory.includes(post))

  return [...sameCategory, ...rest].slice(0, n)
}

/** « 2026-09-02T14:22:56 » -> « 2 septembre 2026 » (secours cote client). */
const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const day = date.getUTCDate()
  return `${day === 1 ? '1er' : day} ${MONTHS_FR[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}
