import { useReducedMotion } from 'framer-motion'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import Marquee from '../ui/Marquee'
import SectionHeader from '../ui/SectionHeader'
import {
  CTA,
  TESTIMONIALS,
  TESTIMONIALS_DARK_HEADING,
  type Testimonial,
} from '../content'

/**
 * Temoignages sur cartes navy quadrillees : meme defilement infini que les
 * avis clairs, mais en sens inverse. En `prefers-reduced-motion`, les trois
 * avis sont poses en grille statique.
 */

const SPEED = 40

function Card({ item, spaced = true }: { item: Testimonial; spaced?: boolean }) {
  const size = spaced
    ? 'w-[85vw] shrink-0 mr-6 lg:w-[680px]'
    : 'w-full min-w-0'
  return (
    <figure
      className={`bg-ink relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl p-8 text-white ${size}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom right, black 0%, rgba(0,0,0,0.35) 45%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(to bottom right, black 0%, rgba(0,0,0,0.35) 45%, transparent 85%)',
        }}
      />
      <img
        src={item.logo}
        alt={item.company}
        loading="lazy"
        draggable={false}
        className="relative h-8 w-auto max-w-[180px] self-start object-contain"
      />
      <div className="relative mt-10">
        <blockquote className="text-xl leading-8 font-medium text-balance text-white">
          {`« ${item.quote} »`}
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-semibold text-white">{item.name}</span>{' '}
          <span className="text-white/60">{`${item.role}, ${item.company}`}</span>
        </figcaption>
      </div>
    </figure>
  )
}

export default function TestimonialsDark() {
  const reduced = useReducedMotion()

  return (
    <section className="w-full overflow-x-hidden py-16 md:py-24">
      <Container>
        <SectionHeader
          title={TESTIMONIALS_DARK_HEADING}
          right={<DotButton label={CTA.label} href={CTA.href} />}
        />
      </Container>

      {reduced ? (
        <Container>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} spaced={false} />
            ))}
          </div>
        </Container>
      ) : (
        <div className="mt-12">
          <Marquee speed={SPEED} autoFill reverse pauseOnHover>
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </Marquee>
        </div>
      )}
    </section>
  )
}
