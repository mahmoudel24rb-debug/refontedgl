'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { asset } from '@/lib/utils'

// URLs http(s):// et paths absolus (/x) sont utilisés tels quels ;
// tout le reste (ex. 'quote.svg', 'client-1.jpg') passe par asset()
// qui les préfixe de /assets/
function resolveImg(src: string) {
  if (src.startsWith('http') || src.startsWith('/')) return src
  return asset(src)
}

interface Testimonial {
  quote: string
  name: string
  role: string
  avatar?: string
  logo?: string
  logoLabel?: string
}

// Les 3 témoignages du site dgl-agency.fr (Hakim, Samuel, Marion)
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Grâce à DGL Agency, nos campagnes Google Ads et Meta Ads ont boosté les adhésions de notre salle. Le suivi est précis, les optimisations constantes, et les résultats clairement mesurables.",
    name: 'Hakim',
    role: 'Directeur, GYMFIT',
    avatar: 'client-1.jpg',
    logo: '/assets/logos/gymfit.webp',
    logoLabel: 'GYMFIT',
  },
  {
    quote:
      'Depuis que nous avons confié notre stratégie digitale à DGL, notre site attire plus de visiteurs locaux et nous recevons deux fois plus de demandes de contact.',
    name: 'Samuel',
    role: 'Coach professionnel',
  },
  {
    quote:
      'Ils ont créé une stratégie complète pour nos réseaux sociaux et notre référencement. Des résultats impressionnants en seulement trois mois !',
    name: 'Marion',
    role: 'Artisane, Tours',
  },
]

const MARQUEE_LOGOS: { src: string; alt: string }[] = [
  { src: '/assets/logos/oceades.webp', alt: 'Les Océades' },
  { src: '/assets/logos/gymfit.webp', alt: 'GYMFIT' },
  { src: '/assets/logos/beauregard.webp', alt: 'Beauregard' },
  { src: '/assets/logos/epicure.webp', alt: 'Epicure Social Club' },
  { src: '/assets/logos/ipms.webp', alt: 'IPMS' },
]

// Les webp clients sont livrés en blanc → monochrome navy sur fond clair
const LOGO_FILTER =
  'brightness(0) invert(13%) sepia(21%) saturate(1600%) hue-rotate(140deg)'

export default function Testimonials() {
  const [narrow, setNarrow] = useState(false)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const t = TESTIMONIALS[active]

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Rotation auto toutes les 7 s — stoppée au premier clic,
  // jamais lancée si prefers-reduced-motion
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % TESTIMONIALS.length),
      7000,
    )
    return () => window.clearInterval(id)
  }, [paused])

  const go = (dir: 1 | -1) => {
    setPaused(true)
    setActive((a) => (a + dir + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section
      style={{
        background: '#F6F6F6',
        padding: '85px 18px 60px',
        fontFamily: '"Inter Tight", sans-serif',
        position: 'relative',
        borderRadius: '28px 28px 0 0',
        marginTop: -28,
        zIndex: 4,
      }}
    >
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '295px 1fr',
          gap: narrow ? '2rem' : 'clamp(2rem, 6vw, 6rem)',
          alignItems: 'flex-start',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
          padding: 0,
        }}
      >
        {/* LEFT column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '75px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(0,35,41,0.18)',
              borderRadius: '999px',
              padding: '7px 16px',
              background: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#002329',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fe5752',
              }}
            />
            <span>Ils nous font confiance</span>
          </div>

          <p
            style={{
              color: '#0F0F0F',
              fontSize: '1rem',
              fontWeight: 400,
              lineHeight: '21.5px',
              width: '295px',
              maxWidth: '100%',
              margin: 0,
              opacity: 0.55,
            }}
          >
            Des témoignages concrets sur l&apos;efficacité de nos campagnes SEO, Ads
            et stratégie digitale. Plus de 500 clients satisfaits nous font
            confiance pour leur acquisition.
          </p>
        </div>

        {/* RIGHT column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'flex-start',
            width: '100%',
            minWidth: 0,
          }}
        >
          {/* Meta row : person + logo */}
          <div
            style={{
              display: 'flex',
              alignItems: narrow ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              width: '100%',
              flexDirection: narrow ? 'column' : 'row',
            }}
          >
            {/* Person */}
            <motion.div
              key={`person-${t.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Quote circle */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '-14px',
                    zIndex: 1,
                  }}
                >
                  <img
                    src={asset('quote.svg')}
                    alt=""
                    style={{ width: '22px', height: '22px' }}
                  />
                </div>
                {/* Avatar : photo si dispo, sinon initiale sur navy */}
                {t.avatar ? (
                  <img
                    src={asset(t.avatar)}
                    alt={t.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      zIndex: 2,
                      position: 'relative',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#002329',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      zIndex: 2,
                      position: 'relative',
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Text wrapper */}
              <div style={{ marginLeft: '1.25rem' }}>
                <div
                  style={{
                    color: '#22282B',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    lineHeight: '130%',
                    letterSpacing: '0.24px',
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    color: '#0F0F0F',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    lineHeight: '130%',
                    letterSpacing: '0.2px',
                    opacity: 0.55,
                  }}
                >
                  {t.role}
                </div>
              </div>
            </motion.div>

            {/* Company logo (si dispo) */}
            {t.logo && (
              <img
                src={resolveImg(t.logo)}
                alt={t.logoLabel}
                style={{
                  height: '56px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: LOGO_FILTER,
                  opacity: 0.85,
                }}
              />
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'rgba(0,0,0,0.10)',
              width: '100%',
            }}
          />

          {/* Quote text */}
          <motion.p
            key={`quote-${t.name}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              color: '#002329',
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: '115%',
              width: narrow ? '100%' : '700px',
              maxWidth: '100%',
              margin: 0,
              minHeight: narrow ? undefined : '3.2em',
            }}
          >
            «&nbsp;{t.quote}&nbsp;»
          </motion.p>

          {/* Navigation : flèches + indicateur */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <NavButton onClick={() => go(-1)} label="Témoignage précédent">
              <ArrowLeft size={18} />
            </NavButton>
            <NavButton onClick={() => go(1)} label="Témoignage suivant">
              <ArrowRight size={18} />
            </NavButton>
            <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setPaused(true)
                    setActive(i)
                  }}
                  aria-label={`Voir le témoignage de ${item.name}`}
                  style={{
                    width: active === i ? '22px' : '7px',
                    height: '7px',
                    borderRadius: '999px',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background:
                      active === i ? '#fe5752' : 'rgba(0,35,41,0.20)',
                    transition:
                      'width 350ms cubic-bezier(0.22,0.61,0.36,1), background 250ms',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 4%, #000 14%, #000 86%, rgba(0,0,0,0.2) 96%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 4%, #000 14%, #000 86%, rgba(0,0,0,0.2) 96%, transparent 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'ts-scroll 38s linear infinite',
            opacity: 0.75,
            alignItems: 'center',
            willChange: 'transform',
          }}
        >
          <MarqueeHalf />
          <MarqueeHalf />
        </div>
      </div>
    </section>
  )
}

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: `1px solid ${hover ? '#fe5752' : 'rgba(0,35,41,0.20)'}`,
        background: hover ? '#fe5752' : 'transparent',
        color: hover ? '#fff' : '#002329',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 250ms ease',
      }}
    >
      {children}
    </button>
  )
}

function MarqueeHalf() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(3rem, 8vw, 7rem)',
        paddingRight: 'clamp(3rem, 8vw, 7rem)',
        flexShrink: 0,
      }}
    >
      {MARQUEE_LOGOS.map((l) => (
        <img
          key={l.alt}
          src={resolveImg(l.src)}
          alt={l.alt}
          style={{
            height: '44px',
            width: 'auto',
            objectFit: 'contain',
            filter: LOGO_FILTER,
          }}
        />
      ))}
    </div>
  )
}
