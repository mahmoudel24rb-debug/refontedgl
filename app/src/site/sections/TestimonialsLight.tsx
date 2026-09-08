import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import CarouselDots from '../ui/CarouselDots'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
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
 * Carrousel clair de temoignages : piste horizontale translatee de
 * `index * (largeur de la premiere carte + 24)`, comme le module Testimonials
 * du template. Glissement tactile et rotation automatique de 6 s coupee des la
 * premiere interaction.
 */

const GAP = 24
const AUTOPLAY_MS = 6000
const DRAG_THRESHOLD = 48

function Card({ item }: { item: Testimonial }) {
  return (
    <article className="flex min-h-full w-[85vw] shrink-0 flex-col rounded-3xl bg-white p-6 md:w-[588px] md:p-8">
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
  const trackRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<number | null>(null)

  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [paused, setPaused] = useState(false)

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
    if (reduced || paused) return
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % TESTIMONIALS.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused])

  const select = useCallback((next: number) => {
    setPaused(true)
    setIndex(Math.min(Math.max(next, 0), TESTIMONIALS.length - 1))
  }, [])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    pointerStart.current = event.clientX
    setDragging(true)
    setPaused(true)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return
    setDrag(event.clientX - pointerStart.current)
  }

  function onPointerUp() {
    if (pointerStart.current === null) return
    const delta = drag
    pointerStart.current = null
    setDragging(false)
    setDrag(0)
    if (delta <= -DRAG_THRESHOLD) select(index + 1)
    else if (delta >= DRAG_THRESHOLD) select(index - 1)
  }

  return (
    <section className="w-full overflow-hidden py-16 md:py-24">
      <Container>
        <SectionHeader
          title={TESTIMONIALS_HEADING}
          align="center-mobile"
          right={<DotButton label={CTA.label} href={CTA.href} />}
        />

        <div
          className="relative mt-10 touch-pan-y select-none md:mt-14"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            ref={trackRef}
            className={`flex items-stretch gap-6 transition-transform ease-out will-change-transform ${
              dragging ? 'duration-0' : 'duration-500'
            }`}
            style={{
              transform: `translate3d(${-index * step + drag}px, 0, 0)`,
            }}
          >
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <CarouselDots
            count={TESTIMONIALS.length}
            active={index}
            onSelect={select}
            label="Navigation des temoignages"
          />
        </div>
      </Container>
    </section>
  )
}
