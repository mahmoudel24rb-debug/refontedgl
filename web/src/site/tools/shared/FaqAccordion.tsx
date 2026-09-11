import { JsonLd, faqJsonLd } from '@/lib/seo'

import Accordion from '../../ui/Accordion'
import ToolSection, { type ToolSectionTitle, type ToolTagTone } from './ToolSection'
import { RichText, plainText, type RichSegment } from './rich-text'

/**
 * FAQ d'une page outil : accordeon du site plus le bloc FAQPage pour les
 * resultats enrichis Google. Les reponses acceptent des liens.
 */

export interface ToolFaqItem {
  question: string
  reponse: RichSegment[]
}

export interface FaqAccordionProps {
  id?: string
  tag?: string
  tagTone?: ToolTagTone
  title: ToolSectionTitle
  items: ToolFaqItem[]
}

export default function FaqAccordion({
  id = 'faq',
  tag,
  tagTone = 'green',
  title,
  items,
}: FaqAccordionProps) {
  return (
    <>
      <JsonLd
        data={faqJsonLd(
          items.map((item) => ({
            question: item.question,
            reponse: plainText(item.reponse),
          })),
        )}
      />
      <ToolSection id={id} tag={tag} tagTone={tagTone} title={title}>
        <Accordion
          items={items.map((item, index) => ({
            id: `question-${index}`,
            title: item.question,
            content: <RichText segments={item.reponse} />,
          }))}
          defaultOpenId="question-0"
        />
      </ToolSection>
    </>
  )
}
