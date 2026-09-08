import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import {
  ChartColumn,
  Globe,
  Megaphone,
  Search,
  Share2,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import GridPatternDepth from '../ui/GridPatternDepth'
import Marquee from '../ui/Marquee'
import RollingNumber from '../ui/RollingNumber'
import SectionHeader from '../ui/SectionHeader'
import { CTA, GROWTH, GROWTH_TOOLS_LABEL } from '../content'

/**
 * Bento croissance « Des PME qui grandissent » : carte equipe a gauche sur
 * deux rangees, chiffres cles, plateformes defilantes, citation client et
 * bande des outils.
 */

const CELL = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88"><rect x="3" y="3" width="82" height="82" rx="12" fill="none" stroke="rgba(0,35,41,0.06)" stroke-width="1"/></svg>',
)

const SIDE_FADE =
  'linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%)'

/* Indices des tuiles de la grille equipe qui recoivent une photo (5 x 4). */
const PHOTO_CELLS = [7, 11, 13]
const TEAM_CELLS = 20

/* Compteur roulant : prefixe, nombre, suffixe. */
const STAT_VALUE = /^(\D*)(\d+)(.*)$/
const COUNTER_STEP = 3
const COUNTER_TICK_MS = 10

/* Vitesse des defilements du bento, en px/s (valeur du template). */
const MARQUEE_SPEED = 50

const TOOL_ICONS: Record<string, LucideIcon> = {
  'Google Ads': Megaphone,
  Meta: Share2,
  'Looker Studio': ChartColumn,
  Make: Workflow,
  WordPress: Globe,
  'SE Ranking': Search,
}

/* -------------------------------------------------------------------------- */
/* Carte equipe                                                               */
/* -------------------------------------------------------------------------- */

function TeamCard() {
  const photos = GROWTH.team.photos
  return (
    <div className="order-last flex flex-col justify-end overflow-hidden rounded-2xl bg-white p-6 lg:order-none lg:row-span-2">
      <div
        aria-hidden="true"
        className="-mx-14"
        style={{ maskImage: SIDE_FADE, WebkitMaskImage: SIDE_FADE }}
      >
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: TEAM_CELLS }, (_, cell) => {
            const photoIndex = PHOTO_CELLS.indexOf(cell)
            const member = photoIndex >= 0 ? photos[photoIndex] : undefined
            if (!member) {
              return (
                <span
                  key={cell}
                  className="border-ink/5 block aspect-square rounded-lg border bg-white shadow-sm"
                />
              )
            }
            return (
              <span
                key={cell}
                className="ring-ink/5 block aspect-square rounded-lg bg-white p-0.5 shadow-md ring-1"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full rounded-md object-cover"
                />
              </span>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-ink text-lg font-medium">{GROWTH.team.title}</p>
        <div className="mt-4">
          <DotButton label={CTA.label} href={CTA.href} />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte chiffres                                                             */
/* -------------------------------------------------------------------------- */

function StatsCard() {
  const [first, second] = GROWTH.stats
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true, amount: 0.35 })
  const [count, setCount] = useState(1)

  const parsed = STAT_VALUE.exec(first ? first.value : '')
  const target = parsed ? Number(parsed[2]) : 0

  useEffect(() => {
    if (!inView || reduced || target <= 0) return
    let current = 1
    setCount(current)
    const id = window.setInterval(() => {
      current = Math.min(current + COUNTER_STEP, target)
      setCount(current)
      if (current >= target) window.clearInterval(id)
    }, COUNTER_TICK_MS)
    return () => window.clearInterval(id)
  }, [inView, reduced, target])

  return (
    <div
      ref={cardRef}
      className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white p-6 lg:min-h-[380px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${CELL}")`,
          backgroundSize: '88px 88px',
          backgroundPosition: '32px -14px',
          maskImage:
            'radial-gradient(110% 90% at 80% 10%, #000 0%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(110% 90% at 80% 10%, #000 0%, transparent 72%)',
        }}
      />
      <div className="relative">
        {parsed ? (
          <p className="text-ink flex items-center text-7xl font-medium tracking-tight md:text-8xl">
            {parsed[1]}
            <RollingNumber value={reduced ? target : count} />
            {parsed[3]}
          </p>
        ) : (
          <p className="text-ink text-7xl font-medium tracking-tight md:text-8xl">
            {first ? first.value : ''}
          </p>
        )}
        <p className="text-muted mt-1 text-base">{first ? first.label : ''}</p>
        {second ? (
          <p className="mt-6 text-2xl font-medium tracking-tight">
            <span className="text-ink">{second.value}</span>{' '}
            <span className="text-muted text-base font-normal">
              {second.label}
            </span>
          </p>
        ) : null}
      </div>
      <p className="text-muted relative mt-auto pt-8 text-base leading-7">
        {GROWTH.statsText}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte plateformes et carte citation                                        */
/* -------------------------------------------------------------------------- */

function PlatformsCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white py-5"
      style={{ maskImage: SIDE_FADE, WebkitMaskImage: SIDE_FADE }}
    >
      <Marquee speed={MARQUEE_SPEED} reverse pauseOnHover>
        {GROWTH.platforms.map((platform) => (
          <span
            key={platform}
            className="bg-page text-ink mr-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm"
          >
            <span className="bg-primary block size-1.5 rounded-full" />
            {platform}
          </span>
        ))}
      </Marquee>
    </div>
  )
}

function QuoteCard() {
  return (
    <div className="to-primary/15 relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 bottom-0 aspect-[497/346] translate-x-[18%]"
      >
        <GridPatternDepth className="h-full w-full" />
      </span>
      <p className="text-ink/80 relative text-lg leading-7 text-pretty">
        {GROWTH.quote.text}
      </p>
      <p className="relative mt-6 text-base">
        <span className="text-ink font-medium">{GROWTH.quote.name}</span>
        <span className="text-muted">, {GROWTH.quote.role}</span>
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte outils                                                               */
/* -------------------------------------------------------------------------- */

function ToolsCard() {
  return (
    <div className="rounded-2xl bg-white p-6 lg:col-span-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <p className="text-ink shrink-0 text-lg font-medium">
          {GROWTH_TOOLS_LABEL}
        </p>
        <div className="min-w-0 flex-1">
          <Marquee speed={MARQUEE_SPEED} autoFill pauseOnHover className="py-2">
            {GROWTH.tools.map((tool, index) => {
              const Icon = TOOL_ICONS[tool.name] ?? Globe
              return (
                <span
                  key={tool.name}
                  title={tool.name}
                  aria-label={tool.name}
                  role="img"
                  className="ring-ink/5 mx-6 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.7}
                    className={
                      index % 2 === 0 ? 'text-primary' : 'text-ink/70'
                    }
                  />
                </span>
              )
            })}
          </Marquee>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function GrowthBento() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader title={GROWTH.heading} />
        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 lg:grid-cols-3">
          <TeamCard />
          <StatsCard />
          <div className="flex flex-col gap-3">
            <PlatformsCard />
            <QuoteCard />
          </div>
          <ToolsCard />
        </div>
      </Container>
    </section>
  )
}
