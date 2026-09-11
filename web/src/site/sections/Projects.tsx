'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import Container from '../ui/Container'
import PageWatermark from '../ui/PageWatermark'
import { ArrowRightIcon } from '../ui/Icons'
import {
  PROJECTS,
  PROJECTS_SECTION,
  type Project,
  type ProjectSpan,
} from '../content'

/**
 * Masonry des realisations (6 tuiles sur une grille de 14 colonnes) avec
 * filigrane geant et overlay au survol, comme le template.
 * `variant` : `home` (filigrane au-dessus de la grille, section espacee) ou
 * `page` (filigrane cale sous la navbar de la page realisations).
 * Une tuile pointe soit vers une fiche cas client interne (Link next/link),
 * soit vers une URL externe qui s'ouvre dans un nouvel onglet.
 */

const MotionLink = motion.create(Link)

const SPANS: Record<ProjectSpan, string> = {
  wide: 'col-span-14 md:col-span-7 lg:col-span-9',
  narrow: 'col-span-14 md:col-span-7 lg:col-span-5',
  half: 'col-span-14 md:col-span-7 lg:col-span-7',
}

/** Hauteur du filigrane : le haut de la grille le recouvre de 14 %. */
const WATERMARK_OFFSET = 'calc(clamp(96px, 16vw, 220px) * 0.86)'

/* Voile floute et blocs de texte : variants du template (module Projects). */
const OVERLAY: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const TOP_BLOCK: Variants = {
  rest: { opacity: 0, y: 8 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.05 },
  },
}

const BOTTOM_BLOCK: Variants = {
  rest: { opacity: 0, y: 8 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.13 },
  },
}

const TILE_CLASS =
  'group relative block h-[280px] overflow-hidden rounded-3xl text-left sm:h-[340px] lg:h-[460px]'

const TILE_MOTION = {
  initial: 'rest',
  animate: 'rest',
  whileHover: 'hover',
  className: TILE_CLASS,
} as const

function Tile({ project }: { project: Project }) {
  const internal = project.href.startsWith('/')
  const content = (
    <>
        <img
          src={project.image}
          alt={`${project.client}, ${project.title}`}
          loading="lazy"
          className="h-full w-full rounded-3xl object-cover object-center"
          style={
            project.imagePosition
              ? { objectPosition: project.imagePosition }
              : undefined
          }
        />
        <motion.div
          variants={OVERLAY}
          className="bg-ink/50 absolute inset-0 flex flex-col justify-between rounded-3xl p-6 backdrop-blur-md md:p-8"
        >
          <motion.div variants={TOP_BLOCK} className="space-y-2">
            <p className="-tracking-xs font-mono text-xs uppercase text-white/60">
              {project.client}
            </p>
            <div className="-tracking-sm text-2xl leading-8 font-medium text-white">
              {project.title}
            </div>
            <p className="text-base leading-6 font-medium text-white/80">
              {project.desc}
            </p>
          </motion.div>

          <motion.div
            variants={BOTTOM_BLOCK}
            className="flex w-full items-end justify-between gap-4"
          >
            <span className="tracking-xs inline-flex items-center gap-1 text-sm leading-4 font-medium text-white">
              {PROJECTS_SECTION.cta}
              <ArrowRightIcon size={16} />
            </span>
            <span className="-tracking-xs text-right text-sm leading-4 font-medium text-white/80">
              {project.tags.join(', ')}
            </span>
          </motion.div>
        </motion.div>
    </>
  )

  return (
    <div className={SPANS[project.span]}>
      {internal ? (
        <MotionLink href={project.href} {...TILE_MOTION}>
          {content}
        </MotionLink>
      ) : (
        <motion.a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          {...TILE_MOTION}
        >
          {content}
        </motion.a>
      )}

      <div className="mt-4 md:hidden" aria-hidden="true">
        <p className="-tracking-xs text-muted font-mono text-xs uppercase">
          {project.client}
        </p>
        <p className="text-ink mt-1 text-lg font-semibold">{project.title}</p>
        <p className="text-muted mt-1 text-sm leading-6">{project.desc}</p>
      </div>
    </div>
  )
}

export default function Projects({
  variant = 'home',
}: {
  variant?: 'home' | 'page'
}) {
  const isPage = variant === 'page'

  return (
    <section
      className={`relative w-full ${isPage ? 'pb-16 md:pb-24' : 'py-16 md:py-24'}`}
    >
      <PageWatermark
        text={PROJECTS_SECTION.watermark}
        className={isPage ? 'top-0' : 'top-16 md:top-24'}
      />
      <Container className="relative z-10">
        {/* padding et non margin : en variante `page` la section n'a pas de
            padding haut, une marge s'echapperait par fusion et emporterait le
            filigrane avec elle. */}
        <div
          className="grid grid-cols-14 gap-4"
          style={{ paddingTop: WATERMARK_OFFSET }}
        >
          {PROJECTS.map((project) => (
            <Tile key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  )
}
