import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { asset } from '@/lib/utils'

const BLOCK_1_FEATURES = [
  {
    icon: 'icon-1.svg',
    title: 'Manage payments, invoices, and settlements',
    desc: 'Track every transaction, payout, and financial flow in one secure dashboard.',
  },
  {
    icon: 'icon-2.svg',
    title: 'Reduce manual work across finance teams',
    desc: 'Automate reconciliation, reporting, approvals, and recurring payment processes.',
  },
  {
    icon: 'icon-3.svg',
    title: 'Monitor revenue, risk, and cash flow in real time',
    desc: 'Get live visibility into financial performance, user activity, and transaction trends.',
  },
]

const BLOCK_2_FEATURES = [
  {
    icon: 'icon-4.svg',
    title: 'A complete platform for payments and wallets',
    desc: 'Build and manage digital finance tools without complex internal infrastructure.',
  },
  {
    icon: 'icon-5.svg',
    title: 'Launch banking and payment experiences faster',
    desc: 'Create user accounts, payment flows, card logic, and transaction systems at scale.',
  },
  {
    icon: 'icon-6.svg',
    title: 'Analyze, optimize, and control financial performance',
    desc: 'Use real-time data to improve conversion, reduce risk, and increase operational efficiency.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Payment infrastructure',
    desc: 'Payment flows, wallets, transactions, payouts',
  },
  {
    n: '2',
    title: 'Financial automation logic',
    desc: 'Invoices, reconciliation, recurring payments',
  },
  {
    n: '3',
    title: 'Risk & compliance setup',
    desc: 'KYC flows, fraud rules, transaction monitoring',
  },
]

const BARS = [
  { l: "'20", h: 45, active: false },
  { l: "'19", h: 55, active: false },
  { l: "'18", h: 65, active: false },
  { l: "'17", h: 95, active: true },
  { l: "'16", h: 60, active: false },
  { l: "'15", h: 40, active: false },
  { l: "'14", h: 70, active: false },
  { l: "'13", h: 50, active: false },
]

export default function FintechPlatform() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMove = (e: React.MouseEvent) => {
    const el = gridRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    el.style.setProperty('--ma', '1')
  }

  const handleEnter = () => {
    gridRef.current?.style.setProperty('--ma', '1')
  }

  const handleLeave = () => {
    gridRef.current?.style.setProperty('--ma', '0')
  }

  return (
    <section
      style={{
        background: '#F0EFE9',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      {/* Top decorative SVG with cursor-follow highlight */}
      <div
        ref={gridRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          width: '100%',
          ['--mx' as any]: '50%',
          ['--my' as any]: '50%',
          ['--ma' as any]: '0',
        }}
      >
        {/* Base low-opacity layer */}
        <img
          src={asset('top-2.svg')}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            opacity: 0.15,
          }}
        />
        {/* Cursor spotlight radial mask -> inner green mask svg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 'var(--ma)' as any,
            transition: 'opacity 280ms ease',
            maskImage:
              'radial-gradient(180px 180px at var(--mx) var(--my), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage:
              'radial-gradient(180px 180px at var(--mx) var(--my), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0) 75%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#86E95C',
              maskImage: `url("${asset('top-2.svg')}")`,
              WebkitMaskImage: `url("${asset('top-2.svg')}")`,
              maskSize: '100% auto',
              WebkitMaskSize: '100% auto',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'top center',
              WebkitMaskPosition: 'top center',
              filter: 'drop-shadow(0 0 8px rgba(8,52,0,0.45))',
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          textAlign: 'center',
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 2.5rem) 0',
          marginBottom: 'clamp(2.5rem, 5vw, 3.75rem)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(0,0,0,0.20)',
            borderRadius: '9px',
            padding: '7px 14px',
            marginBottom: '1.25rem',
            background: 'transparent',
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 400,
              color: '#083400',
            }}
          >
            Our Products
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: 'center',
            color: '#083400',
            fontFamily: '"Inter Tight", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 4.0625rem)',
            fontWeight: 400,
            lineHeight: '107.5%',
            margin: 0,
          }}
        >
          <div>Fintech Platform</div>
          <div>
            for payments{' '}
            <span
              style={{
                display: 'inline-block',
                width: 'clamp(3.5rem, 7.3vw, 6.875rem)',
                height: 'clamp(2.3rem, 4.8vw, 4.5rem)',
                borderRadius: '6px',
                overflow: 'hidden',
                verticalAlign: 'middle',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                whileInView={{ x: '0%' }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.75,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ width: '100%', height: '100%' }}
              >
                <img
                  src={asset('section-2-title.png')}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </motion.div>
            </span>
          </div>
          <div>and managing finance</div>
        </motion.h2>
      </div>

      {/* Rows container */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          margin: '0 auto',
          width: '100%',
          maxWidth: '75rem',
          padding: '0 clamp(1rem, 4vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(3rem, 6vw, 5rem)',
        }}
      >
        {/* Block 1 : text left + GreenCard1 right */}
        <div
          style={{
            display: 'flex',
            flexDirection: narrow ? 'column' : 'row',
            gap: narrow ? '2.5rem' : 'clamp(2rem, 11vw, 11.25rem)',
            alignItems: narrow ? 'stretch' : 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, paddingTop: '0.5rem' }}>
            <TextColumn
              title="Automate financial operations"
              features={BLOCK_1_FEATURES}
            />
          </div>
          <GreenCard1 />
        </div>

        {/* Block 2 : GreenCard2 left + text right (reversed) */}
        <div
          style={{
            display: 'flex',
            flexDirection: narrow ? 'column' : 'row-reverse',
            gap: narrow ? '2.5rem' : 'clamp(2rem, 11vw, 11.25rem)',
            alignItems: narrow ? 'stretch' : 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, paddingTop: '0.5rem' }}>
            <TextColumn
              title="Digital Finance with Secure Infrastructure"
              features={BLOCK_2_FEATURES}
            />
          </div>
          <GreenCard2 />
        </div>
      </div>
    </section>
  )
}

function TextColumn({
  title,
  features,
}: {
  title: string
  features: typeof BLOCK_1_FEATURES
}) {
  return (
    <>
      <h3
        style={{
          color: '#083400',
          fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
          fontWeight: 400,
          lineHeight: '110%',
          margin: 0,
          marginBlockEnd: '2.8125rem',
        }}
      >
        {title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.875rem' }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: 'flex',
              gap: '1.3125rem',
              alignItems: 'flex-start',
            }}
          >
            <img
              src={asset(f.icon)}
              alt=""
              style={{
                width: '1.5rem',
                height: '1.5rem',
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  color: '#0F0F0F',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1.25,
                  marginBottom: '0.1875rem',
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  color: '#0F0F0F',
                  opacity: 0.55,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.3,
                }}
              >
                {f.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA row */}
      <div
        style={{
          display: 'flex',
          gap: '0.625rem',
          alignItems: 'center',
          marginTop: '2.8125rem',
          flexWrap: 'wrap',
        }}
      >
        <LearnMoreGreen />
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'transparent',
            color: '#083400',
            fontSize: '0.875rem',
            fontWeight: 500,
            height: '2.375rem',
            padding: '0 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #86EA5D',
            cursor: 'pointer',
            transition: 'border-color 200ms',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#6dd145')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = '#86EA5D')}
        >
          Try for free
        </button>
      </div>
    </>
  )
}

function LearnMoreGreen() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: hover ? '#74d84a' : '#86E95C',
        color: '#083400',
        fontSize: '0.875rem',
        fontWeight: 500,
        height: '2.375rem',
        padding: '0 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 200ms ease',
      }}
    >
      Learn more
      <span
        style={{
          position: 'relative',
          width: '10px',
          height: '10px',
          overflow: 'hidden',
          display: 'inline-block',
        }}
      >
        <ArrowSVG
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: hover ? 'translate(140%, -140%)' : 'translate(0,0)',
            transition: 'transform 420ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />
        <ArrowSVG
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: hover ? 'translate(0,0)' : 'translate(-140%, 140%)',
            transition: 'transform 420ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />
      </span>
    </button>
  )
}

function ArrowSVG({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={style}
    >
      <path
        d="M0.530273 8.75L8.53027 0.75M8.53027 0.75H0.530273M8.53027 0.75V8.75"
        stroke="#083400"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/* ==============================
   GREEN CARD 1 : Chart mockup
============================== */
function GreenCard1() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '31rem',
        aspectRatio: '496 / 598',
        flexShrink: 0,
        borderRadius: '6px',
        background: 'linear-gradient(0deg, #DFEFDC 0%, #D1E8CB 100%)',
        boxShadow: 'inset 0 4px 54px 7px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Chart card */}
      <div
        style={{
          position: 'absolute',
          top: '6.35%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          width: '77%',
          height: '74%',
          borderRadius: '14px',
          background: 'linear-gradient(90deg, #F9F4EF 0%, #F9F8F7 100%)',
          boxShadow: '0 34px 54px 2px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4.07% 6.28%',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: '28.8%',
              height: '8px',
              background: 'rgba(0,0,0,0.08)',
              borderRadius: '4px',
            }}
          />
          <div style={{ display: 'flex', gap: '4px' }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.22)',
              }}
            />
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.22)',
              }}
            />
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.22)',
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: '6.3% 9.16% 5.4%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(0.875rem,1.4vw,1.125rem)',
              fontWeight: 300,
              color: 'rgba(0,0,0,0.45)',
              marginBottom: '0.375rem',
            }}
          >
            Total on 2026
          </div>
          <div
            style={{
              fontSize: 'clamp(1.5rem,2.5vw,2rem)',
              fontWeight: 400,
              color: '#111111',
              letterSpacing: '-0.5px',
              marginBottom: '0.5rem',
            }}
          >
            $2.222,65
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <span style={{ color: '#6AC36E' }}>▲</span>
            <span style={{ color: '#6AC36E' }}>+$2.222,65 (100%)</span>
            <span style={{ color: '#909DA2' }}>- 2026</span>
          </div>

          {/* Bar chart */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              position: 'relative',
            }}
          >
            {BARS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${b.h}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  flex: 1,
                  borderRadius: '3px 3px 0 0',
                  background: b.active ? '#4A7C59' : 'rgba(0,0,0,0.10)',
                }}
              />
            ))}
            {/* Labels row */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                gap: '10px',
                pointerEvents: 'none',
              }}
            >
              {BARS.map((b, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(0,0,0,0.40)',
                    textAlign: 'center',
                  }}
                >
                  {b.l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom images */}
      <img
        src={asset('block-1-1.png')}
        alt=""
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-100%)',
          width: '51%',
          height: 'auto',
          objectFit: 'fill',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <img
        src={asset('block-1-2.png')}
        alt=""
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-2%)',
          width: '49%',
          height: 'auto',
          objectFit: 'fill',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* ==============================
   GREEN CARD 2 : Steps mockup
============================== */
function GreenCard2() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '31rem',
        aspectRatio: '496 / 598',
        flexShrink: 0,
        borderRadius: '6px',
        background: 'linear-gradient(0deg, #DFEFDC 0%, #D1E8CB 100%)',
        boxShadow: 'inset 0 4px 54px 7px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Bottom image strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <img
          src={asset('block-2-1.png')}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '19.6%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Steps card */}
      <div
        style={{
          position: 'absolute',
          top: '6.35%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          width: '81%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.n}
            style={{
              width: '100%',
              height: '82px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #EFF9F0 0%, #F7F9F7 100%)',
              boxShadow: '0 34px 54px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0 1.25rem',
            }}
          >
            <div
              style={{
                width: '1.323rem',
                height: '1.323rem',
                borderRadius: '50%',
                background: '#D1E9CE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 500,
                color: '#168930',
                flexShrink: 0,
              }}
            >
              {s.n}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: '#205519',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14px',
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  color: '#8C8C8C',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.12px',
                  marginTop: '2px',
                }}
              >
                {s.desc}
              </div>
            </div>
            <div
              style={{
                width: '1.625rem',
                height: '1.625rem',
                borderRadius: '50%',
                background: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Check size={14} color="#fff" strokeWidth={3} />
            </div>
          </div>
        ))}

        {/* Final card */}
        <div
          style={{
            width: '100%',
            height: '82px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 34px 54px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1.25rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#0F0F0F',
            textAlign: 'center',
          }}
        >
          Everything ready for fintech operations.
        </div>
      </div>
    </div>
  )
}
