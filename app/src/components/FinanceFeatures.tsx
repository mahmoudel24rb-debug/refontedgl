import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { asset } from '@/lib/utils'

const CARDS = [
  {
    bg: 'back-3-1.jpg',
    word1: 'Sur',
    word2: 'Mesure',
    desc: "Fini les stratégies génériques. On construit chaque plan aligné avec vos objectifs business, votre secteur et votre cible, pas ceux du voisin.",
  },
  {
    bg: 'back-3-2.jpg',
    word1: 'Vrais',
    word2: 'KPIs',
    desc: "Priorité aux vrais indicateurs : leads qualifiés, conversions, chiffre d'affaires et ROI. Pas de chiffres flatteurs sans impact business.",
  },
  {
    bg: 'back-3-3.jpg',
    word1: 'Toujours',
    word2: 'Optimisé',
    desc: 'Chaque campagne bénéficie d\'un suivi long terme : optimisation continue, itérations et reporting personnalisé pour chaque client.',
  },
]

export default function FinanceFeatures() {
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
        padding: '115px 18px 18px',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <div style={{ width: '100%', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 660px',
            gap: narrow ? '1.5rem' : 'clamp(2rem, 6vw, 6rem)',
            alignItems: narrow ? 'flex-start' : 'end',
            marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
          }}
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: narrow ? 'flex-start' : 'space-between',
              alignItems: 'flex-start',
              gap: narrow ? '1rem' : undefined,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(0,0,0,0.20)',
                borderRadius: '9px',
                padding: '7px 14px',
                background: 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 400,
                  color: '#002329',
                }}
              >
La différence DGL
              </span>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: '30rem',
                color: '#0F0F0F',
                opacity: 0.55,
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: '21.5px',
              }}
            >
              Nous allions expertise stratégique, vision ROIste et
              accompagnement personnalisé. Découvrez ce qui nous distingue des
              agences généralistes.
            </p>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '660px',
              maxWidth: '100%',
              justifySelf: narrow ? 'flex-start' : 'end',
              color: '#002329',
              fontSize: 'clamp(2rem, 4.3vw, 4.0625rem)',
              fontWeight: 400,
              lineHeight: 1.169,
              margin: 0,
            }}
          >
Des résultats concrets, jamais des promesses vides
          </motion.h2>
        </div>

        {/* Cards stack */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          {CARDS.map((c, i) => (
            <FeatureCard key={i} data={c} narrow={narrow} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  data,
  narrow,
}: {
  data: (typeof CARDS)[number]
  narrow: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })
  const word1X = useTransform(scrollYProgress, [0, 1], ['0vw', '-18vw'])
  const word2X = useTransform(scrollYProgress, [0, 1], ['0vw', '18vw'])

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        aspectRatio: narrow ? '4 / 5' : '1820 / 720',
        background: '#0a0a0a',
        isolation: 'isolate',
      }}
    >
      {/* Background image */}
      <img
        src={asset(data.bg)}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* Words */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '32px',
          right: '32px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <motion.span
          style={{
            x: word1X,
            color: '#FFFFFF',
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: '-1px',
            display: 'inline-block',
            willChange: 'transform',
          }}
        >
          {data.word1}
        </motion.span>
        <motion.span
          style={{
            x: word2X,
            color: '#FFFFFF',
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: '-1px',
            display: 'inline-block',
            willChange: 'transform',
          }}
        >
          {data.word2}
        </motion.span>
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          left: '32px',
          right: '32px',
          bottom: '32px',
          zIndex: 3,
          width: '330px',
          maxWidth: 'calc(100% - 64px)',
        }}
      >
        <p
          style={{
            color: '#FFFFFF',
            fontSize: '0.8125rem',
            fontWeight: 400,
            lineHeight: 1.45,
            margin: 0,
            opacity: 0.8,
          }}
        >
          {data.desc}
        </p>
      </div>
    </div>
  )
}
