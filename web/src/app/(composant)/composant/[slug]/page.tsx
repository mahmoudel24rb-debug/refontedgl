import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { COMPOSANT_ENTRIES, getComposant } from '@/composant/entries'
import ComposantView from '@/composant/pages/ComposantView'

/** Parametres de route, promis depuis Next 15. */
interface ComposantParams {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: 'Prototype',
  description: 'Prototype interne, hors index.',
  robots: { index: false, follow: false },
}

/** Les prototypes sont connus a la compilation. */
export function generateStaticParams(): { slug: string }[] {
  return COMPOSANT_ENTRIES.map((entry) => ({ slug: entry.slug }))
}

/** Demo isolee d'un prototype, hors index. */
export default async function ComposantViewPage({ params }: ComposantParams) {
  const { slug } = await params
  if (!getComposant(slug)) notFound()

  return <ComposantView slug={slug} />
}
