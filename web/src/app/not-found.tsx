import type { Metadata } from 'next'
import Link from 'next/link'

import { dmMono, interTight } from '@/app/fonts'
import { SITE_URL } from '@/lib/seo'
import { DGL } from '@/site/tokens'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Page introuvable | DGL Agency',
  description: "La page demandée n'existe pas ou a été déplacée.",
  robots: { index: false, follow: false },
}

/**
 * 404 racine du projet.
 *
 * Avec plusieurs layouts racines (un par groupe de routes), Next ne sait
 * pas lequel appliquer aux adresses hors groupe : sans ce fichier, il
 * affiche sa propre page d'erreur. Cette page fournit donc son <html> et
 * son <body>, dans la charte creme et navy.
 */
export default function NotFound() {
  return (
    <html lang="fr" className={`${interTight.variable} ${dmMono.variable}`}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: DGL.cream,
          color: DGL.ink,
          fontFamily:
            'var(--font-inter-tight), "Inter Tight", ui-sans-serif, system-ui, sans-serif',
          padding: 'clamp(1.5rem, 6vw, 4rem)',
        }}
      >
        <main style={{ maxWidth: '40rem', width: '100%' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: DGL.primary,
            }}
          >
            Erreur 404
          </p>
          <h1
            style={{
              margin: '1rem 0 0',
              fontSize: 'clamp(2.25rem, 6vw, 3.25rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            Cette page n&apos;existe pas
          </h1>
          <p
            style={{
              margin: '1.25rem 0 0',
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'rgba(0, 35, 41, 0.65)',
            }}
          >
            Le lien est peut-être obsolète ou l&apos;adresse a été modifiée.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '999px',
              background: DGL.ink,
              color: DGL.white,
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </main>
      </body>
    </html>
  )
}
