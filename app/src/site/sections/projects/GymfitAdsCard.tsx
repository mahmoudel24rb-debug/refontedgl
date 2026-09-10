import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte claire « GYMFIT, Meta Ads » : trois tuiles de KPI, une courbe corail
 * qui se dessine (pathLength) avec son aire degradee, puis la pastille du
 * rayon de ciblage dont le point pulse en boucle.
 */

const KPIS = [
  { value: '4,2x', label: 'ROAS' },
  { value: '0,78 €', label: 'par prospect' },
  { value: '+181 %', label: 'trafic' },
]

const CURVE =
  'M4 62 C 26 58, 40 48, 60 46 S 96 54, 118 38 S 152 16, 176 18 S 206 6, 216 5'

export default function GymfitAdsCard() {
  const { from, reduced } = useEnter()

  return (
    <ProjectCard slug="gymfit-meta-ads">
      <div className="flex h-full flex-col justify-center">
        <div className="grid grid-cols-3 gap-1.5">
          {KPIS.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              className="ring-ink/5 rounded-xl bg-white p-2 shadow-[0_8px_20px_-16px_rgba(0,35,41,0.6)] ring-1"
              initial={from({ opacity: 0, y: 10 }, { opacity: 1, y: 0 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
            >
              <p className="text-ink text-[12px] leading-4 font-semibold">
                {kpi.value}
              </p>
              <p className="mt-0.5 truncate text-[9px] tracking-wide text-neutral-500 uppercase">
                {kpi.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="ring-ink/5 relative mt-2 rounded-xl bg-white p-3 shadow-[0_10px_28px_-20px_rgba(0,35,41,0.6)] ring-1"
          initial={from({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.45, delay: 0.35 }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
              Inscriptions
            </span>
            <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[9px] leading-none font-semibold">
              90 jours
            </span>
          </div>
          <svg
            viewBox="0 0 220 70"
            className="mt-2 h-auto w-full"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="dgl-pb-ads-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FE5752" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${CURVE} L 216 70 L 4 70 Z`}
              fill="url(#dgl-pb-ads-area)"
              initial={from({ opacity: 0 }, { opacity: 1 })}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: 1 }}
            />
            <motion.path
              d={CURVE}
              stroke="#FE5752"
              strokeWidth="2.4"
              strokeLinecap="round"
              initial={from({ pathLength: 0 }, { pathLength: 1 })}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="216"
              cy="5"
              r="3.5"
              fill="#FE5752"
              initial={from({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 })}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.3, delay: 1.6 }}
              style={{ transformOrigin: '216px 5px', transformBox: 'fill-box' }}
            />
          </svg>
        </motion.div>

        <motion.span
          className="ring-ink/5 text-ink mt-3 inline-flex self-start items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] leading-none font-medium shadow-[0_10px_24px_-12px_rgba(0,35,41,0.6)] ring-1"
          initial={from({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 1.7 }}
        >
          <span className="relative flex size-2">
            {reduced ? null : (
              <motion.span
                className="bg-primary/50 absolute inset-0 rounded-full"
                animate={{ scale: [1, 2.4, 2.4], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="bg-primary relative block size-2 rounded-full" />
          </span>
          Rayon 15 km
        </motion.span>
      </div>
    </ProjectCard>
  )
}
