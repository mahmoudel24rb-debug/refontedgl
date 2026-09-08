import type { ReactNode } from 'react'
import { ArrowUp, Globe, Sparkles } from 'lucide-react'
import Container from '../ui/Container'
import { TOOLS_PAGE } from '../content'

/**
 * Hero de la page Outils : pastille, titre centre, grande carte navy
 * contenant un faux formulaire (la carte entiere ouvre le test de
 * visibilite IA) puis la liste des IA suivies en logos typographiques.
 */

/* Voile clair dans le coin superieur droit de la carte navy. */
const CARD_SHEEN =
  'radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 68%)'

/* Une forme geometrique differente devant chaque nom d'IA. */
function Asterisk() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  )
}

function Infinity8() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 8.5a3.5 3.5 0 1 0 0 7c2.2 0 3.3-1.75 5-3.5 1.7-1.75 2.8-3.5 5-3.5a3.5 3.5 0 1 1 0 7c-2.2 0-3.3-1.75-5-3.5-1.7-1.75-2.8-3.5-5-3.5Z" />
    </svg>
  )
}

function Ring() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

function Sparkle4() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c.6 5.1 4.3 8.8 9.4 9.4v1.2C16.3 13.2 12.6 16.9 12 22h-1.2C10.2 16.9 6.5 13.2 1.4 12.6v-1.2C6.5 10.8 10.2 7.1 10.8 2H12Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Diamond() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 9 9-9 9-9-9 9-9Z" />
    </svg>
  )
}

const AI_SHAPES: ReactNode[] = [
  <Asterisk key="asterisk" />,
  <Infinity8 key="infinity" />,
  <Ring key="ring" />,
  <Sparkle4 key="sparkle" />,
  <Diamond key="diamond" />,
]

export default function ToolsHero() {
  const { pill, title, form, eyebrow, ai } = TOOLS_PAGE

  return (
    <section className="w-full py-10">
      <Container>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white p-1 shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]">
            <span className="bg-ink rounded-full px-2 py-1 text-xs font-medium text-white">
              {pill.tag}
            </span>
            <span className="text-ink pr-2 text-xs">{pill.text}</span>
          </span>
        </div>

        <h2 className="-tracking-xl text-ink mt-6 text-center text-5xl leading-[1.05] font-medium text-balance md:text-6xl">
          {title}
        </h2>

        <a
          href={form.href}
          target="_blank"
          rel="noopener"
          aria-label={form.submitLabel ?? title}
          className="bg-ink relative mx-auto mt-10 block max-w-4xl overflow-hidden rounded-3xl p-3 shadow-[0_24px_48px_-28px_rgba(0,21,25,0.65)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: CARD_SHEEN }}
          />
          <div className="relative flex items-center gap-2 px-2 py-2 text-sm text-white/70">
            <Sparkles size={16} aria-hidden="true" className="shrink-0" />
            {form.hint}
          </div>

          <div className="relative rounded-2xl bg-white p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {form.fields.map((field) => (
                <input
                  key={field}
                  type="text"
                  readOnly
                  tabIndex={-1}
                  aria-hidden="true"
                  placeholder={field}
                  className="border-ink/10 text-ink placeholder:text-muted pointer-events-none w-full rounded-lg border px-3 py-2 text-sm"
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              {form.chip ? (
                <span className="bg-ink/5 text-muted inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
                  <Globe size={14} aria-hidden="true" className="shrink-0" />
                  {form.chip}
                </span>
              ) : (
                <span />
              )}
              <span className="bg-ink flex size-9 shrink-0 items-center justify-center rounded-full text-white">
                <ArrowUp size={18} aria-hidden="true" />
              </span>
            </div>
          </div>
        </a>

        <p className="text-muted -tracking-xs mt-14 text-center font-mono text-sm leading-4 uppercase">
          {eyebrow}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {ai.map((name, index) => (
            <span
              key={name}
              className="text-ink/70 flex items-center gap-2 text-xl font-semibold"
            >
              {AI_SHAPES[index % AI_SHAPES.length]}
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
