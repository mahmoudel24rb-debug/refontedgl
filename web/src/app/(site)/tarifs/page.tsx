import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo'
import Tarifs from '@/site/pages/Tarifs'

export const metadata: Metadata = pageMetadata('/tarifs')

/** Page tarifs : packs, comparatif, engagements et FAQ. */
export default function TarifsPage() {
  return <Tarifs />
}
