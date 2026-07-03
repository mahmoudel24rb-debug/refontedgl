import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Briques partagées de la page refontev2 : tokens DGL, TextRoll (hover
 * text-roll des CTA), Reveal (entrée au scroll via IntersectionObserver),
 * BadgeRow (numéro de section + pill) et la feuille de style commune.
 */

export const DGL = {
  navy: '#002329',
  navyDeep: '#001519',
  coral: '#fe5752',
  coralHover: '#e54a45',
  cream: '#F0EFE9',
  white: '#ffffff',
} as const

/* Hover text-roll : le texte est doublé verticalement, le parent .group
   translate de -50% au hover. */
export function TextRoll({ children }: { children: ReactNode }) {
  return (
    <span className="v2-text-roll">
      <span className="v2-text-roll-inner">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  )
}

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`v2-reveal${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* Numérotation de sections : encode l'ordre de lecture de la page,
   même langage visuel que le brief Axion (cercle + pill). */
export function BadgeRow({
  num,
  label,
  tone = 'dark',
}: {
  num: string
  label: string
  tone?: 'dark' | 'light'
}) {
  return (
    <div className={`v2-badge-row v2-badge-${tone}`}>
      <span className="v2-badge-num">{num}</span>
      <span className="v2-badge-pill">{label}</span>
    </div>
  )
}

export const BASE_CSS = `
/* ===== Refontev2 — styles partagés ===== */

/* Container */
.v2-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}
@media (min-width: 640px) { .v2-inner { padding: 0 32px; } }
@media (min-width: 1024px) { .v2-inner { padding: 0 48px; } }

/* Titres de section */
.v2-h2 {
  font-size: clamp(1.9rem, 4.6vw, 3.4rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin: 0;
}

/* Badge de section (numéro + pill) */
.v2-badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}
@media (min-width: 640px) { .v2-badge-row { margin-bottom: 36px; } }
.v2-badge-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}
.v2-badge-pill {
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  padding: 5px 14px;
  letter-spacing: 0.01em;
}
@media (min-width: 640px) {
  .v2-badge-num { width: 28px; height: 28px; font-size: 12px; }
  .v2-badge-pill { font-size: 13px; padding: 6px 16px; }
}
.v2-badge-dark .v2-badge-num { background: ${DGL.navy}; color: ${DGL.white}; }
.v2-badge-dark .v2-badge-pill { border: 1px solid rgba(0,35,41,0.18); color: ${DGL.navy}; }
.v2-badge-light .v2-badge-num { background: ${DGL.coral}; color: ${DGL.white}; }
.v2-badge-light .v2-badge-pill { border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.92); }

/* Text roll */
.v2-text-roll {
  display: inline-flex;
  overflow: hidden;
  height: 20px;
  align-items: center;
}
.v2-text-roll-inner {
  display: flex;
  flex-direction: column;
  transition: transform 500ms cubic-bezier(0.25,0.1,0.25,1);
}
.v2-text-roll-inner > span {
  height: 20px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.group:hover .v2-text-roll-inner { transform: translateY(-50%); }

/* CTA primaire coral (pill + flèche qui pivote) */
.v2-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${DGL.coral};
  color: ${DGL.white};
  border: none;
  padding: 2px 2px 2px 20px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: background 300ms;
}
.v2-cta-primary:hover { background: ${DGL.coralHover}; }
@media (min-width: 640px) {
  .v2-cta-primary { padding: 2px 2px 2px 24px; font-size: 14px; }
}
.v2-cta-primary-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${DGL.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 500ms cubic-bezier(0.25,0.1,0.25,1);
}
.v2-cta-primary:hover .v2-cta-primary-arrow { transform: rotate(-45deg); }
@media (min-width: 640px) {
  .v2-cta-primary-arrow { width: 32px; height: 32px; }
}

/* Entrée au scroll */
.v2-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2-reveal.is-in {
  opacity: 1;
  transform: none;
}

/* Accessibilité */
.v2-page a:focus-visible,
.v2-page button:focus-visible {
  outline: 2px solid ${DGL.coral};
  outline-offset: 3px;
  border-radius: 4px;
}
html {
  scroll-behavior: smooth;
}

/* Retours à la ligne desktop-only (partagés entre hero shader et sections) */
.v2-br-desktop { display: none; }
.v2-space-mobile { display: inline; }
@media (min-width: 640px) {
  .v2-br-desktop { display: inline; }
  .v2-space-mobile { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .v2-reveal { opacity: 1; transform: none; transition: none; }
  html { scroll-behavior: auto; }
  .v2-page *, .v2-page *::before, .v2-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`
