'use client'

import { useSyncExternalStore } from 'react'

/**
 * Remplacant de `useReducedMotion` de framer-motion, sur du rendu serveur.
 *
 * La version de framer lit la preference des le premier rendu client : sur
 * un serveur elle vaut toujours false, et le premier rendu du navigateur
 * renvoie true chez les personnes qui limitent les animations. Les deux
 * arbres different alors et React casse l'hydratation.
 *
 * useSyncExternalStore resout le probleme : React hydrate avec l'instantane
 * serveur (false, identique au HTML), puis relit la preference reelle juste
 * apres. Les transitions passent alors en duree nulle et les boucles
 * infinies s'arretent, sans animation visible entre les deux rendus.
 */

const REQUETE = '(prefers-reduced-motion: reduce)'

function souscrire(rappel: () => void): () => void {
  const media = window.matchMedia(REQUETE)
  media.addEventListener('change', rappel)
  return () => media.removeEventListener('change', rappel)
}

function etatClient(): boolean {
  return window.matchMedia(REQUETE).matches
}

function etatServeur(): boolean {
  return false
}

/** true quand la personne demande de limiter les animations. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(souscrire, etatClient, etatServeur)
}

export default useReducedMotion
