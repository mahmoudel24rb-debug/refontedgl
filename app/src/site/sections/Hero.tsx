import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import { CTA, HERO } from '../content'

/* -------------------------------------------------------------------------- */
/* Couches de fond                                                            */
/* -------------------------------------------------------------------------- */

/** Grille fine, masquee vers le bas comme dans le template. */
function Grid() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 w-full"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
      }}
    />
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

interface Star {
  x: number
  y: number
  r: number
  o: number
  twinkle: boolean
  delay: number
}

const STARS: Star[] = (() => {
  const random = mulberry32(20260908)
  const list: Star[] = []
  for (let i = 0; i < 90; i += 1) {
    list.push({
      x: random() * 100,
      y: random() * 72,
      r: 0.6 + random() * 0.8,
      o: 0.15 + random() * 0.3,
      twinkle: false,
      delay: random() * 4,
    })
  }
  for (let i = 0; i < 8; i += 1) {
    list[Math.floor(random() * list.length)].twinkle = true
  }
  return list
})()

function Stars({ animate }: { animate: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {STARS.map((star, index) => (
        <circle
          key={index}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={star.r}
          fill="#ffffff"
          opacity={star.o}
          style={
            star.twinkle && animate
              ? {
                  animation: `dgl-twinkle 4s ease-in-out ${star.delay}s infinite`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  )
}

/** Demi-planete : seul l'arc superieur de l'ellipse depasse. */
function Planet() {
  return (
    <div className="pointer-events-none absolute top-[82%] left-1/2 w-[1950px] max-w-none -translate-x-1/2 md:top-[62%]">
      <svg
        width="1950"
        height="1200"
        viewBox="0 0 1950 1200"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dgl-hero-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FE5752" stopOpacity="0" />
            <stop offset="20%" stopColor="#FE5752" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#FFD4D1" stopOpacity="1" />
            <stop offset="80%" stopColor="#FE5752" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
          </linearGradient>
          <filter
            id="dgl-hero-halo"
            x="-10%"
            y="-20%"
            width="120%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <filter
            id="dgl-hero-halo-tight"
            x="-10%"
            y="-20%"
            width="120%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <ellipse cx="975" cy="580" rx="974" ry="578" fill="rgba(0,21,25,0.9)" />
        <ellipse
          cx="975"
          cy="580"
          rx="974"
          ry="578"
          fill="none"
          stroke="url(#dgl-hero-arc)"
          strokeWidth="16"
          opacity="0.35"
          filter="url(#dgl-hero-halo)"
        />
        <ellipse
          cx="975"
          cy="580"
          rx="974"
          ry="578"
          fill="none"
          stroke="url(#dgl-hero-arc)"
          strokeWidth="8"
          opacity="0.5"
          filter="url(#dgl-hero-halo-tight)"
        />
        <ellipse
          cx="975"
          cy="580"
          rx="974"
          ry="578"
          fill="none"
          stroke="url(#dgl-hero-arc)"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

/**
 * Lueur coral au centre bas. Elle est peinte AVANT la planete : la calotte
 * sombre masque la partie basse, il ne reste que le halo au-dessus de l'arc.
 */
function Glow({ animate }: { animate: boolean }) {
  const pulse = animate
    ? { animation: 'dgl-glow-pulse 8s ease-in-out infinite alternate' }
    : undefined
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ mixBlendMode: 'plus-lighter' }}
    >
      <div
        className="absolute bottom-[4%] left-1/2 h-[42%] w-[76%] -translate-x-1/2 rounded-[50%] md:bottom-[24%] md:w-[62%]"
        style={{
          background: 'rgba(254,87,82,0.25)',
          filter: 'blur(80px)',
          ...pulse,
        }}
      />
      <div
        className="absolute bottom-[10%] left-1/2 h-[24%] w-[40%] -translate-x-1/2 rounded-[50%] md:bottom-[30%] md:w-[30%]"
        style={{
          background: 'rgba(255,154,148,0.15)',
          filter: 'blur(80px)',
          ...pulse,
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
}

export default function Hero() {
  const reduced = useReducedMotion()
  const animate = !reduced

  return (
    <section className="flex max-w-screen flex-col items-center justify-center overflow-x-hidden">
      <div className="h-[60vh] w-full p-2 md:h-screen">
        <div className="bg-ink relative m-0 h-full w-full overflow-hidden rounded-3xl text-white">
          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <Grid />
            <Stars animate={animate} />
            <Glow animate={animate} />
            <Planet />
          </div>

          <Container className="relative z-10 flex h-full flex-col justify-between">
            <motion.div
              className="pt-32 md:pt-42 lg:pt-56"
              variants={CONTAINER_VARIANTS}
              initial={animate ? 'hidden' : false}
              animate="show"
            >
              <motion.a
                variants={ITEM_VARIANTS}
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
              </motion.a>

              <div className="mt-6 flex flex-col items-start gap-6 md:mt-10 lg:flex-row lg:gap-10">
                <motion.h1
                  variants={ITEM_VARIANTS}
                  className="-tracking-xl max-w-[720px] text-3xl leading-[1] font-semibold text-balance text-white sm:text-4xl md:text-5xl lg:text-7xl"
                >
                  {HERO.title}
                </motion.h1>
                <motion.div variants={ITEM_VARIANTS} className="lg:max-w-md">
                  <h2 className="text-sm font-medium text-balance text-white/70 sm:text-base lg:text-lg">
                    {HERO.subtitle}
                  </h2>
                  <div className="mt-6">
                    <DotButton label={CTA.label} href={CTA.href} />
                  </div>
                </motion.div>
              </div>
            </motion.div>

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
