import { useMemo, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { GoogleGIcon } from '../../ui/Icons'
import { SERVICES_BENTO } from '../../content'
import { BOX, useEnter } from './shared'

/**
 * Carte claire « Etre trouve sur Google » : la barre de recherche apparait, la
 * requete est tapee lettre par lettre, puis les resultats montent en cascade.
 */

const VIEW = { once: true, amount: 0.35 }

const SEARCH_BAR: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const RESULTS: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.14 } },
}

const GHOST_CARD: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const RESULT_CARD: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const CELL = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect x="3" y="3" width="90" height="90" rx="14" fill="none" stroke="rgba(0,35,41,0.07)" stroke-width="1"/></svg>',
)

/** Quadrillage fin de carres arrondis (carte Google). */
function GridBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${CELL}")`,
        backgroundSize: '96px 96px',
        backgroundPosition: '24px -18px',
        maskImage: 'linear-gradient(to bottom, #000 0%, transparent 92%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 92%)',
      }}
    />
  )
}

function MicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-neutral-400"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  )
}

export default function GoogleCard() {
  const google = SERVICES_BENTO.google
  const query = google.query
  const { reduced } = useEnter()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, VIEW)
  const [typed, setTyped] = useState(false)
  const done = typed || reduced
  const typing = inView && !reduced

  /* Une image cle par caractere : la largeur avance de 0,8 ch a chaque lettre. */
  const widths = useMemo(
    () => Array.from({ length: query.length + 1 }, (_, i) => `${0.8 * i}ch`),
    [query],
  )
  const times = useMemo(
    () => Array.from({ length: query.length + 1 }, (_, i) => i / query.length),
    [query],
  )

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-3 ${BOX}`}
    >
      <GridBackdrop />
      <h3 className="text-ink relative z-10 text-base font-medium">
        {google.title}
      </h3>

      <div className="relative z-10 mt-6">
        <motion.div
          className="ring-ink/5 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_10px_28px_-16px_rgba(0,35,41,0.5)] ring-1"
          variants={SEARCH_BAR}
          initial={reduced ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={VIEW}
        >
          <GoogleGIcon size={18} />
          <div className="relative flex min-w-0 items-center">
            {reduced ? (
              <span className="text-sm whitespace-nowrap text-neutral-500">
                {query}
              </span>
            ) : (
              <motion.span
                className="block overflow-hidden text-sm whitespace-nowrap text-neutral-500"
                initial={{ width: 0 }}
                animate={typing ? { width: widths } : { width: 0 }}
                transition={{ duration: 2.15, ease: 'linear', times }}
                onAnimationComplete={() => {
                  if (typing) setTyped(true)
                }}
              >
                {query}
              </motion.span>
            )}
            {done ? null : (
              <motion.span
                aria-hidden="true"
                className="bg-muted absolute top-0 -right-2 block h-4 w-px origin-top-left"
                animate={{ opacity: [0, 1, 1, 0], scaleY: [0.85, 1, 0.85] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  repeatDelay: 0.08,
                  ease: 'linear',
                }}
              />
            )}
          </div>
          <span className="flex-1" />
          <MicIcon />
        </motion.div>

        <motion.div
          className="relative mt-3"
          variants={RESULTS}
          initial={reduced ? 'visible' : 'hidden'}
          animate={done ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={GHOST_CARD}
            className="ring-ink/5 absolute inset-x-6 top-3 h-full rounded-xl bg-white ring-1"
          />
          <motion.div
            variants={GHOST_CARD}
            className="ring-ink/5 absolute inset-x-3 top-1.5 h-full rounded-xl bg-white ring-1"
          />
          <motion.div
            variants={RESULT_CARD}
            className="ring-ink/5 relative -rotate-[0.6deg] rounded-xl bg-white p-4 shadow-[0_16px_36px_-20px_rgba(0,35,41,0.55)] ring-1"
          >
            <div className="flex items-center gap-3">
              <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                D
              </span>
              <span className="min-w-0">
                <span className="text-ink block text-sm leading-4 font-medium">
                  {google.result.name}
                </span>
                <span className="block truncate text-xs text-neutral-500">
                  {google.result.url}
                  {google.result.breadcrumb.map((crumb) => ` › ${crumb}`)}
                </span>
              </span>
            </div>
            <p className="mt-3 text-[15px] font-medium text-[#1B3B6F]">
              {google.result.title}
            </p>
            <motion.span
              className="mt-3 block h-2 rounded-full bg-neutral-100"
              initial={{ width: reduced ? '100%' : '0%' }}
              animate={{ width: inView || reduced ? '100%' : '0%' }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.5, delay: 1 }
              }
            />
            <motion.span
              className="mt-1.5 block h-2 rounded-full bg-neutral-100"
              initial={{ width: reduced ? '66.6667%' : '0%' }}
              animate={{ width: inView || reduced ? '66.6667%' : '0%' }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.5, delay: 1.2 }
              }
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
