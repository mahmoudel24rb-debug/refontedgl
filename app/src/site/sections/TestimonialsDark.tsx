import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Container from '../ui/Container'
import CarouselDots from '../ui/CarouselDots'
import DotButton from '../ui/DotButton'
import SectionHeader from '../ui/SectionHeader'
import {
  CTA,
  TESTIMONIALS,
  TESTIMONIALS_DARK_HEADING,
  type Testimonial,
} from '../content'

/**
 * Carrousel de temoignages sur cartes navy quadrillees : piste translatee de
 * `index * (largeur de la premiere carte + 24)` comme le module Feedbacks du
 * template, une pastille par avis, rotation automatique arretee des que le
 * visiteur intervient.
 */

const GAP = 24
const ROTATION_MS = 7000

function Card({ item }: { item: Testimonial }) {
  return (
    <figure className="bg-ink relative flex min-h-[360px] w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-8 text-white lg:w-[680px]">
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
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)
  const [locked, setLocked] = useState(false)

  useLayoutEffect(() => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!card) return
    const measure = () => setStep(card.getBoundingClientRect().width + GAP)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (reduced || locked || TESTIMONIALS.length < 2) return
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % TESTIMONIALS.length)
    }, ROTATION_MS)
    return () => window.clearInterval(id)
  }, [reduced, locked])

  const select = useCallback((index: number) => {
    setLocked(true)
    setActive(index)
  }, [])

  return (
    <section className="w-full overflow-hidden py-16 md:py-24">
      <Container>
        <SectionHeader
          title={TESTIMONIALS_DARK_HEADING}
          right={<DotButton label={CTA.label} href={CTA.href} />}
        />

        <div className="mt-12">
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translate3d(${-active * step}px, 0, 0)` }}
          >
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </div>
        </div>

        {TESTIMONIALS.length > 1 ? (
          <div className="mt-10 flex justify-center">
            <CarouselDots
              count={TESTIMONIALS.length}
              active={active}
              label="Navigation des temoignages"
              onSelect={select}
            />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
