import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SERVICES_BENTO } from '../../content'
import { BOX, useEnter, VIEWPORT } from './shared'

/**
 * Carte claire « Reporting en temps reel » : donut qui se remplit, aiguille qui
 * fait un tour, et pile de notifications qui tourne toutes les 5 s.
 */

/** Semis de points 1 px (cartes claires du template). */
function DotBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(rgba(0,35,41,0.14) 1px, transparent 1px)',
        backgroundSize: '9px 9px',
        maskImage:
          'radial-gradient(120% 90% at 100% 0%, #000 0%, transparent 70%)',
        WebkitMaskImage:
          'radial-gradient(120% 90% at 100% 0%, #000 0%, transparent 70%)',
      }}
    />
  )
}

const RADIUS = 42
/** Part de l'anneau peinte en coral (34 % comme le template). */
const FILLED = 0.34

function Donut() {
  const { reduced } = useEnter()
  const ref = useRef<SVGSVGElement>(null)
  /* Un seul observateur pour tout le donut : les elements de <defs> n'ont pas
     de boite et ne declenchent jamais `whileInView`. */
  const inView = useInView(ref, VIEWPORT)
  const shown = inView || reduced

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 right-0 size-44 md:size-48"
    >
      <defs>
        <motion.linearGradient
          id="dgl-sb-donut"
          gradientUnits="userSpaceOnUse"
          initial={{ x1: 8, y1: 0, x2: 112, y2: 0 }}
          animate={
            shown
              ? { x1: 8, y1: 112, x2: 112, y2: 4 }
              : { x1: 8, y1: 0, x2: 112, y2: 0 }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.5, delay: 0.2, ease: 'easeOut' }
          }
        >
          <stop stopColor="#FE5752" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FF8D89" stopOpacity="0.8" />
        </motion.linearGradient>
        <linearGradient
          id="dgl-sb-needle"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F3D9D8" />
        </linearGradient>
      </defs>

      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        stroke="#EBE9E1"
        strokeWidth="26"
      />

      <g transform="rotate(-38 60 60)">
        <motion.circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="url(#dgl-sb-donut)"
          strokeWidth="26"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: shown ? FILLED : 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.5, delay: 0.2, ease: 'easeOut' }
          }
        />
      </g>

      <motion.g
        style={{ transformOrigin: '60px 60px', transformBox: 'view-box' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: shown ? 360 : 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 2, delay: 0.3, ease: 'easeInOut' }
        }
      >
        <rect
          x="59"
          y="3"
          width="2"
          height="31"
          rx="1"
          fill="#FFFFFF"
          transform="rotate(-11 60 3)"
        />
        <rect
          x="59"
          y="3"
          width="2"
          height="31"
          rx="1"
          fill="url(#dgl-sb-needle)"
          transform="rotate(-11 60 3)"
        />
      </motion.g>
    </svg>
  )
}

/** Decalage vertical et reduction d'echelle entre deux cartes de la pile. */
const OFFSET = 10
const SCALE_FACTOR = 0.06

function NotificationStack() {
  const { reduced } = useEnter()
  const notes = SERVICES_BENTO.reporting.notifications
  const [items, setItems] = useState(notes)

  useEffect(() => {
    if (reduced || notes.length < 2) return
    const id = window.setInterval(() => {
      setItems((current) => {
        const next = [...current]
        const last = next.pop()
        if (last) next.unshift(last)
        return next
      })
    }, 5000)
    return () => window.clearInterval(id)
  }, [reduced, notes.length])

  return (
    <div className="absolute inset-x-4 bottom-4 z-10 h-20">
      {items.map((note, index) => (
        <motion.div
          key={note.text}
          className="ring-ink/8 absolute inset-x-0 flex h-20 flex-col justify-between rounded-xl bg-white p-3 shadow-[0_10px_28px_-14px_rgba(0,35,41,0.45)] ring-1"
          style={{ transformOrigin: 'top center' }}
          animate={{
            top: -(index * OFFSET),
            scale: 1 - index * SCALE_FACTOR,
            zIndex: items.length - index,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-neutral-500">
              {note.label}
            </span>
            {note.avatar ? (
              <img
                src={note.avatar}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={24}
                height={24}
                className="size-6 rounded-full object-cover"
              />
            ) : (
              <span className="bg-primary/70 block size-2 rounded-full" />
            )}
          </div>
          <p className="text-base text-neutral-700">{note.text}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default function ReportingCard() {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-2 ${BOX}`}
    >
      <DotBackdrop />
      <Donut />
      <h3 className="text-ink relative z-10 text-base font-medium text-balance">
        {SERVICES_BENTO.reporting.title}
      </h3>
      <NotificationStack />
    </div>
  )
}
