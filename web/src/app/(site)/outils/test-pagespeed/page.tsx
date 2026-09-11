import { CircleDollarSign, Search, TrendingUp, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { JsonLd, pageMetadata, webApplicationJsonLd } from '@/lib/seo'
import PageLayout from '@/site/layout/PageLayout'
import PageSpeedTool, { SEO_CONTENT_ID } from '@/site/tools/pagespeed/PageSpeedTool'
import {
  PAGESPEED_APP_SCHEMA,
  PAGESPEED_CTA,
  PAGESPEED_FAQ,
  PAGESPEED_FAQ_HEADING,
  PAGESPEED_HERO,
  PAGESPEED_INTERPRET,
  PAGESPEED_INTRO,
  PAGESPEED_METRICS_SEO,
  PAGESPEED_WHY,
} from '@/site/tools/pagespeed/texts'
import FaqAccordion from '@/site/tools/shared/FaqAccordion'
import RichText from '@/site/tools/shared/rich-text'
import ToolCtaSection from '@/site/tools/shared/ToolCtaSection'
import ToolSection from '@/site/tools/shared/ToolSection'
import ToolShell from '@/site/tools/shared/ToolShell'
import { PAGESPEED_URL } from '@/site/tokens'

/**
 * Page du test PageSpeed : outil en haut de page puis contenus SEO
 * repris de la page WordPress, dans le meme ordre. Le bloc SEO est
 * masque par l'outil pendant l'analyse.
 */

export const metadata: Metadata = pageMetadata('/outils/test-pagespeed')

/** Icones des trois statistiques d'impact business. */
const STAT_ICONS: LucideIcon[] = [Search, TrendingUp, CircleDollarSign]

export default function TestPageSpeedPage() {
  return (
    <PageLayout tone="light">
      <JsonLd
        data={webApplicationJsonLd({
          name: PAGESPEED_APP_SCHEMA.name,
          description: PAGESPEED_APP_SCHEMA.description,
          url: PAGESPEED_URL,
          category: PAGESPEED_APP_SCHEMA.category,
        })}
      />

      <ToolShell
        pill={PAGESPEED_HERO.pill}
        title={PAGESPEED_HERO.title}
        titleHighlight={PAGESPEED_HERO.titleHighlight}
        subtitle={PAGESPEED_HERO.subtitle}
        subtitleStrong={PAGESPEED_HERO.subtitleStrong}
        hint={PAGESPEED_HERO.hint}
      >
        <PageSpeedTool />
      </ToolShell>

      <div id={SEO_CONTENT_ID}>
        <ToolSection
          tag={PAGESPEED_INTRO.tag}
          tagTone="green"
          title={{
            before: PAGESPEED_INTRO.titleBefore,
            highlight: PAGESPEED_INTRO.titleHighlight,
            after: PAGESPEED_INTRO.titleAfter,
          }}
        >
          <div className="text-muted max-w-3xl space-y-4 text-base leading-7">
            {PAGESPEED_INTRO.paragraphs.map((paragraphe) => (
              <p key={paragraphe.slice(0, 40)}>{paragraphe}</p>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          tag={PAGESPEED_WHY.tag}
          title={{
            before: PAGESPEED_WHY.titleBefore,
            highlight: PAGESPEED_WHY.titleHighlight,
            after: PAGESPEED_WHY.titleAfter,
          }}
          desc={PAGESPEED_WHY.desc}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {PAGESPEED_WHY.stats.map((stat, index) => {
              const Icone = STAT_ICONS[index % STAT_ICONS.length] as LucideIcon
              return (
                <div key={stat.title} className="rounded-2xl bg-white p-6">
                  <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Icone size={20} aria-hidden="true" />
                  </span>
                  <p className="-tracking-xl text-primary mt-5 text-4xl font-semibold">
                    {stat.number}
                  </p>
                  <h3 className="text-ink mt-2 text-lg font-semibold">{stat.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-6">{stat.text}</p>
                </div>
              )
            })}
          </div>
        </ToolSection>

        <ToolSection
          tag={PAGESPEED_METRICS_SEO.tag}
          tagTone="dark"
          tone="navy"
          title={{
            before: PAGESPEED_METRICS_SEO.titleBefore,
            highlight: PAGESPEED_METRICS_SEO.titleHighlight,
          }}
          desc={PAGESPEED_METRICS_SEO.desc}
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PAGESPEED_METRICS_SEO.cards.map((carte) => (
              <div
                key={carte.abbr}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p
                  className="-tracking-xl text-2xl font-semibold"
                  style={{ color: carte.color }}
                >
                  {carte.abbr}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {carte.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{carte.text}</p>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          tag={PAGESPEED_INTERPRET.tag}
          title={{
            before: PAGESPEED_INTERPRET.titleBefore,
            highlight: PAGESPEED_INTERPRET.titleHighlight,
            after: PAGESPEED_INTERPRET.titleAfter,
          }}
        >
          <div className="text-muted max-w-3xl space-y-4 text-base leading-7">
            {PAGESPEED_INTERPRET.paragraphs.map((segments, index) => (
              <p key={`interpret-${index}`}>
                <RichText segments={segments} />
              </p>
            ))}
          </div>
        </ToolSection>
      </div>

      <FaqAccordion
        tag={PAGESPEED_FAQ_HEADING.tag}
        title={{
          before: PAGESPEED_FAQ_HEADING.titleBefore,
          highlight: PAGESPEED_FAQ_HEADING.titleHighlight,
        }}
        items={PAGESPEED_FAQ}
      />

      <ToolCtaSection
        title={{
          before: PAGESPEED_CTA.titleBefore,
          highlight: PAGESPEED_CTA.titleHighlight,
          after: PAGESPEED_CTA.titleAfter,
        }}
        desc={PAGESPEED_CTA.desc}
        card={PAGESPEED_CTA.card}
        fields={['prenom', 'nom', 'telephone', 'email', 'entreprise']}
        submitLabel={PAGESPEED_CTA.submit}
        privacy={PAGESPEED_CTA.privacy}
        success={PAGESPEED_CTA.success}
        endpoint="/api/tools/pagespeed/unlock"
        extra={{ intent: 'audit' }}
        trackingSource="audit_request"
      />
    </PageLayout>
  )
}
