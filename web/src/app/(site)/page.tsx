import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo'
import Home from '@/site/pages/Home'

export const metadata: Metadata = pageMetadata('/')

/** Page d'accueil : composition de sections rendue cote serveur. */
export default function AccueilPage() {
  return <Home />
}
