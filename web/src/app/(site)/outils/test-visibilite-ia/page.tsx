import type { Metadata } from 'next'

import { JsonLd, faqJsonLd, pageMetadata, webApplicationJsonLd } from '@/lib/seo'
import PageLayout from '@/site/layout/PageLayout'
import Accordion from '@/site/ui/Accordion'
import GeoScanTool from '@/site/tools/geoscan/GeoScanTool'
import {
  GEOSCAN_APP_SCHEMA,
  GEOSCAN_CTA,
  GEOSCAN_FAQ,
  GEOSCAN_FAQ_HEADING,
  GEOSCAN_FAQ_JSONLD,
  GEOSCAN_HERO,
  GEOSCAN_INTRO,
  GEOSCAN_STATS,
} from '@/site/tools/geoscan/texts'
import RichText from '@/site/tools/shared/rich-text'
import ToolSection from '@/site/tools/shared/ToolSection'
import ToolShell from '@/site/tools/shared/ToolShell'
import { TEST_IA_URL } from '@/site/tokens'

/**
 * Page du test de visibilite IA : outil en haut de page puis contenus
 * SEO repris de la landing WordPress, dans le meme ordre.
 */

export const metadata: Metadata = pageMetadata('/outils/test-visibilite-ia')

/** Ancre du formulaire, visee par le CTA de bas de page. */
const ANCRE_OUTIL = 'tester'

export default function TestVisibiliteIaPage() {
  return (
    <PageLayout tone="light">
      <JsonLd
        data={webApplicationJsonLd({
          name: GEOSCAN_APP_SCHEMA.name,
          description: GEOSCAN_APP_SCHEMA.description,
          url: TEST_IA_URL,
          category: GEOSCAN_APP_SCHEMA.category,
        })}
      />
      <JsonLd data={faqJsonLd([...GEOSCAN_FAQ_JSONLD])} />

      <div id={ANCRE_OUTIL}>
        <ToolShell
          pill={GEOSCAN_HERO.pill}
          title={GEOSCAN_HERO.title}
          titleHighlight={GEOSCAN_HERO.titleHighlight}
          subtitle={GEOSCAN_HERO.subtitle}
        >
          <GeoScanTool />
        </ToolShell>
      </div>

      <ToolSection
        tag={GEOSCAN_INTRO.tag}
        tagTone="green"
        title={{
          before: GEOSCAN_INTRO.titleBefore,
          highlight: GEOSCAN_INTRO.titleHighlight,
          after: GEOSCAN_INTRO.titleAfter,
        }}
      >
        <div className="text-muted max-w-3xl space-y-4 text-base leading-7">
          {GEOSCAN_INTRO.paragraphs.map((paragraphe) => (
            <p key={paragraphe.slice(0, 40)}>{paragraphe}</p>
          ))}
        </div>
      </ToolSection>

      <ToolSection
        tag={GEOSCAN_STATS.tag}
        tagTone="dark"
        tone="navy"
        title={{
          before: GEOSCAN_STATS.titleBefore,
          highlight: GEOSCAN_STATS.titleHighlight,
        }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {GEOSCAN_STATS.cards.map((carte) => (
            <div
              key={carte.number}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="-tracking-xl text-primary text-4xl font-semibold">
                {carte.number}
              </p>
              <h3 className="mt-2 text-base font-semibold text-white">{carte.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{carte.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/70">
          <strong className="font-medium text-white">{GEOSCAN_STATS.methodTitle}</strong>
          {GEOSCAN_STATS.methodText}
        </p>
      </ToolSection>

      <ToolSection
        id="faq"
        tag={GEOSCAN_FAQ_HEADING.tag}
        tagTone="green"
        title={{
          before: GEOSCAN_FAQ_HEADING.titleBefore,
          highlight: GEOSCAN_FAQ_HEADING.titleHighlight,
        }}
      >
        <Accordion
          items={GEOSCAN_FAQ.map((item, index) => ({
            id: `question-${index}`,
            title: item.question,
            content: <RichText segments={item.reponse} />,
          }))}
          defaultOpenId="question-0"
        />
      </ToolSection>

      <ToolSection
        tone="navy"
        title={{
          before: GEOSCAN_CTA.titleBefore,
          highlight: GEOSCAN_CTA.titleHighlight,
          after: GEOSCAN_CTA.titleAfter,
        }}
        desc={GEOSCAN_CTA.desc}
      >
        <a href={`#${ANCRE_OUTIL}`} className="shiny-cta shiny-cta--sm">
          <span>{GEOSCAN_CTA.label}</span>
        </a>
      </ToolSection>
    </PageLayout>
  )
}
