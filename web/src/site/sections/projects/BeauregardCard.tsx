'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte claire « Parc de Beauregard, Kid Fitness » : une jauge circulaire qui
 * se remplit autour du budget quotidien, et une pile de notifications de
 * prospects qui tourne toutes les 3 s (meme mecanique que ReportingCard).
 */

const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Part de l'anneau peinte en corail : 70 % du budget consomme. */
const FILLED = 0.7

const NOTIFICATIONS = [
  { label: 'Portes ouvertes', cost: '1,23 €' },
  { label: 'Stages de février', cost: '4,13 €' },
  { label: 'Anniversaires', cost: '2,32 €' },
]

/** Decalage vertical et reduction d'echelle entre deux cartes de la pile. */
const OFFSET = 9
const SCALE_FACTOR = 0.06

function Gauge() {
  const { from, reduced } = useEnter()

  return (
    <div className="relative size-[104px] shrink-0">
      <svg viewBox="0 0 84 84" aria-hidden="true" className="size-full">
        <circle
          cx="42"
          cy="42"
          r={RADIUS}
          fill="none"
          stroke="#EBE9E1"
          strokeWidth="11"
        />
        <g transform="rotate(-90 42 42)">
          <motion.circle
            cx="42"
            cy="42"
            r={RADIUS}
            fill="none"
            stroke="#FE5752"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={from(
              { strokeDashoffset: CIRCUMFERENCE },
              { strokeDashoffset: CIRCUMFERENCE * (1 - FILLED) },
            )}
            whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - FILLED) }}
            viewport={VIEWPORT}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.1, delay: 0.25, ease: 'easeInOut' }
            }
          />
        </g>
      </svg>
      <motion.span
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={from({ opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <span className="text-ink text-[16px] leading-5 font-semibold">
          20 €
        </span>
        <span className="font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
          par jour
        </span>
      </motion.span>
    </div>
  )
}

function LeadStack() {
  const { from, reduced } = useEnter()
  const [items, setItems] = useState(NOTIFICATIONS)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setItems((current) => {
        const next = [...current]
        const last = next.pop()
        if (last) next.unshift(last)
        return next
      })
    }, 3000)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <motion.div
      className="relative h-[74px] min-w-0 flex-1"
      initial={from({ opacity: 0, x: 14 }, { opacity: 1, x: 0 })}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className="ring-ink/8 absolute inset-x-0 flex h-[62px] flex-col justify-between rounded-xl bg-white p-2.5 shadow-[0_10px_28px_-16px_rgba(0,35,41,0.5)] ring-1"
          style={{ transformOrigin: 'top center' }}
          animate={{
            top: index * OFFSET,
            scale: 1 - index * SCALE_FACTOR,
            zIndex: items.length - index,
          }}
        >
          <span className="flex items-center gap-1.5">
            <span className="bg-primary/70 block size-1.5 shrink-0 rounded-full" />
            <span className="text-ink truncate text-[11px] leading-4 font-semibold">
              Nouveau prospect
            </span>
          </span>
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate font-mono text-[9px] tracking-wide text-neutral-500 uppercase">
              {item.label}
            </span>
            <span className="text-primary shrink-0 text-[11px] leading-4 font-semibold">
              {item.cost}
            </span>
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function BeauregardCard() {
  return (
    <ProjectCard slug="beauregard-kid-fitness">
      <div className="flex h-full items-center gap-3">
        <Gauge />
        <LeadStack />
      </div>
    </ProjectCard>
  )
}
