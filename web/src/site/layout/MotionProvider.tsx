'use client'

import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Reglage global de framer-motion pour le site public.
 *
 * `reducedMotion="user"` laisse la bibliotheque suivre la preference
 * systeme : les animations de transformation et de mise en page sont
 * coupees pour qui demande a limiter les animations. Les composants
 * completent ce reglage avec le hook maison useReducedMotion, stable a
 * l'hydratation, pour leurs boucles et leurs etats d'entree.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
