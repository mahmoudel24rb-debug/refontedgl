import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

import Container from '../../ui/Container'

/**
 * Coquille commune des pages outil : pastille, H1, sous-titre puis grande
 * carte navy contenant l'outil. Declinaison exacte du hero de la page
 * Outils (ToolsHero) : carte `bg-ink rounded-3xl p-3` avec voile clair,
 * surfaces blanches `rounded-2xl p-5` a l'interieur.
 */

/** Voile clair dans le coin superieur droit de la carte navy. */
export const CARD_SHEEN =
  'radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 68%)'

export interface ToolShellPill {
  tag: string
  text: string
}

export interface ToolShellProps {
  /** Pastille au dessus du titre (tag corail + texte). */
  pill?: ToolShellPill
  /** Titre principal de la page (H1). */
  title: string
  /** Seconde ligne du titre, en corail. */
  titleHighlight?: string
  /** Accroche sous le titre. */
  subtitle?: string
  /** Seconde ligne de l'accroche, en gras. */
  subtitleStrong?: string
  /** Ligne d'indication a l'interieur de la carte navy. */
  hint?: string
  /** Contenu de la carte navy (surfaces blanches empilees). */
  children: ReactNode
  /**
   * Contenu pose sous la carte navy, dans la meme gouttiere.
   *
   * Sert aux outils dont les resultats sont trop hauts pour tenir dans
   * la carte sombre (simulateur de ROI). Absent, rien n'est rendu.
   */
  below?: ReactNode
}

export default function ToolShell({
  pill,
  title,
  titleHighlight,
  subtitle,
  subtitleStrong,
  hint,
  children,
  below,
}: ToolShellProps) {
  return (
    <section className="w-full py-10">
      <Container>
        {pill ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white p-1 shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]">
              <span className="bg-ink rounded-full px-2 py-1 text-xs font-medium text-white">
                {pill.tag}
              </span>
              <span className="text-ink pr-2 text-xs">{pill.text}</span>
            </span>
          </div>
        ) : null}

        <h1 className="-tracking-xl text-ink mt-6 text-center text-4xl leading-[1.05] font-medium text-balance md:text-5xl lg:text-6xl">
          {title}
          {titleHighlight ? (
            <>
              <br />
              <span className="text-primary">{titleHighlight}</span>
            </>
          ) : null}
        </h1>

        {subtitle ? (
          <p className="text-muted mx-auto mt-5 max-w-2xl text-center text-base leading-7 text-balance">
            {subtitle}
            {subtitleStrong ? (
              <>
                <br />
                <strong className="text-ink font-medium">{subtitleStrong}</strong>
              </>
            ) : null}
          </p>
        ) : null}

        <div className="bg-ink relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl p-3 shadow-[0_24px_48px_-28px_rgba(0,21,25,0.65)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: CARD_SHEEN }}
          />
          {hint ? (
            <div className="relative flex items-center gap-2 px-2 py-2 text-sm text-white/70">
              <Sparkles size={16} aria-hidden="true" className="shrink-0" />
              {hint}
            </div>
          ) : null}
          <div className="relative flex flex-col gap-3">{children}</div>
        </div>

        {below ? <div className="mx-auto mt-6 max-w-5xl">{below}</div> : null}
      </Container>
    </section>
  )
}
