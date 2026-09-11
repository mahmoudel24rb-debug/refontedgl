'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
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
 * blanche flottante qui se deplie au survol (module HoverCard du template),
 * puis une grille de quatre cartes compactes.
 */

const FEATURED_ICONS: LucideIcon[] = [Calculator, Gauge]
const GRID_ICONS: LucideIcon[] = [Sparkles, FileText, Gauge, Workflow]

/* Depliement de la liste des atouts (valeurs du template). */
const FEATURES: Variants = {
  rest: { height: 0, opacity: 0 },
  hover: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.15 },
      opacity: { duration: 0.1, delay: 0.1 },
    },
  },
}

const FEATURE: Variants = {
  rest: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0 },
}

/** Un outil porte dans l'application ouvre un lien interne, meme onglet. */
function estInterne(tool: ToolCard): boolean {
  return tool.internal === true || tool.href.startsWith('/')
}

/** Sur un ecran tactile il n'y a pas de survol : la carte reste depliee. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: none)')
    const update = () => setCoarse(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return coarse
}

const MotionLink = motion.create(Link)

function FeaturedCard({ tool, icon }: { tool: ToolCard; icon: LucideIcon }) {
  const Icon = icon
  const coarse = useCoarsePointer()
  const state = coarse ? 'hover' : 'rest'
  const interne = estInterne(tool)
  const Balise = interne ? MotionLink : motion.a

  return (
    <Balise
      href={tool.href}
      target={interne ? undefined : '_blank'}
      rel={interne ? undefined : 'noopener'}
      initial={state}
      animate={state}
      whileHover="hover"
      className="relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl p-6"
    >
      {tool.image ? (
        <img
          src={tool.image}
          alt={tool.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 to-transparent"
      />
      {tool.badge ? (
        <span className="bg-ink absolute top-6 left-6 z-10 rounded-full px-3 py-1 text-sm leading-5 text-white">
          {tool.badge}
        </span>
      ) : null}

      <motion.div
        layout
        className="relative z-10 flex w-full flex-col rounded-2xl bg-white px-6 py-5 shadow-xl"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
              <Icon size={18} aria-hidden="true" />
            </span>
            <h3 className="text-ink text-lg font-semibold">{tool.name}</h3>
          </div>
          <p className="text-muted text-sm leading-6">{tool.desc}</p>
        </div>

        {tool.features ? (
          <motion.div
            variants={FEATURES}
            initial={false}
            className="overflow-hidden"
          >
            <ul className="mt-5 flex flex-col gap-3 pb-1 text-sm">
              {tool.features.map((feature, index) => (
                <motion.li
                  key={feature}
                  variants={FEATURE}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                  className="text-ink/80 flex items-start gap-2"
                >
                  <CheckCircleIcon size={16} className="mt-0.5 shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </motion.div>
    </Balise>
  )
}

function SmallCard({ tool, icon }: { tool: ToolCard; icon: LucideIcon }) {
  const Icon = icon
  const interne = estInterne(tool)
  const Balise = interne ? Link : 'a'
  return (
    <Balise
      href={tool.href}
      target={interne ? undefined : '_blank'}
      rel={interne ? undefined : 'noopener'}
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
    </Balise>
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
