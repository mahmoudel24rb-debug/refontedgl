import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'

import { dmMono, interTight } from '@/app/fonts'
import React from 'react'

import {
  DEFAULT_META,
  JsonLd,
  NOINDEX,
  OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  localBusinessJsonLd,
} from '@/lib/seo'
import MotionProvider from '@/site/layout/MotionProvider'

import '../globals.css'

/** Identifiant du conteneur GTM, absent tant que le suivi n'est pas branche. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_META.title,
    template: '%s | DGL Agency',
  },
  description: DEFAULT_META.description,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DGL Agency',
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    url: SITE_URL,
    images: [
      {
        url: absoluteUrl(OG_IMAGE.path),
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  // Tant que le site vit sur un domaine provisoire, il reste hors index.
  robots: NOINDEX ? { index: false, follow: false } : undefined,
}

/** Layout racine du site public : theme clair, polices, JSON-LD, GTM. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${interTight.variable} ${dmMono.variable}`}>
      <body className="site-theme">
        <MotionProvider>{children}</MotionProvider>
        <JsonLd data={localBusinessJsonLd()} />
      </body>
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
    </html>
  )
}
