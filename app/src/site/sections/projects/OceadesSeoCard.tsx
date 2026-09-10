import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte claire « Les Oceades, SEO local » : un mini tableau mot-cle et
 * position, les lignes glissent depuis la gauche, puis la pastille de
 * croissance du trafic organique apparait.
 */

const ROWS = [
  { keyword: 'institut de beauté le mans', position: '1' },
  { keyword: 'soin visage le mans', position: '2' },
  { keyword: 'pilates reformer le mans', position: '3' },
]

export default function OceadesSeoCard() {
  const { from } = useEnter()

  return (
    <ProjectCard slug="oceades-seo">
      <div className="flex h-full flex-col justify-center">
        <motion.div
          className="ring-ink/5 overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_-22px_rgba(0,35,41,0.6)] ring-1"
          initial={from({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2">
            <span className="font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
              Mot-clé
            </span>
            <span className="font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
              Position
            </span>
          </div>
          {ROWS.map((row, index) => (
            <motion.div
              key={row.keyword}
              className="flex items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2.5 last:border-b-0"
              initial={from({ opacity: 0, x: -18 }, { opacity: 1, x: 0 })}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{
                duration: 0.45,
                delay: 0.25 + index * 0.15,
                ease: 'easeOut',
              }}
            >
              <span className="text-ink min-w-0 truncate text-[11px] leading-4">
                {row.keyword}
              </span>
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/12 text-[10px] leading-none font-semibold text-emerald-600">
                {row.position}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.span
          className="bg-primary mt-3 inline-flex self-center items-center rounded-full px-3 py-1.5 text-[10px] leading-none font-semibold whitespace-nowrap text-white shadow-[0_12px_26px_-14px_rgba(254,87,82,0.9)]"
          initial={from({ opacity: 0, y: 10, scale: 0.94 }, { opacity: 1, y: 0, scale: 1 })}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 0.85, ease: 'easeOut' }}
        >
          +182 % trafic organique
        </motion.span>
      </div>
    </ProjectCard>
  )
}
