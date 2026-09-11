'use client'

import type { TargetAndTransition } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Hauteur minimale commune aux cartes de droite du bento services. */
export const BOX = 'min-h-[var(--box-min-height)]'

/** Declencheur commun des animations d'entree du bento (template). */
export const VIEWPORT = { once: true, amount: 0.3 }

/**
 * Etats d'entree respectant `prefers-reduced-motion` : quand l'utilisateur
 * limite les animations, l'etat initial est directement l'etat final et rien
 * ne bouge. `reduced` sert aussi a couper les boucles infinies.
 */
export function useEnter() {
  const reduced = Boolean(useReducedMotion())
  return {
    reduced,
    from: (initial: TargetAndTransition, target: TargetAndTransition) =>
      reduced ? target : initial,
  }
}
