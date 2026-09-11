'use client'

import { useReducedMotion } from '../hooks/useReducedMotion'
import Container from '../ui/Container'
import CtaButton from '../ui/CtaButton'
import Marquee from '../ui/Marquee'
import SectionHeader from '../ui/SectionHeader'
import { QuoteIcon } from '../ui/Icons'
import {
  CTA,
  TESTIMONIALS,
  TESTIMONIALS_HEADING,
  type Testimonial,
} from '../content'
import { LOGO_FILTER_INK } from '../tokens'

/**
 * Temoignages clairs : defilement horizontal infini (40 px/s), duplique
 * autant de fois qu'il faut pour couvrir la largeur de l'ecran, mis en pause
 * au survol. En `prefers-reduced-motion`, les trois avis sont poses en
 * grille statique.
 */

const SPEED = 40

function Card({ item, spaced = true }: { item: Testimonial; spaced?: boolean }) {
  /* Dans la piste : largeur fixe et gouttiere portee par la carte (la boucle
     du defilement recolle sans trou). En grille statique : pleine largeur. */
  const size = spaced
    ? 'w-[85vw] shrink-0 mr-6 md:w-[588px]'
    : 'w-full min-w-0'
  return (
    <article
      className={`flex h-full flex-col rounded-3xl bg-white p-6 md:p-8 ${size}`}
    >
      <div className="flex items-start justify-between gap-4">
        <img
          src={item.logo}
          alt={item.company}
          loading="lazy"
          draggable={false}
          className="h-6 w-auto object-contain"
          style={{ filter: LOGO_FILTER_INK }}
        />
        <QuoteIcon size={22} className="text-ink/20 shrink-0" />
      </div>

      <p className="text-ink mt-8 text-lg leading-7 text-pretty">
        {item.quote}
      </p>

      <div className="mt-auto flex items-center gap-3 pt-8">
        <img
          src={item.avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <span className="min-w-0">
          <span className="text-ink block text-base font-medium">
            {item.name}
          </span>
          <span className="text-muted block text-sm">
            {item.role}, {item.company}
          </span>
        </span>
      </div>
    </article>
  )
}

export default function TestimonialsLight() {
  const reduced = useReducedMotion()

  return (
    <section className="w-full overflow-x-hidden py-16 md:py-24">
      <Container>
        <SectionHeader
          title={TESTIMONIALS_HEADING}
          align="center-mobile"
          right={<CtaButton label={CTA.label} href={CTA.href} />}
        />
      </Container>

      {reduced ? (
        <Container>
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} spaced={false} />
            ))}
          </div>
        </Container>
      ) : (
        <div className="mt-10 md:mt-14">
          <Marquee speed={SPEED} autoFill pauseOnHover>
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </Marquee>
        </div>
      )}
    </section>
  )
}
