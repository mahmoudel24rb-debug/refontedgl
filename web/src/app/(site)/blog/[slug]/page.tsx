import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { JsonLd, articleJsonLd, pageMetadata } from '@/lib/seo'
import { getPost, getPosts, getRelated } from '@/site/blog/posts'
import BlogPostView from '@/site/pages/BlogPost'

/** Page statique regeneree toutes les heures, invalidee a la publication. */
export const revalidate = 3600

/** Parametres de route, promis depuis Next 15. */
interface ArticleParams {
  params: Promise<{ slug: string }>
}

/** Les articles publies sont pre-rendus au build. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: ArticleParams): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Blog', robots: { index: false, follow: false } }

  // Titre et description du plugin SEO, avec repli sur le titre et le chapo.
  const base = pageMetadata(`/blog/${post.slug}`, {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  })

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: ['DGL Agency'],
    },
  }
}

/**
 * Article du blog `/blog/[slug]`.
 *
 * Un slug inconnu renvoie vers la liste, comme le faisait le Navigate de
 * l'application Vite.
 */
export default async function BlogPostPage({ params }: ArticleParams) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) redirect('/blog')

  const related = await getRelated(post.slug, 3)

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.seoDescription || post.excerpt,
          url: `/blog/${post.slug}`,
          publishedAt: post.date,
          updatedAt: post.updatedAt,
        })}
      />
      <BlogPostView post={post} related={related} />
    </>
  )
}
