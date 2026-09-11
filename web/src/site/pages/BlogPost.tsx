import PageLayout from '../layout/PageLayout'
import Container from '../ui/Container'
import SectionHeader from '../ui/SectionHeader'
import CtaButton from '../ui/CtaButton'
import BlogCard from '../blog/BlogCard'
import BlogCover from '../blog/BlogCover'
import BlogProse from '../blog/BlogProse'
import BlogToc from '../blog/BlogToc'
import ScrollToArticle from '../blog/ScrollToArticle'
import type { BlogPost as Post } from '../blog/posts'
import { htmlToText } from '@/lib/html'
import { CTA, FAQ_CTA } from '../content'
import { LOGO_DGL } from '../tokens'

/** Detache le premier paragraphe (chapo) du corps de l'article. */
function splitIntro(html: string): { intro: string; body: string } {
  const match = /^<p>([\s\S]*?)<\/p>/.exec(html)
  if (!match) return { intro: '', body: html }
  return { intro: htmlToText(match[1]), body: html.slice(match[0].length) }
}

/** Article affiche et suggestions de lecture, resolus par la page. */
interface BlogPostProps {
  post: Post
  related: Post[]
}

/**
 * Page article : header, chapo, sommaire + CTA, corps, articles lies.
 * Composant serveur : l'article est resolu par la page App Router, qui
 * pose aussi les metadonnees et le JSON-LD Article.
 */
export default function BlogPost({ post, related }: BlogPostProps) {
  const { intro, body } = splitIntro(post.contentHtml)

  return (
    <PageLayout tone="light">
      {/* En-tete : meta + titre a gauche, couverture a droite */}
      <section className="w-full py-8">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-muted text-sm">
                {post.dateLabel}
                <span className="px-2">·</span>
                {post.readingMinutes} min de lecture
              </p>

              {post.categories.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {post.categories.map((name) => (
                    <li
                      key={name}
                      className="bg-ink/5 text-ink rounded-lg px-3 py-1.5 text-sm"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              ) : null}

              <h1 className="-tracking-xl text-ink text-4xl leading-tight font-medium text-balance md:text-5xl">
                {post.title}
              </h1>

              <p className="text-muted text-lg">{post.excerpt}</p>

              <div className="mt-2 flex items-center gap-3">
                <span className="bg-ink flex size-8 shrink-0 items-center justify-center rounded-full">
                  <img
                    src={LOGO_DGL}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-auto object-contain"
                  />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-ink text-sm font-semibold">
                    DGL Agency
                  </span>
                  <span className="text-muted text-xs">
                    Agence digitale à Tours
                  </span>
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl">
              <BlogCover
                title={post.title}
                slug={post.slug}
                category={post.categories[0]}
                size="hero"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Chapo centre */}
      {intro ? (
        <section className="w-full">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 py-16">
              <p className="text-ink text-2xl leading-snug font-medium text-balance md:text-3xl">
                {intro}
              </p>
              <ScrollToArticle>
                <CtaButton label="Commencer la lecture" href="#article" />
              </ScrollToArticle>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Corps : sommaire + CTA a gauche, article a droite */}
      <section className="w-full pb-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <aside className="flex min-w-0 flex-col gap-8 self-start lg:sticky lg:top-28">
              <BlogToc items={post.toc} />
              <div className="rounded-3xl bg-white p-6 shadow-md">
                <h2 className="text-ink text-xl leading-tight font-semibold text-balance">
                  {FAQ_CTA.title}
                </h2>
                <p className="text-muted mt-3 text-sm">{FAQ_CTA.text}</p>
                <CtaButton
                  label={CTA.label}
                  href={CTA.href}
                  className="mt-5"
                />
              </div>
            </aside>

            <div id="article" className="scroll-mt-24 min-w-0">
              <BlogProse html={body} />
            </div>
          </div>
        </Container>
      </section>

      {/* Articles lies */}
      {related.length > 0 ? (
        <section className="w-full pb-24">
          <Container>
            <SectionHeader title="À lire aussi" />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </PageLayout>
  )
}
