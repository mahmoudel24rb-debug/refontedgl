import { Link } from 'react-router-dom'

/**
 * CTA du site : capsule a bordure conique qui tourne au survol (beam), posee
 * sur une surface degradee avec un lisere interieur. Rendu sur un Link ou un
 * <a> selon la cible, jamais sur un <button>.
 */

export type ButtonTone = 'dark' | 'light'

interface CtaButtonProps {
  label: string
  href: string
  tone?: ButtonTone
  className?: string
  onClick?: () => void
}

/* Degrade conique du faisceau : blanc sur fond navy, corail sur fond clair. */
const BEAM = {
  dark: 'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ffffff_100%)]',
  light:
    'bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#FE5752_100%)]',
} as const

/* Ombre portee au survol, accordee au ton. */
const GLOW = {
  dark: 'hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]',
  light: 'hover:shadow-[0_0_25px_rgba(254,87,82,0.25)]',
} as const

/* Bordure statique visible hors survol. */
const BORDER = {
  dark: 'bg-white/20',
  light: 'bg-ink/15',
} as const

/* Surface du bouton : degrade, couleur de texte et lisere interieur. */
const SURFACE = {
  dark: 'bg-gradient-to-b from-ink to-ink-deep text-white/80 group-hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
  light:
    'bg-gradient-to-b from-white to-page text-ink/80 group-hover:text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
} as const

function CtaButtonInner({ label, tone }: { label: string; tone: ButtonTone }) {
  return (
    <>
      {/* Faisceau conique en rotation, revele au survol */}
      <span
        className={`absolute inset-[-100%] animate-[spin_3s_linear_infinite] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${BEAM[tone]}`}
      />

      {/* Bordure statique par defaut */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-0 ${BORDER[tone]}`}
      />

      {/* Surface et contenu */}
      <span
        className={`relative flex h-full w-full items-center justify-center gap-2 rounded-full pt-2.5 pr-6 pb-2.5 pl-6 text-xs font-medium tracking-widest whitespace-nowrap uppercase transition-colors duration-300 ${SURFACE[tone]}`}
      >
        <span className="relative z-10">{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </>
  )
}

export default function CtaButton({
  label,
  href,
  tone = 'dark',
  className = '',
  onClick,
}: CtaButtonProps) {
  const classes = `group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-full pt-[1px] pr-[1px] pb-[1px] pl-[1px] transition-all duration-300 hover:-translate-y-0.5 ${GLOW[tone]}${
    className ? ` ${className}` : ''
  }`

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        <CtaButtonInner label={label} tone={tone} />
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        <CtaButtonInner label={label} tone={tone} />
      </a>
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
      <CtaButtonInner label={label} tone={tone} />
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
