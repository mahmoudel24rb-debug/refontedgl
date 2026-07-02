import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { asset } from '@/lib/utils'

const TESTIMONIAL = {
  quote:
    "Grâce à DGL Agency, nos campagnes Google Ads et Meta Ads ont boosté les adhésions de notre salle. Le suivi est précis, les optimisations constantes, et les résultats clairement mesurables.",
  name: 'Hakim',
  role: 'Directeur, GYMFIT',
  avatar: 'client-1.jpg',
  logo: '/assets/logos/gymfit.webp',
  logoLabel: 'GYMFIT',
}

const MARQUEE_LOGOS: { src: string; alt: string }[] = [
  { src: '/assets/logos/oceades.webp', alt: 'Les Océades' },
  { src: '/assets/logos/gymfit.webp', alt: 'GYMFIT' },
  { src: '/assets/logos/beauregard.webp', alt: 'Beauregard' },
  { src: '/assets/logos/epicure.webp', alt: 'Epicure Social Club' },
  { src: '/assets/logos/ipms.webp', alt: 'IPMS' },
]

export default function Testimonials() {
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
        background: '#F6F6F6',
        padding: '85px 18px 60px',
        fontFamily: '"Inter Tight", sans-serif',
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
              border: '1px solid rgba(0,0,0,0.20)',
              borderRadius: '9px',
              padding: '7px 14px',
              background: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: 400,
              color: '#002329',
              width: 'auto',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Ils nous font confiance</span>
          </div>

          <p
            style={{
              color: '#0F0F0F',
              fontFamily: '"Sequel Sans", "Inter Tight", sans-serif',
              fontSize: '1rem',
              fontWeight: 405,
              lineHeight: '21.5px',
              width: '295px',
              maxWidth: '100%',
              margin: 0,
              opacity: 0.55,
            }}
          >
            Des témoignages concrets sur l'efficacité de nos campagnes SEO, Ads
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
            <div
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
                {/* Avatar */}
                <img
                  src={asset(TESTIMONIAL.avatar)}
                  alt={TESTIMONIAL.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    zIndex: 2,
                    position: 'relative',
                  }}
                />
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
                    fontFeatureSettings: '"liga" off, "clig" off',
                  }}
                >
                  {TESTIMONIAL.name}
                </div>
                <div
                  style={{
                    color: '#0F0F0F',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    lineHeight: '130%',
                    letterSpacing: '0.2px',
                    opacity: 0.55,
                    fontFeatureSettings: '"liga" off, "clig" off',
                  }}
                >
                  {TESTIMONIAL.role}
                </div>
              </div>
            </div>

            {/* Company logo */}
            <img
              src={
                TESTIMONIAL.logo.startsWith('http')
                  ? TESTIMONIAL.logo
                  : asset(TESTIMONIAL.logo)
              }
              alt={TESTIMONIAL.logoLabel}
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
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
          <p
            style={{
              color: '#002329',
              fontFeatureSettings: '"liga" off, "clig" off',
              fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: '110%',
              width: narrow ? '100%' : '700px',
              maxWidth: '100%',
              margin: 0,
            }}
          >
            {TESTIMONIAL.quote}
          </p>

          {/* Arrows */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-start',
              marginTop: '1rem',
            }}
          >
            <ArrowButton src="arrow-l.svg" alt="Previous" />
            <ArrowButton src="arrow-r.svg" alt="Next" />
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
            opacity: 0.7,
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
          src={l.src.startsWith('http') ? l.src : asset(l.src)}
          alt={l.alt}
          style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
        />
      ))}
    </div>
  )
}

function ArrowButton({ src, alt }: { src: string; alt: string }) {
  return (
    <button
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 8px 8px 0',
        opacity: 0.6,
        transition: 'opacity 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '0.6')}
      aria-label={alt}
    >
      <img src={asset(src)} alt={alt} width={28} height={14} />
    </button>
  )
}
