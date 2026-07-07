import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { asset } from '@/lib/utils'

interface Stat {
  num: string
  label: string
  from: number
  to: number
  decimals: number
  suffix: string
}

const STATS: Stat[] = [
  {
    num: '01',
    label: 'Clients\nsatisfaits',
    from: 0,
    to: 500,
    decimals: 0,
    suffix: '+',
  },
  {
    num: '02',
    label: 'ROI moyen\nde nos campagnes',
    from: 0,
    to: 65,
    decimals: 0,
    suffix: '%',
  },
  {
    num: '03',
    label: 'Campagnes\nlancées',
    from: 0,
    to: 300,
    decimals: 0,
    suffix: '+',
  },
]

export default function PowerOfFinance() {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, amount: 0.3 })
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      style={{
        background: '#FFFFFF',
        padding: '85px 18px 60px',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1fr auto',
          alignItems: narrow ? 'flex-start' : 'end',
          gap: 'clamp(2rem, 6vw, 6rem)',
          marginBottom: '32px',
        }}
      >
        {/* Left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '720px',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              color: '#002329',
              fontSize: 'clamp(2.5rem, 5.2vw, 5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
Prêt à développer
            <br />
votre acquisition ?
          </motion.h2>
          <p
            style={{
              color: '#0F0F0F',
              opacity: 0.55,
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '21.5px',
              margin: 0,
              maxWidth: '420px',
            }}
          >
Avec 10+ ans d'expertise en SEO, publicité Google & Meta Ads et automatisation
            marketing, DGL Agency vous aide à générer des leads qualifiés et
            obtenir des résultats mesurables rapidement.
          </p>
        </div>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <PrimaryButton />
            <GhostButton />
          </div>
        </div>
      </motion.div>

      {/* Stats grid — LIQUID HOVER CARDS */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: narrow
            ? '1fr'
            : 'repeat(3, minmax(0, 1fr))',
          gap: '18px',
          marginTop: '32px',
        }}
      >
        {STATS.map((s, i) => (
          <StatCard key={s.num} stat={s} startAnimating={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}

/* ==============================
   PRIMARY / GHOST BUTTONS
============================== */
function PrimaryButton() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '9px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        border: '1px solid transparent',
        background: hover ? '#e54a45' : '#fe5752',
        color: '#002329',
        borderColor: '#fe5752',
        transition:
          'transform 200ms ease, background 200ms ease, color 200ms ease',
      }}
    >
Audit gratuit
      <img src={asset('arrow-right.svg')} alt="" width={12} height={12} />
    </button>
  )
}

function GhostButton() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '9px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        border: '1px solid rgba(0,35,41,0.25)',
        background: hover ? 'rgba(0,35,41,0.04)' : 'transparent',
        color: '#002329',
        transition:
          'transform 200ms ease, background 200ms ease, color 200ms ease',
      }}
    >
Nous contacter
    </button>
  )
}

/* ==============================
   STAT CARD with LIQUID HOVER
   (invented — spec truncated)
   Effect: a dark-green blob rises from the bottom
   with a rounded/radial top edge, card lifts slightly
   and text turns white.
============================== */
function StatCard({
  stat,
  startAnimating,
  delay,
}: {
  stat: Stat
  startAnimating: boolean
  delay: number
}) {
  const [hover, setHover] = useState(false)
  const [display, setDisplay] = useState(stat.from)

  useEffect(() => {
    if (!startAnimating) return
    const start = performance.now() + delay * 1000
    const duration = 1800
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, elapsed / duration)
      const eased = easeOutCubic(t)
      const value = stat.from + (stat.to - stat.from) * eased
      setDisplay(value)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [startAnimating, stat.from, stat.to, delay])

  const formatted = `${display.toFixed(stat.decimals)}${stat.suffix}`

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        borderRadius: '18px',
        background: '#F2F2F0',
        cursor: 'pointer',
        transition:
          'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms ease',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 24px 48px -20px rgba(0,35,41,0.35)'
          : '0 0 0 rgba(0,0,0,0)',
        isolation: 'isolate',
      }}
    >
      {/* Liquid fill : ellipse blob rising from the bottom */}
      <div
        style={{
          position: 'absolute',
          left: '-30%',
          right: '-30%',
          bottom: hover ? '-25%' : '-140%',
          height: '160%',
          background: '#002329',
          borderRadius: '50% 50% 0 0 / 40% 40% 0 0',
          transition:
            'bottom 780ms cubic-bezier(0.22,1,0.36,1), border-radius 780ms cubic-bezier(0.22,1,0.36,1)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
        }}
      >
        {/* Top : num */}
        <div
          style={{
            fontSize: 'clamp(0.8125rem, 1vw, 0.875rem)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: hover ? 'rgba(255,255,255,0.75)' : 'rgba(0,35,41,0.55)',
            transition: 'color 300ms ease',
          }}
        >
          {stat.num}
        </div>

        {/* Middle : big number */}
        <div
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: hover ? '#FFFFFF' : '#002329',
            transition: 'color 300ms ease',
          }}
        >
          {formatted}
        </div>

        {/* Bottom : label */}
        <div
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            fontWeight: 500,
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
            color: hover ? '#FFFFFF' : '#002329',
            transition: 'color 300ms ease',
          }}
        >
          {stat.label}
        </div>
      </div>
    </div>
  )
}
