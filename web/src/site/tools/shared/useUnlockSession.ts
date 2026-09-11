'use client'

import { useCallback, useSyncExternalStore } from 'react'

/** Etat de deblocage d'un rapport pour la session de navigation. */
export interface UnlockSession {
  /** true quand le rapport est debloque. */
  unlocked: boolean
  /** Marque le rapport comme debloque et le memorise en session. */
  unlock: () => void
  /** true une fois la valeur relue dans sessionStorage (apres hydratation). */
  ready: boolean
}

/** Abonnes a prevenir quand un deblocage est enregistre. */
const abonnes = new Set<() => void>()

function souscrire(rappel: () => void): () => void {
  abonnes.add(rappel)
  return () => {
    abonnes.delete(rappel)
  }
}

function prevenir(): void {
  for (const rappel of abonnes) rappel()
}

/** Deblocages memorises en memoire quand sessionStorage est refuse. */
const memoire = new Set<string>()

/** Lecture protegee de sessionStorage (refusee en navigation privee stricte). */
function lire(key: string): boolean {
  if (memoire.has(key)) return true
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

/** Instantane serveur : le rapport est toujours verrouille dans le HTML. */
function faux(): boolean {
  return false
}

/** Instantane client de l'hydratation. */
function vrai(): boolean {
  return true
}

/**
 * Memorise le deblocage d'un rapport pour toute la session du navigateur.
 *
 * useSyncExternalStore rend le premier rendu client identique au HTML du
 * serveur (verrouille), puis relit sessionStorage juste apres : aucun
 * avertissement d'hydratation et aucun setState dans un effet.
 */
export function useUnlockSession(key: string): UnlockSession {
  const unlocked = useSyncExternalStore(souscrire, () => lire(key), faux)
  const ready = useSyncExternalStore(souscrire, vrai, faux)

  const unlock = useCallback(() => {
    memoire.add(key)
    try {
      window.sessionStorage.setItem(key, '1')
    } catch {
      // Stockage refuse : le deblocage ne survivra pas au rechargement.
    }
    prevenir()
  }, [key])

  return { unlocked, unlock, ready }
}

export default useUnlockSession
