'use client'

import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte claire « Les Oceades, campagne de Noel » : trois lignes de resultats,
 * chacune avec quatre barres corail qui montent en cascade, sur un flocon en
 * filigrane tres discret.
 */

interface Row {
  label: string
  note: string
  bars: number[]
}

const ROWS: Row[] = [
  { label: '+40 % ventes e-commerce', note: 'vs an dernier', bars: [38, 54, 72, 100] },
  { label: '58 prospects, 3,25 €', note: 'Bilan peau', bars: [30, 48, 66, 88] },
  { label: '173 prospects, 3,06 €', note: 'Pilates Reformer', bars: [44, 60, 78, 100] },
]

/** Flocon en filigrane : six branches simples, dessinees une seule fois. */
function Snowflake() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="text-ink pointer-events-none absolute top-0 right-1 size-16 opacity-[0.09]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <path d="M50 8 V92" />
          <path d="M50 14 L41 24 M50 14 L59 24" />
          <path d="M50 86 L41 76 M50 86 L59 76" />
        </g>
      ))}
    </svg>
  )
}

export default function OceadesNoelCard() {
  const { from } = useEnter()

  return (
    <ProjectCard slug="oceades-noel">
      <div className="relative flex h-full flex-col justify-center">
        <Snowflake />
        <div className="relative space-y-2">
          {ROWS.map((row, rowIndex) => (
            <motion.div
              key={row.label}
              className="ring-ink/5 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 shadow-[0_10px_24px_-20px_rgba(0,35,41,0.6)] ring-1"
              initial={from({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.45, delay: 0.1 + rowIndex * 0.14 }}
            >
              <span className="min-w-0">
                <span className="text-ink block truncate text-[12px] leading-4 font-semibold">
                  {row.label}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
                  {row.note}
                </span>
              </span>
              <span className="flex h-8 shrink-0 items-end gap-1">
                {row.bars.map((height, barIndex) => (
                  <motion.span
                    key={height}
                    className="bg-primary/80 block w-1.5 rounded-full"
                    style={{ height: `${height}%`, transformOrigin: 'bottom center' }}
                    initial={from({ scaleY: 0 }, { scaleY: 1 })}
                    whileInView={{ scaleY: 1 }}
                    viewport={VIEWPORT}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + rowIndex * 0.14 + barIndex * 0.07,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </ProjectCard>
  )
}
