import type React from "react"

/**
 * Bouton "shiny" : capsule a bordure conique animee, points et shimmer.
 * Le CSS vit dans src/index.css (classes .shiny-cta, .shiny-cta--light,
 * .shiny-cta--sm) car styled-jsx n'existe pas sous Vite.
 */

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}
