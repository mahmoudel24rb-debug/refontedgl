import { useEffect, useState } from 'react'

/**
 * Composant Hero — version DGL Agency.
 * Adapté du prompt "Marketeam" original (cf. composant/hero/hero prompt.md)
 * avec :
 *   - palette DGL (dark navy + coral)
 *   - photos équipe (Kiara, Mahmoud, Victor) + logos clients réels
 *   - copy en français
 *
 * Fonts : Inter + Urbanist chargées via <style>@import.
 * Aucune lib d'animation externe : keyframes CSS + JS pour typewriter/counter.
 * Requiert @property (Chrome 85+, Edge 85+, Safari 16.4+, Firefox 128+).
 */

const HEADING_TEXT =
  "Débloquez la performance marketing que vous pensiez hors de portée -- Maintenant à un clic"
const HEADING_ACCENT_CHARS = 66 // les 66 premiers en coral, le reste en blanc

// Photos équipe DGL (déposées dans /public/composant-hero/team/)
const TEAM = {
  kiara: '/composant-hero/team/Image-Equipe-Kiara.webp',
  mahmoud: '/composant-hero/team/Image-Equipe-Mahmoud.webp',
  victor: '/composant-hero/team/Image-Equipe-Victor.webp',
}

// Logos clients hébergés sur dgl-agency.fr
const CLIENT_LOGOS = {
  oceades:
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Logo-Les-Oceades-e1763389856213.webp',
  gymfit:
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Logo-GYMFIT-e1763389822761.webp',
  beauregard:
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Logo-Beauregard.webp',
  epicure:
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Logo-Epicure-Social-Club-1.webp',
  ipms:
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Logo-IPMS.webp',
}

// DGL brand accent — utilisé pour tous les glows pour rester cohérent
const DGL_GLOW = 'rgba(254,87,82,0.55)'

const AVATARS: {
  url: string
  kind: 'team' | 'logo'
  orbit: 2 | 3 | 4
  angle: number
  radius: number
  size: number
  shape: 'round' | 'square'
  radius_px?: number
  glow: string
  delay: number
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
}[] = [
  // ORBIT 2 : L'ÉQUIPE (3 photos, orbite 501px)
  {
    url: TEAM.kiara,
    kind: 'team',
    orbit: 2,
    angle: 60,
    radius: 251,
    size: 78,
    shape: 'round',
    glow: DGL_GLOW,
    delay: 0.6,
    objectFit: 'cover',
    objectPosition: 'center 22%',
  },
  {
    url: TEAM.mahmoud,
    kind: 'team',
    orbit: 2,
    angle: 180,
    radius: 251,
    size: 78,
    shape: 'round',
    glow: DGL_GLOW,
    delay: 0.85,
    objectFit: 'cover',
    objectPosition: 'center 20%',
  },
  {
    url: TEAM.victor,
    kind: 'team',
    orbit: 2,
    angle: 300,
    radius: 251,
    size: 78,
    shape: 'round',
    glow: DGL_GLOW,
    delay: 1.1,
    objectFit: 'cover',
    objectPosition: 'center 20%',
  },

  // ORBIT 3 : logo client (325px radius)
  {
    url: CLIENT_LOGOS.gymfit,
    kind: 'logo',
    orbit: 3,
    angle: 130,
    radius: 325,
    size: 88,
    shape: 'square',
    radius_px: 22,
    glow: DGL_GLOW,
    delay: 1.35,
    objectFit: 'contain',
  },

  // ORBIT 4 : 4 logos clients (orbite extérieure 797px)
  {
    url: CLIENT_LOGOS.oceades,
    kind: 'logo',
    orbit: 4,
    angle: 30,
    radius: 399,
    size: 78,
    shape: 'square',
    radius_px: 22,
    glow: DGL_GLOW,
    delay: 1.6,
    objectFit: 'contain',
  },
  {
    url: CLIENT_LOGOS.beauregard,
    kind: 'logo',
    orbit: 4,
    angle: 95,
    radius: 399,
    size: 88,
    shape: 'square',
    radius_px: 22,
    glow: DGL_GLOW,
    delay: 1.85,
    objectFit: 'contain',
  },
  {
    url: CLIENT_LOGOS.epicure,
    kind: 'logo',
    orbit: 4,
    angle: 220,
    radius: 399,
    size: 88,
    shape: 'square',
    radius_px: 22,
    glow: DGL_GLOW,
    delay: 2.05,
    objectFit: 'contain',
  },
  {
    url: CLIENT_LOGOS.ipms,
    kind: 'logo',
    orbit: 4,
    angle: 320,
    radius: 399,
    size: 78,
    shape: 'square',
    radius_px: 22,
    glow: DGL_GLOW,
    delay: 2.3,
    objectFit: 'contain',
  },
]

const PARTNER_LOGOS = [
  CLIENT_LOGOS.oceades,
  CLIENT_LOGOS.gymfit,
  CLIENT_LOGOS.beauregard,
  CLIENT_LOGOS.epicure,
  CLIENT_LOGOS.ipms,
]

const ORBITS = [
  { n: 1, size: 353, duration: 30, direction: 'left' },
  { n: 2, size: 501, duration: 40, direction: 'right' },
  { n: 3, size: 649, duration: 50, direction: 'right' },
  { n: 4, size: 797, duration: 60, direction: 'left' },
] as const

/* -----------------------
   Hooks utilitaires
------------------------*/
function useTypewriter(fullText: string, speed = 35, delay = 400) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let i = 0
    let raf: number | null = null

    const start = () => {
      const tick = () => {
        if (cancelled) return
        setText(fullText.slice(0, i))
        if (i < fullText.length) {
          i++
          window.setTimeout(() => (raf = requestAnimationFrame(tick)), speed)
        } else {
          setDone(true)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const timer = window.setTimeout(start, delay)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [fullText, speed, delay])

  return { text, done }
}

function useCountUp(target: number, duration = 2000, delay = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const timer = window.setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setValue(Math.round(easeOutCubic(t) * target))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}

/* -----------------------
   Composant principal
------------------------*/
export default function Demo() {
  const [viewport, setViewport] = useState<
    'xs' | 'sm' | 'md' | 'lg' | 'xl'
  >('xl')

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w <= 480) setViewport('xs')
      else if (w <= 768) setViewport('sm')
      else if (w <= 1024) setViewport('md')
      else if (w <= 1280) setViewport('lg')
      else setViewport('xl')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const circleScale =
    viewport === 'xs'
      ? 0.4
      : viewport === 'sm'
        ? 0.5
        : viewport === 'md'
          ? 0.7
          : viewport === 'lg'
            ? 0.85
            : 1

  const stacked = viewport === 'md' || viewport === 'sm' || viewport === 'xs'
  const hideNav = viewport === 'sm' || viewport === 'xs'
  const headingSize =
    viewport === 'xs'
      ? 28
      : viewport === 'sm'
        ? 36
        : viewport === 'md'
          ? 48
          : 64

  const { text: typed, done: typingDone } = useTypewriter(HEADING_TEXT, 35, 400)
  const count = useCountUp(500, 2000, 1200)

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="mkt-app"
        style={{
          minHeight: 'calc(100vh - 48px)',
          background:
            'radial-gradient(ellipse at 15% 25%, rgba(254,87,82,0.28) 0%, transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(254,87,82,0.10) 0%, transparent 50%), #002329',
          fontFamily: '"Inter", sans-serif',
          overflow: 'hidden',
          position: 'relative',
          color: '#fff',
        }}
      >
        {/* HEADER */}
        <header
          className="mkt-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: viewport === 'xs' ? '18px 20px' : '24px 64px',
            maxWidth: '1920px',
            margin: '0 auto',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: hideNav ? 0 : '3rem',
            }}
          >
            <img
              src="https://dgl-agency.fr/wp-content/uploads/2025/11/logo-dgl-agency.webp"
              alt="DGL Agency"
              style={{ height: 32, width: 'auto' }}
            />
            {!hideNav && (
              <nav style={{ display: 'flex', gap: '2rem' }}>
                {['Services', 'Réalisations', 'À propos', 'Ressources'].map(
                  (link) => (
                    <a key={link} href="#" className="mkt-nav-link">
                      {link}
                    </a>
                  ),
                )}
              </nav>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#" className="mkt-nav-link mkt-nav-link-white">
              Contact
            </a>
            <div className="mkt-btn-border-wrap">
              <button className="mkt-btn mkt-btn-primary">
                <span className="mkt-btn-label">Audit gratuit</span>
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <div
          className="mkt-hero"
          style={{
            display: 'flex',
            flexDirection: stacked ? 'column' : 'row',
            alignItems: stacked ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: stacked ? '3rem' : '2rem',
            maxWidth: '1920px',
            margin: '0 auto',
            padding: stacked ? '40px 20px 20px' : '40px 64px 20px',
          }}
        >
          {/* Hero Left */}
          <div
            className="mkt-hero-left"
            style={{
              flex: stacked ? '1 1 auto' : '0 1 600px',
              paddingTop: stacked ? 0 : 40,
              textAlign: stacked ? 'center' : 'left',
            }}
          >
            <h1
              style={{
                fontFamily: '"Urbanist", sans-serif',
                fontSize: headingSize,
                fontWeight: 600,
                lineHeight: `${headingSize + 4}px`,
                letterSpacing: '-1.5px',
                margin: 0,
              }}
            >
              {typed.split('').map((ch, i) => (
                <span
                  key={i}
                  style={{
                    color: i < HEADING_ACCENT_CHARS ? '#fe5752' : '#ffffff',
                  }}
                >
                  {ch}
                </span>
              ))}
              {!typingDone && (
                <span
                  className="mkt-cursor"
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: '0.9em',
                    background: '#fe5752',
                    marginLeft: 3,
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </h1>

            <div
              className="mkt-cta-wrap"
              style={{
                marginTop: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: stacked ? '1rem' : '1.25rem',
                flexWrap: 'wrap',
                justifyContent: stacked ? 'center' : 'flex-start',
                opacity: 0,
                animation:
                  'mktFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 3.2s forwards',
              }}
            >
              <div className="mkt-btn-border-wrap">
                <button className="mkt-btn mkt-btn-start">
                  <span className="mkt-btn-label">Discutons de votre projet</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: 6 }}
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              {/* Cursor + badge "L'équipe DGL" */}
              <div
                className="mkt-david"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginLeft: stacked ? 0 : '4rem',
                  marginTop: stacked ? 0 : '1rem',
                  opacity: 0,
                  animation:
                    'mktFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 3.6s forwards',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fe5752">
                  <path d="M5 3l14 8-6 2-2 6-6-16z" />
                </svg>
                <span
                  style={{
                    background: '#fe5752',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 500,
                    padding: '8px 16px',
                    borderRadius: 20,
                    lineHeight: 1,
                  }}
                >
                  L'équipe DGL
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right — Circles visualization */}
          <div
            className="mkt-hero-right"
            style={{
              width: 720,
              height: 720,
              maxWidth: '100vw',
              position: 'relative',
              flexShrink: 0,
              transform: `scale(${circleScale})`,
              transformOrigin: 'center center',
              opacity: 0,
              animation:
                'mktScaleIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s forwards',
            }}
          >
            {ORBITS.map((o) => (
              <Orbit
                key={o.n}
                size={o.size}
                duration={o.duration}
                direction={o.direction}
                isCenter={o.n === 1}
                counter={count}
                avatars={AVATARS.filter((a) => a.orbit === o.n)}
              />
            ))}
          </div>
        </div>

        {/* LOGO TICKER */}
        <div
          className="mkt-ticker-wrap"
          style={{
            marginTop: '2rem',
            position: 'relative',
            overflow: 'hidden',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
            maskImage:
              'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
            opacity: 0,
            animation:
              'mktFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s forwards',
          }}
        >
          <div
            className="mkt-ticker"
            style={{
              display: 'flex',
              gap: 64,
              width: 'max-content',
              animation: 'mktTicker 20s linear infinite',
              padding: '2rem 0',
              alignItems: 'center',
            }}
          >
            {Array.from({ length: 4 })
              .flatMap(() => PARTNER_LOGOS)
              .map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    height: 44,
                    width: 'auto',
                    maxWidth: 160,
                    objectFit: 'contain',
                    opacity: 0.9,
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* -----------------------
   Orbit + avatars
------------------------*/
function Orbit({
  size,
  duration,
  direction,
  isCenter,
  counter,
  avatars,
}: {
  size: number
  duration: number
  direction: 'left' | 'right'
  isCenter: boolean
  counter: number
  avatars: (typeof AVATARS)[number][]
}) {
  const spinAnim = `mktSpin${direction === 'left' ? 'Left' : 'Right'} ${duration}s linear infinite`
  return (
    <div
      className="mkt-orbit"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        animation: spinAnim,
      }}
    >
      {/* Border overlay (coral DGL) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          padding: 1,
          background:
            'linear-gradient(180deg, rgba(254,87,82,0) 0%, rgba(254,87,82,1) 43%, rgba(254,87,82,0) 100%)',
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />

      {/* Center content (only on innermost orbit) */}
      {isCenter && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `mktSpin${direction === 'left' ? 'Right' : 'Left'} ${duration}s linear infinite`,
            textAlign: 'center',
            color: '#fff',
            width: '80%',
          }}
        >
          <div
            style={{
              fontFamily: '"Urbanist", sans-serif',
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: '-2px',
              color: '#fe5752',
            }}
          >
            {counter}+
          </div>
          <div
            style={{
              fontFamily: '"Urbanist", sans-serif',
              fontSize: 15,
              fontWeight: 600,
              marginTop: 10,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Clients satisfaits
          </div>
        </div>
      )}

      {/* Avatars */}
      {avatars.map((a, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: a.size,
            height: a.size,
            marginLeft: -a.size / 2,
            marginTop: -a.size / 2,
            transform: `rotate(${a.angle}deg) translate(${a.radius}px) rotate(-${a.angle}deg)`,
            opacity: 0,
            animation: `mktAvatarIn 0.9s cubic-bezier(0.22,1,0.36,1) ${a.delay}s forwards`,
          }}
        >
          {/* Counter-rotate wrapper so avatar stays upright */}
          <div
            style={{
              width: '100%',
              height: '100%',
              animation: `mktSpin${direction === 'left' ? 'Right' : 'Left'} ${duration}s linear infinite`,
            }}
          >
            <img
              src={a.url}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: a.objectFit ?? 'cover',
                objectPosition: a.objectPosition ?? 'center',
                borderRadius:
                  a.shape === 'square' ? (a.radius_px ?? 20) : '50%',
                boxShadow: `0 0 30px 5px ${a.glow}`,
                background: a.kind === 'logo' ? '#fff' : '#002329',
                padding: a.kind === 'logo' ? 8 : 0,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* -----------------------
   Styles inline
------------------------*/
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Urbanist:wght@500;600;700&display=swap');

@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes mktBorderRotate {
  from { --border-angle: 0deg; }
  to   { --border-angle: 360deg; }
}

@keyframes mktSpinLeft {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes mktSpinRight {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes mktTicker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes mktFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes mktFadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes mktScaleIn {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes mktAvatarIn {
  from {
    opacity: 0;
    filter: blur(8px);
    scale: 0.3;
  }
  to {
    opacity: 1;
    filter: blur(0);
    scale: 1;
  }
}

.mkt-app { animation: mktFadeDown 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }

.mkt-nav-link {
  position: relative;
  color: rgba(255,255,255,0.75);
  font-family: "Inter", sans-serif;
  font-size: 15px;
  font-weight: 400;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 200ms;
}
.mkt-nav-link:hover { color: #fff; }
.mkt-nav-link-white { color: #fff; font-weight: 500; }

.mkt-nav-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.mkt-nav-link:hover::after { transform: scaleX(1); }

.mkt-btn-border-wrap {
  position: relative;
  display: inline-block;
  border-radius: 50px;
  padding: 3px;
}
.mkt-btn-border-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 3px;
  border-radius: inherit;
  background: conic-gradient(from var(--border-angle), #fe5752, #002329, #fe5752, #002329, #fe5752);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: mktBorderRotate 3s linear infinite;
  pointer-events: none;
}

.mkt-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}
.mkt-btn-primary {
  background: #002329;
  color: #fff;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 50px;
}
.mkt-btn-start {
  background: #002329;
  color: #fff;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 50px;
}
.mkt-btn-label { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 6px; }
.mkt-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #fe5752;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
  z-index: 1;
}
.mkt-btn-primary::after { transform: translateX(-100%); }
.mkt-btn-primary:hover::after { transform: translateX(0); }
.mkt-btn-start::after { transform: translateX(100%); }
.mkt-btn-start:hover::after { transform: translateX(0); }

.mkt-cursor { animation: mktBlink 1s steps(2) infinite; }
@keyframes mktBlink { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
`
