import { useEffect, useRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Hero DGL — version "Glowy waves" (basé sur composant/hero3).
 * Canvas 2D avec 5 couches de vagues qui suivent la souris + contenu
 * centré entrance-animé. Header (logo + nav + CTA) intégré au-dessus
 * du canvas.
 *
 * Requiert framer-motion + lucide-react (déjà dans le projet).
 */

type Point = { x: number; y: number }
interface WaveConfig {
  offset: number
  amplitude: number
  frequency: number
  color: string
  opacity: number
}

const DGL = {
  bg: '#002329',
  bgBottom: '#001519',
  primary: '#fe5752',
  primaryHover: '#e54a45',
  white: '#ffffff',
} as const

const WAVE_PALETTE: WaveConfig[] = [
  { offset: 0, amplitude: 70, frequency: 0.003, color: 'rgba(254,87,82,0.8)', opacity: 0.45 },
  { offset: Math.PI / 2, amplitude: 90, frequency: 0.0026, color: 'rgba(255,140,133,0.7)', opacity: 0.35 },
  { offset: Math.PI, amplitude: 60, frequency: 0.0034, color: 'rgba(240,239,233,0.55)', opacity: 0.3 },
  { offset: Math.PI * 1.5, amplitude: 80, frequency: 0.0022, color: 'rgba(255,255,255,0.35)', opacity: 0.25 },
  { offset: Math.PI * 2, amplitude: 55, frequency: 0.004, color: 'rgba(254,87,82,0.35)', opacity: 0.2 },
]

const NAV_LINKS = ['Services', 'Réalisations', 'À propos', 'Ressources']

const highlightPills = [
  'ROAS mesurable',
  'Setup en 15 jours',
  'Reporting mensuel',
] as const

const heroStats: { label: string; value: string }[] = [
  { label: 'Clients satisfaits', value: '500+' },
  { label: 'Années d\'expertise', value: '10 ans' },
  { label: 'Campagnes actives', value: '120+' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.12 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 },
  },
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<Point>({ x: 0, y: 0 })
  const targetMouseRef = useRef<Point>({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId = 0
    let time = 0

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const mouseInfluence = prefersReducedMotion ? 10 : 70
    const influenceRadius = prefersReducedMotion ? 160 : 320
    const smoothing = prefersReducedMotion ? 0.04 : 0.1

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      canvas.width = parent ? parent.clientWidth : window.innerWidth
      canvas.height = parent ? parent.clientHeight : window.innerHeight
    }

    const recenterMouse = () => {
      const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 }
      mouseRef.current = centerPoint
      targetMouseRef.current = centerPoint
    }

    const handleResize = () => {
      resizeCanvas()
      recenterMouse()
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => recenterMouse()

    resizeCanvas()
    recenterMouse()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const drawWave = (wave: WaveConfig) => {
      ctx.save()
      ctx.beginPath()

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x
        const dy = canvas.height / 2 - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - distance / influenceRadius)
        const mouseEffect =
          influence *
          mouseInfluence *
          Math.sin(time * 0.001 + x * 0.01 + wave.offset)

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) *
            wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) *
            (wave.amplitude * 0.45) +
          mouseEffect

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.lineWidth = 2.5
      ctx.strokeStyle = wave.color
      ctx.globalAlpha = wave.opacity
      ctx.shadowBlur = 35
      ctx.shadowColor = wave.color
      ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      time += 1

      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * smoothing
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * smoothing

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, DGL.bg)
      gradient.addColorStop(1, DGL.bgBottom)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      WAVE_PALETTE.forEach(drawWave)

      animationId = window.requestAnimationFrame(animate)
    }

    animationId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: DGL.bg,
        color: DGL.white,
        fontFamily: '"Inter Tight", sans-serif',
      }}
      aria-label="Hero DGL Agency"
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      />

      {/* Halos gradients pour la profondeur */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            height: 520,
            width: 520,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background: 'rgba(254,87,82,0.10)',
            filter: 'blur(140px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: 360,
            width: 360,
            borderRadius: '50%',
            background: 'rgba(240,239,233,0.05)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '25%',
            height: 400,
            width: 400,
            borderRadius: '50%',
            background: 'rgba(254,87,82,0.06)',
            filter: 'blur(150px)',
          }}
        />
      </div>

      {/* HEADER — absolute au-dessus du canvas */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 64px',
          maxWidth: 1920,
          margin: '0 auto',
        }}
        className="hero3-header"
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}
          className="hero3-nav-wrap"
        >
          <img
            src="https://dgl-agency.fr/wp-content/uploads/2025/11/logo-dgl-agency.webp"
            alt="DGL Agency"
            style={{ height: 32, width: 'auto' }}
          />
          <nav style={{ display: 'flex', gap: '2rem' }} className="hero3-nav">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="hero3-nav-link">
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" className="hero3-nav-link hero3-nav-link-white">
            Contact
          </a>
          <button className="hero3-header-cta">Audit gratuit</button>
        </div>
      </header>

      {/* CONTENU CENTRÉ */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          margin: '0 auto',
          display: 'flex',
          width: '100%',
          maxWidth: 1152,
          flexDirection: 'column',
          alignItems: 'center',
          padding: '96px 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <motion.h1
            variants={itemVariants}
            style={{
              margin: 0,
              marginBottom: 24,
              fontSize: 'clamp(36px, 6vw, 80px)',
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: DGL.white,
            }}
          >
            Débloquez la performance{' '}
            <span
              style={{
                background: `linear-gradient(90deg, ${DGL.primary} 0%, rgba(254,87,82,0.6) 55%, rgba(240,239,233,0.8) 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              marketing que vous méritez
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              margin: '0 auto 40px',
              maxWidth: 760,
              fontSize: 'clamp(16px, 1.6vw, 22px)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            SEO, Google Ads, Meta Ads, automatisation. On construit des systèmes
            d'acquisition mesurables au ROAS, avec un reporting mensuel clair et
            zéro promesse en l'air.
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{
              marginBottom: 40,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <PrimaryButton>
              Audit gratuit
              <ArrowRight
                size={16}
                aria-hidden
                className="hero3-arrow"
                style={{ transition: 'transform 200ms' }}
              />
            </PrimaryButton>
            <GhostButton>Voir nos réalisations</GhostButton>
          </motion.div>

          <motion.ul
            variants={itemVariants}
            style={{
              margin: '0 0 48px',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {highlightPills.map((pill) => (
              <li
                key={pill}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(254,87,82,0.25)',
                  background: 'rgba(0,35,41,0.6)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {pill}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={statsVariants}
            style={{
              display: 'grid',
              gap: 16,
              padding: 24,
              borderRadius: 16,
              border: '1px solid rgba(254,87,82,0.2)',
              background: 'rgba(0,35,41,0.6)',
              backdropFilter: 'blur(8px)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: DGL.white,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .hero3-arrow-btn:hover .hero3-arrow { transform: translateX(4px); }

        .hero3-nav-link {
          position: relative;
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          font-weight: 400;
          text-decoration: none;
          padding-bottom: 4px;
          transition: color 200ms;
        }
        .hero3-nav-link:hover { color: #fff; }
        .hero3-nav-link-white { color: #fff; font-weight: 500; }

        .hero3-header-cta {
          background: ${DGL.primary};
          color: ${DGL.white};
          border: none;
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 200ms;
        }
        .hero3-header-cta:hover { background: ${DGL.primaryHover}; }

        @media (max-width: 900px) {
          .hero3-header { padding: 18px 20px !important; }
          .hero3-nav { display: none !important; }
        }
      `}</style>
    </section>
  )
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="hero3-arrow-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        border: 'none',
        background: DGL.primary,
        color: DGL.white,
        padding: '14px 32px',
        fontSize: 15,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        cursor: 'pointer',
        transition: 'background 200ms',
        fontFamily: 'inherit',
        boxShadow: '0 8px 32px rgba(254,87,82,0.35)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = DGL.primaryHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = DGL.primary
      }}
    >
      {children}
    </button>
  )
}

function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        border: '1px solid rgba(254,87,82,0.4)',
        background: 'rgba(0,35,41,0.4)',
        color: 'rgba(255,255,255,0.85)',
        padding: '14px 32px',
        fontSize: 15,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 200ms',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(254,87,82,0.7)'
        e.currentTarget.style.background = 'rgba(0,35,41,0.7)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(254,87,82,0.4)'
        e.currentTarget.style.background = 'rgba(0,35,41,0.4)'
      }}
    >
      {children}
    </button>
  )
}
