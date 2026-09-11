import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo'
import Outils from '@/site/pages/Outils'

export const metadata: Metadata = pageMetadata('/outils')

/**
 * Page des outils gratuits.
 *
 * Le hero pointe encore vers le test de visibilite IA WordPress : les
 * pages internes arrivent avec les lots 4 et suivants.
 */
export default function OutilsPage() {
  return <Outils />
}
