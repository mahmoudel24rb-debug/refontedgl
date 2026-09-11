import Link from 'next/link'
import type { ReactElement } from 'react'

/**
 * Fragment de texte enrichi : une chaine simple, ou une chaine porteuse
 * d'un lien. Les textes des outils vivent dans des fichiers texts.ts et
 * ont parfois besoin d'un lien au milieu d'un paragraphe.
 */
export type RichSegment = string | { text: string; href: string }

/** Version texte brut d'une suite de fragments (JSON-LD, attributs). */
export function plainText(segments: RichSegment[]): string {
  return segments
    .map((segment) => (typeof segment === 'string' ? segment : segment.text))
    .join('')
}

/** true quand le lien pointe vers une page du site. */
function estInterne(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#')
}

/**
 * Rend une suite de fragments : les liens internes passent par next/link,
 * les liens externes s'ouvrent dans un nouvel onglet.
 */
export function RichText({ segments }: { segments: RichSegment[] }): ReactElement {
  return (
    <>
      {segments.map((segment, index) => {
        if (typeof segment === 'string') {
          return <span key={`t-${index}`}>{segment}</span>
        }
        const classes =
          'text-primary font-medium underline underline-offset-4 hover:opacity-80'
        if (estInterne(segment.href)) {
          return (
            <Link key={`l-${index}`} href={segment.href} className={classes}>
              {segment.text}
            </Link>
          )
        }
        return (
          <a
            key={`l-${index}`}
            href={segment.href}
            target="_blank"
            rel="noopener"
            className={classes}
          >
            {segment.text}
          </a>
        )
      })}
    </>
  )
}

export default RichText
