import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import { CTA, HERO } from '../content'

/* -------------------------------------------------------------------------- */
/* Variants du calque de fond (template : stagger .25 s, delai initial .2 s)   */
/* -------------------------------------------------------------------------- */

const LAYERS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25, delayChildren: 0.2 } },
}

/** Planete et etoiles : opacite pleine. */
const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
}

/** Grille : le template la pose a 20 % (les traits sont peints plus clairs). */
const FADE_GRID: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 0.2, transition: { duration: 0.8, ease: 'easeInOut' } },
}

/** Lueur : 40 % dans le template (les taches sont peintes 2,5x plus fortes). */
const FADE_GLOW: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 0.4, transition: { duration: 0.8, ease: 'easeInOut' } },
}

/* -------------------------------------------------------------------------- */
/* Couches de fond                                                            */
/* -------------------------------------------------------------------------- */

const CELL = 64
const FILLED_CELLS = 6

/**
 * Grille fine masquee vers le bas. Comme dans le template, six cellules
 * tirees au sort au montage sont remplies d'un degrade coral.
 */
function Grid() {
  const ref = useRef<HTMLDivElement>(null)
  const size = useRef('')
  const [cells, setCells] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    const pick = () => {
      const node = ref.current
      if (!node) return
      const cols = Math.ceil(node.clientWidth / CELL)
      const rows = Math.ceil(node.clientHeight / CELL)
      /* On ne retire au sort que si le nombre de cellules a change. */
      const key = `${cols}x${rows}`
      if (key === size.current) return
      size.current = key
      const total = cols * rows
      const picked = new Set<number>()
      while (picked.size < Math.min(FILLED_CELLS, total)) {
        picked.add(Math.floor(Math.random() * total))
      }
      setCells(
        [...picked].map((index) => ({
          x: (index % cols) * CELL,
          y: Math.floor(index / cols) * CELL,
        })),
      )
    }
    pick()
    window.addEventListener('resize', pick)
    return () => window.removeEventListener('resize', pick)
  }, [])

  return (
    <motion.div
      ref={ref}
      variants={FADE_GRID}
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 w-full"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)',
        backgroundSize: `${CELL}px ${CELL}px`,
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
      }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="dgl-hero-cell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {cells.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width={CELL}
            height={CELL}
            fill="url(#dgl-hero-cell)"
          />
        ))}
      </svg>
    </motion.div>
  )
}

/* Generateur pseudo-aleatoire deterministe : le ciel est identique a chaque
   rendu (pas de saut d'hydratation ni de scintillement au re-render). */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Pseudo-aleatoire du template, fonction de l'index de l'etoile. */
function starRandom(index: number) {
  const value = 10000 * Math.sin(99.7 * index)
  return value - Math.floor(value)
}

interface Star {
  x: number
  y: number
  r: number
}

const STARS: Star[] = (() => {
  const random = mulberry32(20260908)
  const list: Star[] = []
  for (let i = 0; i < 90; i += 1) {
    list.push({
      x: random() * 100,
      y: random() * 72,
      r: 0.6 + random() * 0.8,
    })
  }
  return list
})()

function Stars({ active }: { active: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  /* Les etoiles ne scintillent que tant que le hero est a l'ecran. */
  const inView = useInView(ref, { amount: 0 })
  const twinkle = active && inView

  return (
    <motion.svg
      ref={ref}
      variants={FADE_IN}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {STARS.map((star, index) => (
        <motion.circle
          key={index}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={star.r}
          fill="#ffffff"
          initial={{ opacity: 0.2 }}
          animate={twinkle ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.2 }}
          transition={
            twinkle
              ? {
                  duration: 2 + 3 * starRandom(index),
                  delay: 1.2 + 2.5 * starRandom(index + 100),
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }
              : { duration: 0 }
          }
        />
      ))}
    </motion.svg>
  )
}

/* Arc superieur de la planete : geometrie du template (SVG 1951x1806,
   ellipse cx 975.5 cy 956 rx 773.5 ry 701). Le trait n'est peint qu'au
   sommet : les degrades sont verticaux (userSpaceOnUse) et s'eteignent
   quelques dizaines de pixels sous l'apex, si bien que l'arc se dissout sur
   les flancs au lieu de barrer la carte d'un trait continu. */

/** Contour principal, trait 4 px. */
const ARC = 'M975.5 255C1402.88 255 1749 569.029 1749 956C1749 1342.97 1402.88 1657 975.5 1657C548.119 1657 202 1342.97 202 956C202 569.029 548.119 255 975.5 255Z'
/** Contour fin, 1 px, legerement plus large (copie a 40 %). */
const ARC_THIN = 'M975.5 253.5C1403.57 253.5 1750.5 568.065 1750.5 956C1750.5 1343.93 1403.57 1658.5 975.5 1658.5C547.432 1658.5 200.5 1343.93 200.5 956C200.5 568.065 547.432 253.5 975.5 253.5Z'
/** Contour des halos flous (trait 24 px). */
const ARC_HALO = 'M975.5 255C1398.3 255 1739 565.452 1739 946C1739 1326.55 1398.3 1637 975.5 1637C552.695 1637 212 1326.55 212 946C212 565.452 552.695 255 975.5 255Z'
/** Contour des deux halos les plus larges, remontes de 43 px. */
const ARC_HALO_HIGH = 'M975.5 212C1398.3 212 1739 522.452 1739 903C1739 1283.55 1398.3 1594 975.5 1594C552.695 1594 212 1283.55 212 903C212 522.452 552.695 212 975.5 212Z'

/** Les 6 halos flous du template, du plus net au plus diffus. */
const HALOS: {
  path: string
  gradient: string
  blur: number
  width: number
  opacity?: number
}[] = [
  { path: ARC, gradient: 'dgl-arc-2', blur: 12, width: 4 },
  { path: ARC_HALO, gradient: 'dgl-arc-3', blur: 30, width: 24, opacity: 0.4 },
  { path: ARC_HALO, gradient: 'dgl-arc-4', blur: 30, width: 24, opacity: 0.4 },
  { path: ARC_HALO, gradient: 'dgl-arc-5', blur: 40, width: 24, opacity: 0.4 },
  { path: ARC_HALO, gradient: 'dgl-arc-6', blur: 50, width: 24, opacity: 0.4 },
  {
    path: ARC_HALO_HIGH,
    gradient: 'dgl-arc-7',
    blur: 50,
    width: 24,
    opacity: 0.4,
  },
  {
    path: ARC_HALO_HIGH,
    gradient: 'dgl-arc-8',
    blur: 100,
    width: 24,
    opacity: 0.4,
  },
]

/** Degrades verticaux : coral vif, coral clair puis blanc, vers transparent. */
const GRADIENTS: { id: string; y1: number; y2: number; color: string }[] = [
  { id: 'dgl-arc-0', y1: 108.5, y2: 313.5, color: '#FE5752' },
  { id: 'dgl-arc-1', y1: 108.5, y2: 582, color: '#FE5752' },
  { id: 'dgl-arc-2', y1: 253, y2: 392, color: '#FE5752' },
  { id: 'dgl-arc-3', y1: 243, y2: 468.5, color: '#FE5752' },
  { id: 'dgl-arc-4', y1: 243, y2: 328.5, color: '#FE5752' },
  { id: 'dgl-arc-5', y1: 243, y2: 334, color: '#FF9A94' },
  { id: 'dgl-arc-6', y1: 243, y2: 361, color: '#FF9A94' },
  { id: 'dgl-arc-7', y1: 200, y2: 336.5, color: '#FF9A94' },
  { id: 'dgl-arc-8', y1: 200, y2: 780.5, color: '#ffffff' },
]

/**
 * Le sommet de l'arc est cale sur `top` : le SVG remonte de 255 px, la
 * hauteur de sa calotte. Sur mobile l'arc est reduit de 55 % ; a taille
 * reelle, un rayon de 773 px sur 374 px de large donnerait un trait quasi
 * rectiligne.
 */
function Planet({ active }: { active: boolean }) {
  return (
    <motion.div
      variants={FADE_IN}
      className="pointer-events-none absolute top-[82%] left-1/2 w-[1951px] max-w-none origin-top -translate-x-1/2 scale-[0.45] md:top-[62%] md:scale-100"
    >
      <motion.svg
        width="1951"
        height="1806"
        viewBox="0 0 1951 1806"
        fill="none"
        overflow="visible"
        aria-hidden="true"
        className="-mt-[255px] block"
        initial={{ opacity: active ? 0 : 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <defs>
          {GRADIENTS.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              x1="976"
              y1={gradient.y1}
              x2="976"
              y2={gradient.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={gradient.color} />
              <stop offset="1" stopColor={gradient.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        <path d={ARC} stroke="url(#dgl-arc-0)" strokeWidth="4" />
        <path d={ARC_THIN} stroke="url(#dgl-arc-1)" opacity="0.4" />
        {HALOS.map((halo, index) => (
          <g
            key={index}
            opacity={halo.opacity}
            style={{
              filter: `blur(${halo.blur}px)`,
              mixBlendMode: 'plus-lighter',
            }}
          >
            <path
              d={halo.path}
              stroke={`url(#${halo.gradient})`}
              strokeWidth={halo.width}
            />
          </g>
        ))}
      </motion.svg>
    </motion.div>
  )
}

/**
 * Lueur coral au centre bas. Elle est peinte AVANT la planete. La planete
 * n'ayant plus de calotte pleine, un masque vertical doux eteint la lueur
 * avant qu'elle ne deborde sous l'arc (degrade progressif : aucun bord net).
 * Les taches sont peintes 2,5x plus fortes et montent chacune a 40 % (le
 * calque du template) : leur composition entre elles reste identique au rendu
 * statique precedent.
 */
const PASS_THROUGH: Variants = { hidden: {}, show: {} }

/* Le sommet de l'arc est a 82 % de la carte en mobile, 62 % en desktop : le
   masque s'eteint juste avant, sur une plage large pour rester invisible. */
const GLOW_MASK_MOBILE =
  'linear-gradient(to bottom, black 0%, black 60%, transparent 88%)'
const GLOW_MASK_DESKTOP =
  'linear-gradient(to bottom, black 0%, black 38%, transparent 68%)'

function Glow({ active }: { active: boolean }) {
  const pulse = active
    ? { animation: 'dgl-glow-pulse 8s ease-in-out infinite alternate' }
    : undefined
  const [mask, setMask] = useState(GLOW_MASK_MOBILE)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const apply = () =>
      setMask(query.matches ? GLOW_MASK_DESKTOP : GLOW_MASK_MOBILE)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return (
    <motion.div
      variants={PASS_THROUGH}
      className="pointer-events-none absolute inset-0"
      style={{
        mixBlendMode: 'plus-lighter',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <motion.div
        variants={FADE_GLOW}
        className="absolute bottom-[4%] left-1/2 h-[42%] w-[76%] -translate-x-1/2 rounded-[50%] md:bottom-[24%] md:w-[62%]"
        style={{
          background: 'rgba(254,87,82,0.625)',
          filter: 'blur(80px)',
          ...pulse,
        }}
      />
      <motion.div
        variants={FADE_GLOW}
        className="absolute bottom-[10%] left-1/2 h-[24%] w-[40%] -translate-x-1/2 rounded-[50%] md:bottom-[30%] md:w-[30%]"
        style={{
          background: 'rgba(255,154,148,0.375)',
          filter: 'blur(80px)',
          ...pulse,
        }}
      />
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  const reduced = useReducedMotion()
  const active = !reduced

  return (
    <section className="flex max-w-screen flex-col items-center justify-center overflow-x-hidden">
      <div className="h-[60vh] w-full p-2 md:h-screen">
        <div className="bg-ink relative m-0 h-full w-full overflow-hidden rounded-3xl text-white">
          <motion.div
            className="pointer-events-none absolute inset-0 h-full w-full"
            variants={LAYERS}
            initial={active ? 'hidden' : false}
            animate="show"
          >
            <Grid />
            <Stars active={active} />
            <Glow active={active} />
            <Planet active={active} />
          </motion.div>

          <Container className="relative z-10 flex h-full flex-col justify-between">
            <div className="pt-32 md:pt-42 lg:pt-56">
              <a
                href={HERO.pill.href}
                target="_blank"
                rel="noopener"
                className="bg-ink-deep flex w-fit rounded-full p-1 shadow-lg shadow-black/40"
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] sm:text-xs">
                    {HERO.pill.tag}
                  </span>
                  <span className="rounded-full pr-2 text-[10px] text-white sm:text-xs">
                    {HERO.pill.text}
                  </span>
                </span>
              </a>

              <div className="mt-6 flex flex-col items-start gap-6 md:mt-10 lg:flex-row lg:gap-10">
                <h1 className="-tracking-xl max-w-[720px] text-3xl leading-[1] font-semibold text-balance text-white sm:text-4xl md:text-5xl lg:text-7xl">
                  {HERO.title}
                </h1>
                <div className="lg:max-w-md">
                  <h2 className="text-sm font-medium text-balance text-white/70 sm:text-base lg:text-lg">
                    {HERO.subtitle}
                  </h2>
                  <div className="mt-6">
                    <DotButton label={CTA.label} href={CTA.href} />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-18 sm:h-48 md:h-72">
              <p
                aria-hidden="true"
                className="-tracking-xl absolute -top-10 left-1/2 -translate-x-1/2 bg-linear-to-r from-white/10 to-white/0 bg-clip-text text-[22vw] font-semibold whitespace-nowrap text-transparent select-none md:text-[17vw]"
              >
                {HERO.wordmark}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}
