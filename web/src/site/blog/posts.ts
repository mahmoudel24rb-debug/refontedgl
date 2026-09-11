import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { unstable_cache } from 'next/cache'

import { addHeadingIds } from '@/lib/html'
import { getPayloadClient } from '@/lib/payload'
import type { Article } from '@/payload-types'

/**
 * Acces aux articles du blog, servis par Payload.
 *
 * Les lectures passent par un cache Next etiquete « articles » : le hook
 * afterChange de la collection l'invalide a chaque publication. Les objets
 * renvoyes sont de simples structures serialisables (aucun document Payload
 * brut), utilisables directement par les composants serveur.
 */

/** Etiquette de cache partagee avec le hook afterChange de la collection. */
export const BLOG_CACHE_TAG = 'articles'

/** Duree de vie du cache, alignee sur le revalidate des pages du blog. */
const DUREE_CACHE = 3600

export interface TocEntry {
  id: string
  text: string
}

export interface BlogPost {
  /** Identifiant Payload de l'article. */
  id: string
  slug: string
  title: string
  excerpt: string
  /** Date de publication ISO. */
  date: string
  /** Date de derniere modification ISO (plan du site, JSON-LD). */
  updatedAt: string
  /** Date lisible en francais (« 2 septembre 2026 »). */
  dateLabel: string
  readingMinutes: number
  categories: string[]
  seoTitle: string
  seoDescription: string
  toc: TocEntry[]
  contentHtml: string
}

/* -------------------------------------------------------------------------- */
/* Conversion d'un document Payload vers le DTO du site                       */
/* -------------------------------------------------------------------------- */

/** Noms des categories liees, dans l'ordre de la relation. */
function nomsCategories(valeurs: Article['categories']): string[] {
  if (!Array.isArray(valeurs)) return []
  return valeurs
    .map((valeur) =>
      typeof valeur === 'object' && valeur !== null && typeof valeur.name === 'string'
        ? valeur.name
        : '',
    )
    .filter((nom) => nom !== '')
}

/**
 * HTML du corps de l'article.
 *
 * En mode legacy c'est le HTML WordPress importe, rendu tel quel par
 * BlogProse (encarts, tableaux, details et svg sont conserves). En mode
 * lexical, l'arbre de l'editeur est serialise sans conteneur pour que la
 * typographie .dgl-prose s'applique aux enfants directs.
 */
function htmlArticle(doc: Article): string {
  if (doc.renderMode === 'legacy') return doc.legacyHtml ?? ''
  if (!doc.content) return ''

  try {
    return convertLexicalToHTML({
      data: doc.content as unknown as SerializedEditorState,
      disableContainer: true,
    })
  } catch (erreur) {
    const message = erreur instanceof Error ? erreur.message : String(erreur)
    console.warn(`[blog] rendu Lexical impossible pour ${doc.slug} : ${message}`)
    return ''
  }
}

/** Document Payload vers article du site (ancres du sommaire comprises). */
function versPost(doc: Article): BlogPost {
  const { html, toc } = addHeadingIds(htmlArticle(doc))
  const date = doc.publishedAt ?? doc.createdAt

  return {
    id: doc.id,
    slug: doc.slug ?? '',
    title: doc.title,
    excerpt: doc.excerpt ?? '',
    date,
    updatedAt: doc.updatedAt,
    dateLabel: formatDate(date),
    readingMinutes: doc.readingMinutes ?? 2,
    categories: nomsCategories(doc.categories),
    seoTitle: doc.meta?.title ?? doc.title,
    seoDescription: doc.meta?.description ?? doc.excerpt ?? '',
    toc,
    contentHtml: html,
  }
}

/* -------------------------------------------------------------------------- */
/* Lecture mise en cache                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Tous les articles publies, du plus recent au plus ancien.
 *
 * Une seule entree de cache couvre la liste et les pages d'article : le
 * volume reste modeste (moins de 500 ko) et evite autant de lectures que
 * d'articles au build.
 */
const chargerPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const payload = await getPayloadClient()
    const resultat = await payload.find({
      collection: 'articles',
      where: { _status: { equals: 'published' } },
      // wpId departage les articles importes le meme jour a la meme heure
      // et reproduit l'ordre de l'API WordPress (date puis identifiant).
      sort: ['-publishedAt', '-wpId'],
      depth: 1,
      pagination: false,
      draft: false,
    })

    return resultat.docs.map(versPost)
  },
  ['blog-articles-publies'],
  { tags: [BLOG_CACHE_TAG], revalidate: DUREE_CACHE },
)

/** Tous les articles publies, du plus recent au plus ancien. */
export async function getPosts(): Promise<BlogPost[]> {
  return chargerPosts()
}

/** Un article par son slug (undefined si inconnu ou non publie). */
export async function getPost(slug: string | undefined): Promise<BlogPost | undefined> {
  if (!slug) return undefined
  const posts = await chargerPosts()
  return posts.find((post) => post.slug === slug)
}

/**
 * Articles a lire ensuite : meme categorie d'abord (du plus recent au plus
 * ancien), puis les plus recents pour completer.
 */
export async function getRelated(slug: string, n = 3): Promise<BlogPost[]> {
  const posts = await chargerPosts()
  const current = posts.find((post) => post.slug === slug)
  const others = posts.filter((post) => post.slug !== slug)
  if (!current) return others.slice(0, n)

  const categories = new Set(current.categories)
  const sameCategory = others.filter((post) =>
    post.categories.some((name) => categories.has(name)),
  )
  const rest = others.filter((post) => !sameCategory.includes(post))

  return [...sameCategory, ...rest].slice(0, n)
}

/* -------------------------------------------------------------------------- */
/* Date lisible                                                               */
/* -------------------------------------------------------------------------- */

/** « 2026-09-02T14:22:56Z » -> « 2 septembre 2026 ». */
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
