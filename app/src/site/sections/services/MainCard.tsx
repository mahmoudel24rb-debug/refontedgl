import { motion } from 'framer-motion'
import CtaButton from '../../ui/CtaButton'
import { CAMPAIGN_DASHBOARD, SERVICES_BENTO } from '../../content'
import { useEnter, VIEWPORT } from './shared'

/**
 * Carte navy « Publicite digitale » : mockup navigateur et tableau de bord de
 * campagne. La sequence d'entree reprend celle du template (fenetre, pastilles,
 * barre d'URL, puis contenu en cascade de .3 s a .9 s).
 */

const KPI_BARS = ['82%', '46%', '68%', '55%']
const FADE_DOWN = 'linear-gradient(to bottom, #000 72%, transparent 100%)'

function CampaignDashboard() {
  const { from } = useEnter()

  return (
    <motion.div
      className="flex h-full flex-col bg-white px-4 pt-4"
      initial={from({ opacity: 0 }, { opacity: 1 })}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-primary/15 size-5 rounded-full" />
          <motion.span
            className="block h-2 rounded-full bg-neutral-200"
            initial={from({ opacity: 0, width: 0 }, { opacity: 1, width: 112 })}
            whileInView={{ opacity: 1, width: 112 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </div>
        <motion.span
          className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[9px] font-medium"
          initial={from({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {CAMPAIGN_DASHBOARD.badge}
        </motion.span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {CAMPAIGN_DASHBOARD.kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="rounded-md bg-neutral-100 p-2"
            initial={from({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.04 }}
          >
            <p className="text-[8px] font-medium tracking-wide text-neutral-500 uppercase">
              {kpi.label}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-neutral-800">
              {kpi.value}
            </p>
            <span className="mt-1.5 block h-1 rounded-full bg-neutral-200">
              <motion.span
                className="bg-primary/70 block h-1 rounded-full"
                style={{
                  width: KPI_BARS[index % KPI_BARS.length],
                  transformOrigin: 'left center',
                }}
                initial={from({ scaleX: 0 }, { scaleX: 1 })}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.04 }}
              />
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-3 flex-1 rounded-md bg-neutral-50 p-3 ring-1 ring-neutral-100 ring-inset"
        initial={from({ opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <span className="block h-1.5 w-20 rounded-full bg-neutral-200" />
        <svg
          viewBox="0 0 220 70"
          className="mt-2 h-auto w-full"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dgl-sb-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FE5752" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 58 C 26 52, 34 38, 56 36 S 92 46, 114 32 S 150 12, 174 16 S 206 6, 220 8 L 220 70 L 0 70 Z"
            fill="url(#dgl-sb-area)"
          />
          <path
            d="M0 58 C 26 52, 34 38, 56 36 S 92 46, 114 32 S 150 12, 174 16 S 206 6, 220 8"
            stroke="#FE5752"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="220" cy="8" r="3" fill="#FE5752" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

function BrowserMockup() {
  const { from } = useEnter()

  return (
    <motion.div
      className="h-full w-full overflow-hidden rounded-lg bg-[#E6E6E6] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]"
      initial={from({ y: 30 }, { y: 0 })}
      whileInView={{ y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <motion.span
          className="flex items-center gap-1.5"
          initial={from({ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 })}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <span className="block size-2 rounded-full bg-[#F45B4F]" />
          <span className="block size-2 rounded-full bg-[#F5BE3F]" />
          <span className="block size-2 rounded-full bg-[#4FBF5F]" />
        </motion.span>
        <motion.span
          className="mx-auto block h-2.5 w-1/2 rounded-full bg-white/90"
          initial={from({ opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1 })}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        <motion.span
          className="block size-2 rounded-full bg-black/10"
          initial={from({ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 })}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      </div>
      <CampaignDashboard />
    </motion.div>
  )
}

export default function MainCard() {
  const { from } = useEnter()

  return (
    <div className="bg-ink relative col-span-19 flex min-h-[520px] flex-col overflow-hidden rounded-2xl p-4 lg:col-span-6">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.50) 1px, transparent 1px)',
          backgroundSize: '9px 9px',
          maskImage: 'linear-gradient(to bottom, transparent 48%, #000 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 48%, #000 100%)',
        }}
        initial={from({ opacity: 0 }, { opacity: 0.2 })}
        whileInView={{ opacity: 0.2 }}
        viewport={VIEWPORT}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="relative min-h-[260px] flex-1 overflow-hidden"
        style={{ maskImage: FADE_DOWN, WebkitMaskImage: FADE_DOWN }}
        initial={from({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <BrowserMockup />
      </motion.div>
      <div className="relative mt-6">
        <h3 className="text-base font-medium text-white">
          {SERVICES_BENTO.main.title}
        </h3>
        <p className="mt-4 text-base text-neutral-400">
          {SERVICES_BENTO.main.text}
        </p>
        <div className="mt-6">
          <CtaButton
            label={SERVICES_BENTO.main.cta.label}
            href={SERVICES_BENTO.main.cta.to}
          />
        </div>
      </div>
    </div>
  )
}
