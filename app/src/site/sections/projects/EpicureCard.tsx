import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte navy « Epicure Social Club, Pilates Reformer » : a gauche le
 * formulaire natif de la campagne qui se remplit champ par champ, a droite
 * les deux resultats et les deux audiences testees.
 */

const FIELDS = ['Prénom', 'Téléphone']

const TILES = [
  { value: 'x5,8', label: 'ROAS' },
  { value: '+60 %', label: 'de leads' },
]

const AUDIENCES = ['Audience Avatar', 'Audience Broad']

export default function EpicureCard() {
  const { from } = useEnter()

  return (
    <ProjectCard slug="epicure-pilates" tone="dark">
      <div className="grid h-full grid-cols-2 items-center gap-2.5">
        <motion.div
          className="rounded-xl bg-white/8 p-2.5 ring-1 ring-white/10 backdrop-blur-[2px]"
          initial={from({ opacity: 0, y: 14 }, { opacity: 1, y: 0 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="font-mono text-[9px] tracking-wide text-white/50 uppercase">
            Formulaire
          </p>
          <div className="mt-2 space-y-1.5">
            {FIELDS.map((field, index) => (
              <motion.span
                key={field}
                className="flex h-7 items-center rounded-lg bg-white/90 px-2 text-[10px] leading-none text-neutral-500"
                initial={from({ opacity: 0, x: -10 }, { opacity: 1, x: 0 })}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: 0.25 + index * 0.12 }}
              >
                {field}
              </motion.span>
            ))}
          </div>
          <motion.span
            className="bg-primary mt-2 flex h-7 items-center justify-center rounded-lg px-2 text-center text-[10px] leading-none font-semibold text-white"
            initial={from({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            Réserver ma séance
          </motion.span>
        </motion.div>

        <div className="space-y-2.5">
          {TILES.map((tile, index) => (
            <motion.div
              key={tile.label}
              className="rounded-xl bg-white/8 px-2.5 py-2 ring-1 ring-white/10"
              initial={from({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, delay: 0.35 + index * 0.12 }}
            >
              <p className="text-[15px] leading-5 font-semibold text-white">
                {tile.value}
              </p>
              <p className="mt-0.5 truncate font-mono text-[9px] tracking-wide text-white/50 uppercase">
                {tile.label}
              </p>
            </motion.div>
          ))}

          <div className="space-y-1.5">
            {AUDIENCES.map((audience, index) => (
              <motion.span
                key={audience}
                className="flex items-center gap-1.5 rounded-full bg-white/8 px-2 py-1.5 ring-1 ring-white/10"
                initial={from({ opacity: 0, x: 10 }, { opacity: 1, x: 0 })}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <span
                  className={`block size-1.5 shrink-0 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-white/40'
                  }`}
                />
                <span className="truncate text-[10px] leading-none text-white/70">
                  {audience}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </ProjectCard>
  )
}
