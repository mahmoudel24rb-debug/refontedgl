import PageLayout from '../layout/PageLayout'
import Container from '../ui/Container'
import SectionHeader from '../ui/SectionHeader'
import BlogCard from '../blog/BlogCard'
import type { BlogPost } from '../blog/posts'

/**
 * Liste des articles : grille de cartes fidele au template.
 * Composant serveur : les articles sont lus par la page App Router.
 */
export default function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <PageLayout tone="light">
      <section className="w-full py-8 pb-24">
        <Container>
          <SectionHeader
            title="Blog"
            right={
              <p className="text-muted max-w-md text-base md:text-right">
                {posts.length} articles sur le SEO, la publicité digitale et
                l&apos;acquisition
              </p>
            }
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  )
}
