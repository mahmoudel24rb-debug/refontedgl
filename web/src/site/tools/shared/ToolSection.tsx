import type { ReactNode } from 'react'

import Container from '../../ui/Container'
import { CARD_SHEEN } from './ToolShell'

/**
 * Section de contenu d'une page outil : pastille (tag), titre avec une
 * portion en corail, description, puis contenu libre. Equivalent du
 * `.dgl-ps-section-header` WordPress, en deux fonds : clair (page creme)
 * ou navy (grande carte sombre).
 */

export type ToolTagTone = 'green' | 'dark' | 'coral'

/** Titre de section : texte simple, ou texte coupe par une portion corail. */
export type ToolSectionTitle =
  | string
  | { before?: string; highlight: string; after?: string }

export interface ToolSectionProps {
  id?: string
  tag?: string
  tagTone?: ToolTagTone
  title: ToolSectionTitle
  desc?: string
  tone?: 'light' | 'navy'
  /** Niveau du titre : h2 par defaut. */
  as?: 'h2' | 'h3'
  children?: ReactNode
}

/** Classes de la pastille selon sa tonalite. */
const TAG_CLASSES: Record<ToolTagTone, string> = {
  coral: 'bg-primary/10 text-primary',
  green: 'bg-[#0cce6b]/12 text-[#0a8f4c]',
  dark: 'bg-white/10 text-primary',
}

function Titre({
  title,
  tone,
  as = 'h2',
}: {
  title: ToolSectionTitle
  tone: 'light' | 'navy'
  as?: 'h2' | 'h3'
}) {
  const Balise = as
  const classes = `-tracking-xl text-3xl leading-[1.12] font-medium text-balance md:text-4xl ${
    tone === 'navy' ? 'text-white' : 'text-ink'
  }`

  if (typeof title === 'string') {
    return <Balise className={classes}>{title}</Balise>
  }

  return (
    <Balise className={classes}>
      {title.before}
      <span className="text-primary">{title.highlight}</span>
      {title.after}
    </Balise>
  )
}

export default function ToolSection({
  id,
  tag,
  tagTone = 'coral',
  title,
  desc,
  tone = 'light',
  as,
  children,
}: ToolSectionProps) {
  const entete = (
    <>
      {tag ? (
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${TAG_CLASSES[tagTone]}`}
        >
          {tag}
        </span>
      ) : null}
      <div className={tag ? 'mt-4' : undefined}>
        <Titre title={title} tone={tone} as={as} />
      </div>
      {desc ? (
        <p
          className={`mt-3 max-w-3xl text-base leading-7 ${
            tone === 'navy' ? 'text-white/60' : 'text-muted'
          }`}
        >
          {desc}
        </p>
      ) : null}
    </>
  )

  if (tone === 'navy') {
    return (
      <section id={id} className="w-full py-10 md:py-14">
        <Container>
          <div className="bg-ink relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: CARD_SHEEN }}
            />
            <div className="relative">
              {entete}
              {children ? <div className="mt-10">{children}</div> : null}
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id={id} className="w-full py-10 md:py-14">
      <Container>
        {entete}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  )
}
