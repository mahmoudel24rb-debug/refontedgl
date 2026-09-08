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
 */

const SPANS: Record<ProjectSpan, string> = {
  wide: 'col-span-14 md:col-span-7 lg:col-span-9',
  narrow: 'col-span-14 md:col-span-7 lg:col-span-5',
  half: 'col-span-14 md:col-span-7 lg:col-span-7',
}

/** Hauteur du filigrane : le haut de la grille le recouvre de 14 %. */
const WATERMARK_OFFSET = 'calc(clamp(96px, 16vw, 220px) * 0.86)'

function Tile({ project }: { project: Project }) {
  return (
    <div className={SPANS[project.span]}>
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-[280px] overflow-hidden rounded-3xl sm:h-[340px] lg:h-[460px]"
      >
        <img
          src={project.image}
          alt={`${project.client}, ${project.title}`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="bg-ink/85 pointer-events-none absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-8">
          <p className="-tracking-xs font-mono text-xs uppercase text-white/60">
            {project.client}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-base leading-6 font-medium text-white/80">
            {project.desc}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
            {PROJECTS_SECTION.cta}
            <ArrowRightIcon size={16} />
          </span>
          <p className="mt-3 text-sm text-white/60">{project.tags.join(', ')}</p>
        </div>
      </a>

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
