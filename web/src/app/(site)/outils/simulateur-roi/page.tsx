import { Check, Clock, Eye, TrendingUp, X, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { JsonLd, pageMetadata, webApplicationJsonLd } from '@/lib/seo'
import PageLayout from '@/site/layout/PageLayout'
import RoiSimulator from '@/site/tools/roi/RoiSimulator'
import {
  ROI_APP_SCHEMA,
  ROI_COMPARE,
  ROI_CTA,
  ROI_FAQ,
  ROI_FAQ_HEADING,
  ROI_HOW,
  ROI_INTRO,
  ROI_ROAS,
  ROI_WHY,
} from '@/site/tools/roi/texts'
import FaqAccordion from '@/site/tools/shared/FaqAccordion'
import RichText from '@/site/tools/shared/rich-text'
import ToolCtaSection from '@/site/tools/shared/ToolCtaSection'
import ToolSection from '@/site/tools/shared/ToolSection'
import { ROI_URL } from '@/site/tokens'

/**
 * Page du simulateur de ROI : outil en haut de page puis contenus SEO
 * repris de `roi-calculator.html`, dans le meme ordre (ROI, ROI vs ROAS,
 * chiffres cles, methode, Meta vs Google, FAQ, demande d'audit).
 */

export const metadata: Metadata = pageMetadata('/outils/simulateur-roi')

/** Icones des trois statistiques de la section « Les chiffres cles ». */
const STAT_ICONS: LucideIcon[] = [TrendingUp, Eye, Clock]

export default function SimulateurRoiPage() {
  return (
    <PageLayout tone="light">
      <JsonLd
        data={webApplicationJsonLd({
          name: ROI_APP_SCHEMA.name,
          description: ROI_APP_SCHEMA.description,
          url: ROI_URL,
          category: ROI_APP_SCHEMA.category,
        })}
      />

      <RoiSimulator />

      <ToolSection
        tag={ROI_INTRO.tag}
        tagTone="green"
        title={{
          before: ROI_INTRO.titleBefore,
          highlight: ROI_INTRO.titleHighlight,
          after: ROI_INTRO.titleAfter,
        }}
      >
        <div className="text-muted max-w-3xl space-y-4 text-base leading-7">
          {ROI_INTRO.paragraphs.map((paragraphe) => (
            <p key={paragraphe.slice(0, 40)}>{paragraphe}</p>
          ))}
        </div>
      </ToolSection>

      <ToolSection
        tag={ROI_ROAS.tag}
        title={{ before: ROI_ROAS.titleBefore, highlight: ROI_ROAS.titleHighlight }}
        desc={ROI_ROAS.desc}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {ROI_ROAS.cards.map((carte) => (
            <div key={carte.cle} className="rounded-2xl bg-white p-6">
              <h3 className="text-ink text-lg font-semibold">
                {carte.titleBefore}
                <RichText segments={[carte.lien]} />
                {carte.titleAfter}
              </h3>
              <p className="text-muted mt-3 text-sm leading-6">{carte.paragraphe1}</p>
              <p className="border-ink/10 text-ink mt-4 rounded-xl border border-dashed px-4 py-3 text-center font-mono text-xs">
                {carte.formule}
              </p>
              <p className="text-muted mt-4 text-sm leading-6">{carte.paragraphe2}</p>
            </div>
          ))}
        </div>

        <p className="border-primary/20 bg-primary/5 text-muted mt-4 rounded-2xl border px-5 py-4 text-sm leading-6">
          <RichText segments={ROI_ROAS.tip} />
        </p>
      </ToolSection>

      <ToolSection
        tag={ROI_WHY.tag}
        title={{
          before: ROI_WHY.titleBefore,
          highlight: ROI_WHY.titleHighlight,
          after: ROI_WHY.titleAfter,
        }}
        desc={ROI_WHY.desc}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {ROI_WHY.stats.map((stat, index) => {
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
        tag={ROI_HOW.tag}
        tagTone="dark"
        tone="navy"
        title={{
          before: ROI_HOW.titleBefore,
          highlight: ROI_HOW.titleHighlight,
          after: ROI_HOW.titleAfter,
        }}
        desc={ROI_HOW.desc}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {ROI_HOW.steps.map((etape) => (
            <div
              key={etape.numero}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="bg-primary flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white">
                {etape.numero}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{etape.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{etape.text}</p>
            </div>
          ))}
        </div>
      </ToolSection>

      <ToolSection
        tag={ROI_COMPARE.tag}
        title={{
          before: ROI_COMPARE.titleBefore,
          highlight: ROI_COMPARE.titleHighlight,
        }}
        desc={ROI_COMPARE.desc}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {ROI_COMPARE.cards.map((carte) => (
            <div key={carte.platform} className="rounded-2xl bg-white p-6">
              <h3 className="text-ink text-lg font-semibold">{carte.title}</h3>
              <p className="text-muted mt-1 font-mono text-xs uppercase">{carte.sub}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {carte.points.map((point) => (
                  <li key={point.text} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                      style={
                        point.ok
                          ? { backgroundColor: 'rgba(12, 206, 107, 0.14)', color: '#0a8f4c' }
                          : { backgroundColor: 'rgba(255, 78, 66, 0.12)', color: '#c0392b' }
                      }
                    >
                      {point.ok ? <Check size={13} /> : <X size={13} />}
                    </span>
                    <span className="text-muted text-sm leading-6">{point.text}</span>
                  </li>
                ))}
              </ul>
              <p className="bg-ink/5 text-ink mt-5 rounded-xl px-4 py-3 text-sm font-medium">
                {carte.best}
              </p>
            </div>
          ))}
        </div>

        <p className="border-primary/20 bg-primary/5 text-muted mt-4 rounded-2xl border px-5 py-4 text-sm leading-6">
          {ROI_COMPARE.tip}
        </p>
      </ToolSection>

      <FaqAccordion
        tag={ROI_FAQ_HEADING.tag}
        title={{
          before: ROI_FAQ_HEADING.titleBefore,
          highlight: ROI_FAQ_HEADING.titleHighlight,
        }}
        items={ROI_FAQ}
      />

      <ToolCtaSection
        title={{
          before: ROI_CTA.titleBefore,
          highlight: ROI_CTA.titleHighlight,
        }}
        desc={ROI_CTA.desc}
        card={ROI_CTA.card}
        fields={['prenom', 'nom', 'telephone', 'email', 'entreprise']}
        submitLabel={ROI_CTA.submit}
        privacy={ROI_CTA.privacy}
        success={ROI_CTA.success}
        endpoint="/api/leads/audit"
        trackingSource="audit_request"
      />
    </PageLayout>
  )
}
