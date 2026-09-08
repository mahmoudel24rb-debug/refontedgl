import { useMemo } from 'react'
import Container from '../ui/Container'
import Accordion from '../ui/Accordion'
import DotButton from '../ui/DotButton'
import SectionHeader from '../ui/SectionHeader'
import { CTA, FAQ, FAQ_CTA, FAQ_HEADING, type FaqItem } from '../content'
import { EMAIL } from '../tokens'

/**
 * FAQ du template : titre et carte CTA a gauche, accordeon a droite.
 * Les questions alimentent aussi un bloc FAQPage pour les resultats
 * enrichis Google.
 */
export default function Faq({ items = FAQ }: { items?: FaqItem[] }) {
  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }),
    [items],
  )

  const accordionItems = useMemo(
    () =>
      items.map((item, index) => ({
        id: `faq-${index}`,
        title: item.q,
        content: item.a,
      })),
    [items],
  )

  return (
    <section id="faq" className="w-full py-16 md:py-24">
      <script type="application/ld+json">{jsonLd}</script>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeader title={FAQ_HEADING} />
            <p className="text-ink mt-4 text-sm leading-6">
              {`${FAQ_CTA.doubts} `}
              <a
                href={`mailto:${EMAIL}`}
                className="text-primary underline underline-offset-4 hover:opacity-80"
              >
                {EMAIL}
              </a>
            </p>

            <div className="mt-10 rounded-3xl bg-white p-6 shadow-md">
              <h3 className="text-ink text-2xl leading-8 font-medium text-balance">
                {FAQ_CTA.title}
              </h3>
              <p className="text-muted mt-3 text-base leading-6">
                {FAQ_CTA.text}
              </p>
              <div className="mt-6">
                <DotButton label={CTA.label} href={CTA.href} />
              </div>
            </div>
          </div>

          <Accordion items={accordionItems} defaultOpenId="faq-0" />
        </div>
      </Container>
    </section>
  )
}
