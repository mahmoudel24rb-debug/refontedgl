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
 * Carrousel clair de temoignages : piste horizontale translatee par index,
 * une carte deborde a droite comme dans le template. Glissement tactile,
 * rotation automatique de 6 s coupee des la premiere interaction.
 */

const GAP = 16
const AUTOPLAY_MS = 6000
const DRAG_THRESHOLD = 48

function Card({ item }: { item: Testimonial }) {
  return (
    <article className="flex w-full shrink-0 grow-0 basis-auto flex-col rounded-3xl bg-white p-6 sm:w-[calc(50%-8px)] md:p-8 lg:w-[calc(42%-11px)]">
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
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<number | null>(null)

  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [maxShift, setMaxShift] = useState(0)
  const [drag, setDrag] = useState(0)
  const [paused, setPaused] = useState(false)

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const card = track.firstElementChild as HTMLElement | null
    setStep(card ? card.offsetWidth + GAP : 0)
    setMaxShift(Math.max(0, track.scrollWidth - viewport.clientWidth))
  }, [])

  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

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
    setDrag(0)
    if (delta <= -DRAG_THRESHOLD) select(index + 1)
    else if (delta >= DRAG_THRESHOLD) select(index - 1)
  }

  const shift = Math.min(index * step, maxShift)

  return (
    <section className="w-full overflow-hidden py-16 md:py-24">
      <Container>
        <SectionHeader
          title={TESTIMONIALS_HEADING}
          align="center-mobile"
          right={<DotButton label={CTA.label} href={CTA.href} />}
        />

        <div
          ref={viewportRef}
          className="relative mt-10 touch-pan-y select-none md:mt-14"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            ref={trackRef}
            className="flex items-stretch gap-4"
            style={{
              transform: `translate3d(${-shift + drag}px, 0, 0)`,
              transition:
                pointerStart.current !== null
                  ? 'none'
                  : 'transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)',
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
