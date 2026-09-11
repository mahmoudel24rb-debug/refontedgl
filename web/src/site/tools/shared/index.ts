/**
 * Kit de composants partage par les outils gratuits (PageSpeed, ROI,
 * scan de visibilite IA). Chaque outil n'importe que ce dont il a besoin.
 */

export { default as ToolShell, CARD_SHEEN } from './ToolShell'
export type { ToolShellProps, ToolShellPill } from './ToolShell'

export { default as ToolSection } from './ToolSection'
export type { ToolSectionProps, ToolSectionTitle, ToolTagTone } from './ToolSection'

export { default as ScoreGauge } from './ScoreGauge'
export {
  SCORE_COLORS,
  DEFAULT_THRESHOLDS,
  scoreCategory,
  scoreColor,
} from './ScoreGauge'
export type { ScoreGaugeProps, ScoreThresholds } from './ScoreGauge'

export { default as GatedContent } from './GatedContent'
export type { GatedContentProps } from './GatedContent'

export { default as LeadForm } from './LeadForm'
export type {
  LeadFormProps,
  LeadFormValues,
  LeadFormOutcome,
  LeadFieldName,
} from './LeadForm'

export { default as FaqAccordion } from './FaqAccordion'
export type { FaqAccordionProps, ToolFaqItem } from './FaqAccordion'

export { default as ToolCtaSection } from './ToolCtaSection'
export type { ToolCtaSectionProps } from './ToolCtaSection'

export { useUnlockSession } from './useUnlockSession'
export type { UnlockSession } from './useUnlockSession'

export { RichText, plainText } from './rich-text'
export type { RichSegment } from './rich-text'

export { postLead, readUtm } from './submit'
export type { UtmParams } from './submit'

export { LEAD_FIELDS, LEAD_MESSAGES, LEAD_CONSENT_LABEL } from './texts'
export type { LeadFieldTexts } from './texts'
