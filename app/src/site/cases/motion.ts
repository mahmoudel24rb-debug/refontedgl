import { useReducedMotion, type MotionProps } from 'framer-motion'

/**
 * Animations d'entree des pages cas client : une seule fabrique de props
 * framer-motion, declenchee a l'entree dans le viewport et jouee une fois.
 * En `prefers-reduced-motion`, l'etat initial est deja l'etat final : rien
 * ne bouge.
 */

export const VIEWPORT = { once: true, amount: 0.3 } as const

const REST = { opacity: 1, y: 0 }

export function useFadeUp(): (delay?: number) => MotionProps {
  const reduced = Boolean(useReducedMotion())

  return (delay = 0) => ({
    initial: reduced ? REST : { opacity: 0, y: 16 },
    whileInView: REST,
    viewport: VIEWPORT,
    transition: {
      duration: reduced ? 0 : 0.5,
      delay: reduced ? 0 : delay,
      ease: 'easeOut',
    },
  })
}

/** Barre de progression des tableaux de positions (largeur = part). */
export function useGrowBar(): (share: string, delay?: number) => MotionProps {
  const reduced = Boolean(useReducedMotion())

  return (share, delay = 0) => ({
    initial: { width: reduced ? share : '0%' },
    whileInView: { width: share },
    viewport: VIEWPORT,
    transition: {
      duration: reduced ? 0 : 0.9,
      delay: reduced ? 0 : delay,
      ease: 'easeOut',
    },
  })
}
