import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { JsonLd, articleJsonLd, pageMetadata } from '@/lib/seo'
import CaseStudyView from '@/site/cases/CaseStudyView'
import PageLayout from '@/site/layout/PageLayout'
import Faq from '@/site/sections/Faq'
import { CASES, getCase } from '@/site/data/cases'

/** Parametres de route, promis depuis Next 15. */
interface CaseParams {
  params: Promise<{ slug: string }>
}

/** Les 6 fiches sont connues a la compilation : rendu statique. */
export function generateStaticParams(): { slug: string }[] {
  return CASES.map((etude) => ({ slug: etude.slug }))
}

export async function generateMetadata({ params }: CaseParams): Promise<Metadata> {
  const { slug } = await params
  const etude = getCase(slug)
  if (!etude) return { title: 'Réalisations', robots: { index: false, follow: false } }

  return pageMetadata(`/realisations/${etude.slug}`, {
    title: etude.seoTitle,
    description: etude.seoDescription,
  })
}

/**
 * Fiche cas client `/realisations/[slug]`.
 *
 * Un slug inconnu renvoie vers la liste des realisations, comme le faisait
 * le Navigate de l'application Vite.
 */
export default async function CaseStudyPage({ params }: CaseParams) {
  const { slug } = await params
  const etude = getCase(slug)
  if (!etude) redirect('/realisations')

  return (
    <PageLayout tone="light">
      <JsonLd
        data={{
          ...articleJsonLd({
            title: etude.headline,
            description: etude.seoDescription,
            url: `/realisations/${etude.slug}`,
          }),
          about: etude.client,
        }}
      />
      <CaseStudyView study={etude} />
      <Faq />
    </PageLayout>
  )
}
