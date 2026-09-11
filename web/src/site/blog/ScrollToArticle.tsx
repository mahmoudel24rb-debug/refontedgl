'use client'

import React from 'react'

/**
 * Defilement doux vers le corps de l'article.
 *
 * Enveloppe le CTA « Commencer la lecture » sans embarquer les donnees de
 * l'article : le bouton reste rendu cote serveur et passe en children. Le
 * clic est intercepte a la capture pour remplacer le saut d'ancre par un
 * scrollIntoView, ramene a un saut immediat quand l'utilisateur a demande
 * moins d'animations.
 */
export default function ScrollToArticle({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block"
      onClickCapture={(event) => {
        const cible = document.getElementById('article')
        if (!cible) return
        event.preventDefault()
        const mouvementReduit = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        cible.scrollIntoView({
          behavior: mouvementReduit ? 'auto' : 'smooth',
          block: 'start',
        })
      }}
    >
      {children}
    </span>
  )
}
