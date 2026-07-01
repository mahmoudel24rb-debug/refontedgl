import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { asset } from '@/lib/utils'

export default function Hero() {
  const [hover, setHover] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '32rem',
        overflow: 'hidden',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      {/* Background image */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'linear' }}
      >
        <img
          src={asset('hero-back.jpg')}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </motion.div>

      {/* Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 40%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'rgba(0,0,0,0.25)',
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(6rem, 12vh, 7.5rem)',
          left: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 10,
          maxWidth: 'min(38.75rem, calc(100vw - 2rem))',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Inter Tight", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.125rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          Agence digitale à Tours
          <br />
          & experte en acquisition en ligne
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: '1.25rem',
            maxWidth: 'min(31.25rem, 100%)',
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.60)',
          }}
        >
          Basée à Tours, DGL Agency est une agence digitale spécialisée en SEO,
          publicité Google Ads & Meta Ads, et automatisation marketing. Nous
          aidons les TPE et PME à développer leur visibilité et générer des
          leads qualifiés.
        </motion.p>
      </div>

      {/* Bottom-right buttons (hidden on narrow) */}
      {!isNarrow && (
        <div
          className="hero-buttons"
          style={{
            position: 'absolute',
            bottom: 'clamp(6rem, 12vh, 7.5rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <motion.button
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.7 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              height: '38px',
              padding: '13px 19.2px',
              gap: '10px',
              borderRadius: '9px',
              border: '1px solid rgba(250,250,250,0.20)',
              background: '#FFF',
              color: '#111111',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            Audit gratuit
            <span
              style={{
                position: 'relative',
                width: '14px',
                height: '14px',
                display: 'inline-block',
                overflow: 'hidden',
              }}
            >
              <img
                src={asset('arrow-right.svg')}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '14px',
                  height: '14px',
                  transform: hover ? 'translateX(200%)' : 'translateX(0)',
                  transition: 'transform 500ms cubic-bezier(0.65,0,0.35,1)',
                }}
              />
              <img
                src={asset('arrow-right.svg')}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '14px',
                  height: '14px',
                  transform: hover ? 'translateX(0)' : 'translateX(-200%)',
                  transition: 'transform 500ms cubic-bezier(0.65,0,0.35,1)',
                }}
              />
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 200ms',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseOut={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')
            }
          >
            Nos services
          </motion.button>
        </div>
      )}

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          height: '70px',
          display: 'grid',
          gridTemplateColumns: isNarrow ? '1fr' : '1fr auto 1fr',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          padding: '0 clamp(1rem, 3vw, 2rem)',
          justifyItems: isNarrow ? 'center' : undefined,
        }}
      >
        {/* Animated top border progress */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '25%' }}
          transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '-1px',
            left: 0,
            height: '1px',
            background: 'rgba(255,255,255,0.55)',
          }}
        />

        {/* Left text (hidden on narrow) */}
        {!isNarrow && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '2.5px',
              color: 'rgba(255,255,255,0.40)',
            }}
          >
            SEO · GOOGLE ADS · META ADS · AUTOMATION
          </span>
        )}

        {/* Center */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            01 / 04
          </span>
          <span
            style={{
              width: '1px',
              height: '14px',
              background: 'rgba(255,255,255,0.20)',
            }}
          />
          <button
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '1.5px',
              color: 'rgba(255,255,255,0.55)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.90)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')
            }
          >
SUIVANT
          </button>
        </div>

        {/* Right scroll text (hidden on narrow) */}
        {!isNarrow && (
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '2.5px',
              color: 'rgba(255,255,255,0.40)',
              justifySelf: 'end',
            }}
          >
DÉCOUVRIR NOS SERVICES
          </motion.span>
        )}
      </motion.div>
    </section>
  )
}
