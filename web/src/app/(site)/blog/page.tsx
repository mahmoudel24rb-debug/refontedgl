import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo'
import { getPosts } from '@/site/blog/posts'
import Blog from '@/site/pages/Blog'

export const metadata: Metadata = pageMetadata('/blog')

/** Page statique regeneree toutes les heures, invalidee a la publication. */
export const revalidate = 3600

/** Liste du blog : toutes les cartes d'articles publies. */
export default async function BlogPage() {
  const posts = await getPosts()

  return <Blog posts={posts} />
}
