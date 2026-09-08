/**
 * Corps d'article : le HTML nettoye du snapshot WordPress, rendu avec la
 * typographie du template (styles portes par `.dgl-prose`, aucun plugin
 * typography).
 */

const PROSE_CSS = `
.dgl-prose {
  color: var(--color-ink);
  font-size: 1rem;
  line-height: 1.75rem;
}
.dgl-prose > *:first-child { margin-top: 0; }
.dgl-prose p { margin-top: 1.5rem; line-height: 1.75rem; }
.dgl-prose h2 {
  margin-top: 3rem;
  scroll-margin-top: 5rem;
  padding-top: 3rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid rgba(0, 35, 41, 0.1);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.dgl-prose > h2:first-child { margin-top: 0; padding-top: 0; border-top: 0; }
.dgl-prose h3 {
  margin-top: 2rem;
  scroll-margin-top: 5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}
.dgl-prose h4 { margin-top: 1.5rem; font-size: 1.0625rem; font-weight: 600; }
.dgl-prose ul, .dgl-prose ol { margin: 1.5rem 0; padding-left: 1.5rem; }
.dgl-prose ul { list-style: disc; }
.dgl-prose ol { list-style: decimal; }
.dgl-prose li { margin-top: 0.5rem; }
.dgl-prose li::marker { color: rgba(0, 35, 41, 0.45); }
.dgl-prose blockquote {
  margin-top: 1.5rem;
  border-left: 2px solid rgba(0, 35, 41, 0.1);
  padding-left: 1.5rem;
  font-style: italic;
}
.dgl-prose blockquote p:first-child { margin-top: 0; }
.dgl-prose a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.dgl-prose a:hover { color: var(--color-primary-hover); }
.dgl-prose strong { font-weight: 600; }
.dgl-prose em { font-style: italic; }
.dgl-prose aside {
  margin: 2rem 0;
  border-radius: 0.75rem;
  border-left: 4px solid var(--color-primary);
  background: #ffffff;
  padding: 1.25rem 1.5rem;
}
.dgl-prose aside > *:first-child { margin-top: 0; }
.dgl-prose aside h2 {
  margin: 0 0 0.5rem;
  padding: 0;
  border: 0;
  font-size: 1.125rem;
  line-height: 1.5rem;
}
.dgl-prose aside p { margin-top: 0.75rem; font-size: 0.9375rem; }
.dgl-prose aside ul { margin: 0.75rem 0; font-size: 0.9375rem; }
.dgl-prose details {
  margin: 0.75rem 0;
  border: 1px solid rgba(0, 35, 41, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.75rem 1rem;
}
.dgl-prose details[open] { background: #ffffff; }
.dgl-prose summary { font-weight: 500; cursor: pointer; }
.dgl-prose details p { margin-top: 0.75rem; font-size: 0.9375rem; }
.dgl-prose figure { margin: 2rem 0; overflow-x: auto; }
.dgl-prose table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
  text-align: left;
}
.dgl-prose :not(figure) > table { display: block; overflow-x: auto; }
.dgl-prose th, .dgl-prose td {
  border: 1px solid rgba(0, 35, 41, 0.12);
  padding: 0.625rem 0.875rem;
  vertical-align: top;
}
.dgl-prose th { background: rgba(0, 35, 41, 0.04); font-weight: 600; }
.dgl-prose img { border-radius: 0.75rem; max-width: 100%; height: auto; }
.dgl-prose hr { margin: 2.5rem 0; border: 0; border-top: 1px solid rgba(0, 35, 41, 0.1); }
`

export default function BlogProse({ html }: { html: string }) {
  return (
    <>
      <style>{PROSE_CSS}</style>
      <article
        data-prose
        className="dgl-prose text-ink max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
