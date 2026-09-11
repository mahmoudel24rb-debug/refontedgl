import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo'
import Realisations from '@/site/pages/Realisations'

export const metadata: Metadata = pageMetadata('/realisations')

/** Liste des realisations : masonry des 6 cas clients. */
export default function RealisationsPage() {
  return <Realisations />
}
