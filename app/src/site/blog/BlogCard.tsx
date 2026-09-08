import { Link } from 'react-router-dom'
import BlogCover from './BlogCover'
import type { BlogPost } from './posts'

/**
 * Carte d'article du template : bordure fine, couverture arrondie, titre,
 * extrait, ligne basse (« Lire l'article » + temps de lecture). Au survol la
 * carte passe en navy et le texte en blanc.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="border-ink/10 hover:bg-ink group flex flex-col gap-4 rounded-3xl border px-3 pt-3 pb-8 transition-colors"
    >
      <BlogCover
        title={post.title}
        slug={post.slug}
        category={post.categories[0]}
      />
      <h3 className="text-ink px-3 text-2xl leading-tight font-medium text-balance group-hover:text-white">
        {post.title}
      </h3>
      <p className="text-muted px-3 text-base leading-6 group-hover:text-white/70">
        {post.excerpt}
      </p>
      <div className="text-ink mt-auto flex items-center justify-between gap-3 px-3 text-sm group-hover:text-white">
        <span className="underline underline-offset-4">Lire l'article</span>
        <span className="text-muted group-hover:text-white/70">
          {post.readingMinutes} min de lecture
        </span>
      </div>
    </Link>
  )
}
