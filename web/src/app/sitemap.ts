import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'
import { getPosts } from '@/site/blog/posts'
import { CASES } from '@/site/data/cases'

/** Pages fixes du site public, de la plus importante a la moins. */
const ROUTES_STATIQUES: { route: string; priority: number }[] = [
  { route: '/', priority: 1 },
  { route: '/realisations', priority: 0.9 },
  { route: '/outils', priority: 0.9 },
  { route: '/tarifs', priority: 0.9 },
  { route: '/blog', priority: 0.8 },
  { route: '/outils/test-pagespeed', priority: 0.8 },
  { route: '/outils/simulateur-roi', priority: 0.8 },
  { route: '/outils/test-visibilite-ia', priority: 0.8 },
]

/** Articles publies, dates de leur derniere modification dans Payload. */
async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  return posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}

/** Plan du site : pages fixes, fiches cas clients, puis articles. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const maintenant = new Date()

  return [
    ...ROUTES_STATIQUES.map(({ route, priority }) => ({
      url: absoluteUrl(route),
      lastModified: maintenant,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...CASES.map((etude) => ({
      url: absoluteUrl(`/realisations/${etude.slug}`),
      lastModified: maintenant,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...(await articleEntries()),
  ]
}
