'use client'

import type { ReactNode } from 'react'

/**
 * Contenu verrouille d'un outil : le rapport reste floute et inerte
 * (classe globale `.dgl-gate`) tant que le visiteur n'a pas laisse ses
 * coordonnees. La carte de deblocage est posee par dessus, collante en
 * haut de la zone comme sur WordPress.
 */
export interface GatedContentProps {
  /** true quand le contenu est lisible. */
  unlocked: boolean
  /** Carte affichee par dessus le contenu verrouille. */
  overlay: ReactNode
  children: ReactNode
}

export default function GatedContent({
  unlocked,
  overlay,
  children,
}: GatedContentProps) {
  return (
    <div className="relative">
      <div
        className={`dgl-gate${unlocked ? ' dgl-gate--open' : ''}`}
        aria-hidden={unlocked ? undefined : true}
        inert={unlocked ? undefined : true}
      >
        {children}
      </div>

      {unlocked ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center p-6 md:p-12">
          <div className="pointer-events-auto sticky top-[70px] w-full max-w-md">
            {overlay}
          </div>
        </div>
      )}
    </div>
  )
}
