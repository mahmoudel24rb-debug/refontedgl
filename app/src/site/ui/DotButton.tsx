import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CTA } from '../content'

/**
 * CTA signature du template : carre primaire avec une matrice 5x5 de points
 * (fleche), qui glisse a droite au survol et laisse place a l'avatar, pendant
 * qu'un voile balaie le bouton et que le texte se decale.
 */

export type ButtonTone = 'dark' | 'light'

interface DotButtonProps {
  label: string
  href: string
  avatar?: string
  tone?: ButtonTone
  className?: string
  onClick?: () => void
}

/* Points allumes de la matrice : la fleche vers la droite. */
const ARROW_DOTS: number[][] = [[2], [3], [0, 1, 2, 3, 4], [3], [2]]

function DotMatrix() {
  return (
    <div className="flex flex-col gap-px group-hover:hidden">
      {ARROW_DOTS.map((row, y) => (
        <div key={y} className="flex gap-px">
          {[0, 1, 2, 3, 4].map((x) => (
            <span
              key={x}
              className={`inline-block size-0.75 shrink-0 rounded-full duration-200 ease-linear ${
                row.includes(x) ? 'bg-white' : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function DotButtonInner({
  label,
  avatar,
  tone,
}: {
  label: string
  avatar: string
  tone: ButtonTone
}): ReactNode {
  return (
    <>
      <span className="bg-primary absolute inset-y-0 left-1 z-40 my-auto flex size-8 flex-col items-center justify-center gap-px overflow-hidden rounded-[5px] transition-[left] duration-400 ease-out group-hover:left-[calc(100%-2.3rem)]">
        <DotMatrix />
        <img
          src={avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={32}
          height={32}
          className="hidden size-8 rotate-180 rounded-[5px] object-cover blur-sm transition-all duration-400 ease-out group-hover:block group-hover:rotate-0 group-hover:blur-none"
        />
      </span>
      <span
        className={`pointer-events-none absolute -inset-px rounded-lg transition-[clip-path] duration-400 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] ${
          tone === 'light' ? 'bg-ink/10' : 'bg-white/20'
        }`}
      />
      <span className="relative z-30 inline-block transition-transform duration-400 group-hover:-translate-x-8">
        {label}
      </span>
    </>
  )
}

export default function DotButton({
  label,
  href,
  avatar = CTA.avatar,
  tone = 'dark',
  className = '',
  onClick,
}: DotButtonProps) {
  const base =
    'group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-lg border py-2 pr-4 pl-11 text-sm font-medium'
  const skin =
    tone === 'light'
      ? 'border-ink/15 bg-white text-ink'
      : 'border-white/20 bg-ink text-white'
  const classes = `${base} ${skin}${className ? ` ${className}` : ''}`

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        <DotButtonInner label={label} avatar={avatar} tone={tone} />
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={classes}
      onClick={onClick}
    >
      <DotButtonInner label={label} avatar={avatar} tone={tone} />
    </a>
  )
}

/**
 * Bouton rond blanc a fleche (carte CTA du footer).
 */
export function ArrowButton({
  href,
  label,
  className = '',
}: {
  href: string
  label: string
  className?: string
}) {
  const classes = `inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-ink shadow-[0_2px_6px_0_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-0.5${
    className ? ` ${className}` : ''
  }`
  const icon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} aria-label={label}>
        {icon}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={classes}
      aria-label={label}
    >
      {icon}
    </a>
  )
}
