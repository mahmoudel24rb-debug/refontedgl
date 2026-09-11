import type { Metadata } from 'next'

import ComposantIndex from '@/composant/pages/ComposantIndex'

export const metadata: Metadata = {
  title: 'Archive des composants',
  description: 'Prototypes internes, hors index.',
  robots: { index: false, follow: false },
}

/** Index de l'archive des prototypes. */
export default function ComposantIndexPage() {
  return <ComposantIndex />
}
