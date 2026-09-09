import { Phone } from 'lucide-react'
import Accordion, { type AccordionItem } from '../ui/Accordion'
import Container from '../ui/Container'
import CtaButton from '../ui/CtaButton'
import SectionHeader from '../ui/SectionHeader'
import { CheckCircleIcon, VS_ICONS, WarningCircleIcon } from '../ui/Icons'
import { VS } from '../content'
import { LOGO_DGL } from '../tokens'

/**
 * Comparatif « DGL Agency vs agence classique » : tableau trois colonnes en
 * desktop (colonne criteres grisee, colonne DGL, colonne agence classique),
 * accordeon critere par critere en mobile.
 */

const ROW = 'h-22 flex items-center'

function BrandMark() {
  return (
    <span className="bg-ink flex size-5 shrink-0 items-center justify-center rounded-full">
      <img
        src={LOGO_DGL}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={380}
        height={217}
        className="h-2.5 w-auto object-contain"
      />
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                    */
/* -------------------------------------------------------------------------- */

function Table() {
  return (
    <div className="hidden lg:block">
      <div className="rounded-3xl bg-white p-4">
        <div className="grid grid-cols-[25%_40%_35%]">
          <div className="bg-page h-22 rounded-t-2xl" />
          <div className={`${ROW} gap-2 px-6`}>
            <BrandMark />
            <span className="text-ink text-base font-medium">{VS.us}</span>
          </div>
          <div className={`${ROW} px-6`}>
            <span className="text-muted text-base">{VS.them}</span>
          </div>

          {VS.rows.map((row) => {
            const Icon = VS_ICONS[row.icon]
            return (
              <div key={row.label} className="contents">
                <div
                  className={`${ROW} bg-page border-ink/10 gap-3 border-t px-6`}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                    className="text-ink/70 shrink-0"
                  />
                  <span className="text-ink text-base">{row.label}</span>
                </div>
                <div className={`${ROW} border-ink/10 gap-3 border-t px-6`}>
                  <CheckCircleIcon size={20} className="shrink-0" />
                  <span className="text-ink text-base">{row.us}</span>
                </div>
                <div className={`${ROW} border-ink/10 gap-3 border-t px-6`}>
                  <WarningCircleIcon size={20} className="shrink-0" />
                  <span className="text-ink text-base">{row.them}</span>
                </div>
              </div>
            )
          })}

          <div className="bg-page border-ink/10 flex h-24 items-center gap-3 rounded-b-2xl border-t px-6">
            <Phone size={18} strokeWidth={1.6} className="text-ink/70 shrink-0" />
            <span className="text-ink text-base">{VS.free.label}</span>
          </div>
          <div className="border-ink/10 flex h-24 items-center border-t px-6">
            <CtaButton
              label={VS.free.primary.label}
              href={VS.free.primary.href}
              size="sm"
            />
          </div>
          <div className="border-ink/10 flex h-24 items-center border-t px-6">
            <CtaButton
              label={VS.free.secondary.label}
              href={VS.free.secondary.href}
              tone="light"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobile et tablette                                                         */
/* -------------------------------------------------------------------------- */

const ITEMS: AccordionItem[] = VS.rows.map((row) => ({
  id: row.icon + row.label,
  title: row.label,
  content: (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-ink flex items-center gap-2 text-sm font-medium">
          <BrandMark />
          {VS.us}
        </p>
        <p className="text-ink mt-2 flex items-start gap-2 text-base">
          <CheckCircleIcon size={20} className="mt-0.5 shrink-0" />
          {row.us}
        </p>
      </div>
      <div className="border-ink/10 border-t pt-4">
        <p className="text-muted text-sm">{VS.them}</p>
        <p className="text-ink mt-2 flex items-start gap-2 text-base">
          <WarningCircleIcon size={20} className="mt-0.5 shrink-0" />
          {row.them}
        </p>
      </div>
    </div>
  ),
}))

function Panels() {
  return (
    <div className="lg:hidden">
      <div className="rounded-3xl bg-white px-5 py-1 [&>div>div:last-child]:border-b-0">
        <Accordion items={ITEMS} defaultOpenId={ITEMS[0]?.id ?? null} />
      </div>
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <CtaButton
          label={VS.free.primary.label}
          href={VS.free.primary.href}
          size="sm"
        />
        <CtaButton
          label={VS.free.secondary.label}
          href={VS.free.secondary.href}
          tone="light"
          size="sm"
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function VsTable() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader
          title={VS.heading}
          right={
            <CtaButton
              label={VS.free.primary.label}
              href={VS.free.primary.href}
              size="sm"
            />
          }
        />
        <div className="mt-10 md:mt-14">
          <Table />
          <Panels />
        </div>
      </Container>
    </section>
  )
}
