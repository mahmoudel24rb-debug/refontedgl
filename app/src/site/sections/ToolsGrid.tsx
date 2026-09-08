import {
  Calculator,
  FileText,
  Gauge,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import Container from '../ui/Container'
import SectionHeader from '../ui/SectionHeader'
import { ArrowRightIcon, CheckCircleIcon } from '../ui/Icons'
import { TOOLS_GRID_CTA, TOOLS_PAGE, type ToolCard } from '../content'

/**
 * Catalogue des outils gratuits : deux grandes cartes image avec une carte
 * blanche flottante, puis une grille de quatre cartes compactes.
 */

const FEATURED_ICONS: LucideIcon[] = [Calculator, Gauge]
const GRID_ICONS: LucideIcon[] = [Sparkles, FileText, Gauge, Workflow]

function FeaturedCard({ tool, icon }: { tool: ToolCard; icon: LucideIcon }) {
  const Icon = icon
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener"
      className="group relative block min-h-[420px] overflow-hidden rounded-3xl"
    >
      {tool.image ? (
        <img
          src={tool.image}
          alt={tool.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 to-transparent"
      />
      {tool.badge ? (
        <span className="bg-ink absolute top-6 left-6 rounded-full px-3 py-1 text-sm leading-5 text-white">
          {tool.badge}
        </span>
      ) : null}
      <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
            <Icon size={18} aria-hidden="true" />
          </span>
          <h3 className="text-ink text-base font-semibold">{tool.name}</h3>
        </div>
        <p className="text-muted mt-2 text-sm leading-6">{tool.desc}</p>
        {tool.features ? (
          <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            {tool.features.map((feature) => (
              <li key={feature} className="text-ink/80 flex items-start gap-2">
                <CheckCircleIcon size={16} className="mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </a>
  )
}

function SmallCard({ tool, icon }: { tool: ToolCard; icon: LucideIcon }) {
  const Icon = icon
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener"
      className="border-ink/5 flex h-full flex-col rounded-2xl border bg-white p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h3 className="text-ink mt-4 text-base font-semibold text-balance">
        {tool.name}
      </h3>
      <p className="text-muted mt-2 text-sm leading-6">{tool.desc}</p>
      <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium">
        {TOOLS_GRID_CTA}
        <ArrowRightIcon size={16} />
      </span>
    </a>
  )
}

export default function ToolsGrid() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader title={TOOLS_PAGE.heading} />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {TOOLS_PAGE.featured.map((tool, index) => (
            <FeaturedCard
              key={tool.name}
              tool={tool}
              icon={
                FEATURED_ICONS[index % FEATURED_ICONS.length] as LucideIcon
              }
            />
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {TOOLS_PAGE.grid.map((tool, index) => (
            <SmallCard
              key={tool.name}
              tool={tool}
              icon={GRID_ICONS[index % GRID_ICONS.length] as LucideIcon}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
