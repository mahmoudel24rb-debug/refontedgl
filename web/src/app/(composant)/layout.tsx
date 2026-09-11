import type { Metadata } from 'next'
import React from 'react'

import { SITE_URL } from '@/lib/seo'

import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Archive des composants',
  description: 'Prototypes internes, hors index.',
  robots: { index: false, follow: false },
}

/**
 * Layout racine de l'archive des prototypes.
 *
 * Fond sombre historique : la classe site-theme n'est pas posee sur
 * body, contrairement au site public.
 */
export default function ComposantLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ background: '#0a0a0a' }}>{children}</body>
    </html>
  )
}
