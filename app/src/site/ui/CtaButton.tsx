import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * CTA du site : capsule "shiny" a bordure conique animee, motif de points et
 * shimmer interieur (CSS global .shiny-cta dans src/index.css, composant de
 * reference src/components/ui/shiny-button.tsx). Rendu sur un Link ou un <a>
 * selon la cible, jamais sur un <button>.
 */

export type ButtonTone = 'dark' | 'light'

type ButtonSize = 'md' | 'sm'

interface CtaButtonProps {
  label: string
  href: string
  tone?: ButtonTone
  size?: ButtonSize
  className?: string
  onClick?: () => void
}

export default function CtaButton({
  label,
  href,
  tone = 'dark',
  size = 'md',
  className = '',
  onClick,
}: CtaButtonProps) {
  const classes = `shiny-cta${tone === 'light' ? ' shiny-cta--light' : ''}${
    size === 'sm' ? ' shiny-cta--sm' : ''
  }${className ? ` ${className}` : ''}`

  const content = (
    <span>
      {label}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </span>
  )

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {content}
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
      {content}
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
