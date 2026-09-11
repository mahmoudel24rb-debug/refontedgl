'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SERVICES_BENTO } from '../../content'
import { BOX, useEnter } from './shared'

/**
 * Carte claire « Landing pages, automatisation et tout le reste » : circuit
 * imprime dont chaque piste porte une queue lumineuse coral qui la parcourt en
 * boucle (5 s, lineaire), comme le module circuit du template.
 */

const TRACE = '#E7E5DE'

interface Trace {
  d: string
  /** Piste strictement verticale : le degrade doit etre vertical lui aussi. */
  vertical?: boolean
}

interface TraceGroup {
  traces: Trace[]
  /** Longueur de la queue lumineuse, en unites du viewBox. */
  dash: number
  /** Seconde passe floutee, comme les groupes 2 et 3 du template. */
  glow: boolean
}

const GROUPS: TraceGroup[] = [
  {
    dash: 60,
    glow: false,
    traces: [
      { d: 'M-10 150 H 190' },
      { d: 'M-10 186 H 190' },
      { d: 'M-10 222 H 190' },
      { d: 'M-10 258 H 40 L 66 232 H 190' },
    ],
  },
  {
    dash: 30,
    glow: true,
    traces: [
      { d: 'M-10 96 H 96 L 122 70 H 214 V 116' },
      { d: 'M-10 60 H 130 L 156 34 H 246 V 116' },
      { d: 'M278 34 V 116', vertical: true },
    ],
  },
  {
    dash: 30,
    glow: true,
    traces: [
      { d: 'M214 216 V 300', vertical: true },
      { d: 'M246 216 V 268 L 220 294 H 120' },
    ],
  },
]

const ALL_TRACES = GROUPS.flatMap((group) => group.traces)

/** Longueur reelle de chaque piste, mesuree sur un path detache. */
function useTraceLengths() {
  const [lengths, setLengths] = useState<number[]>(() =>
    ALL_TRACES.map(() => 500),
  )

  useEffect(() => {
    const measured = ALL_TRACES.map((trace) => {
      try {
        const node = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path',
        )
        node.setAttribute('d', trace.d)
        const length = node.getTotalLength()
        return length > 0 ? length : 500
      } catch {
        return 500
      }
    })
    const id = window.requestAnimationFrame(() => setLengths(measured))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return lengths
}

/** Rang de la premiere piste de chaque groupe dans ALL_TRACES. */
const GROUP_OFFSETS = GROUPS.map((_, index) =>
  GROUPS.slice(0, index).reduce((sum, group) => sum + group.traces.length, 0),
)

function Circuit({ run, reduced }: { run: boolean; reduced: boolean }) {
  const lengths = useTraceLengths()

  return (
    <svg
      viewBox="0 0 300 314"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="dgl-sb-tail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FE5752" stopOpacity="0" />
          <stop offset="50%" stopColor="#FE5752" stopOpacity="1" />
          <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dgl-sb-tail-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FE5752" stopOpacity="0" />
          <stop offset="50%" stopColor="#FE5752" stopOpacity="1" />
          <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dgl-sb-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FE5752" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        stroke={TRACE}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ALL_TRACES.map((trace) => (
          <path key={trace.d} d={trace.d} />
        ))}
      </g>

      {GROUPS.map((group, groupIndex) => (
        <g key={groupIndex} fill="none" strokeLinecap="round">
          {group.traces.map((trace, traceIndex) => {
            const length = lengths[GROUP_OFFSETS[groupIndex] + traceIndex] ?? 500
            const stroke = trace.vertical
              ? 'url(#dgl-sb-tail-v)'
              : 'url(#dgl-sb-tail)'
            /* Hors ecran la queue revient au depart pour repartir sur un cycle
               entier ; en mode anime reduit elle se pose au milieu du trace. */
            const resting = reduced ? -(length * 0.35) : 0
            const loop = {
              initial: { strokeDashoffset: 0 },
              animate: {
                strokeDashoffset: run ? -(length + group.dash) : resting,
              },
              transition: run
                ? { duration: 5, ease: 'linear' as const, repeat: Infinity }
                : { duration: 0 },
            }
            return (
              <g key={trace.d}>
                <motion.path
                  d={trace.d}
                  stroke={stroke}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${group.dash} ${length}`}
                  {...loop}
                />
                {group.glow ? (
                  <motion.path
                    d={trace.d}
                    stroke={stroke}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.3"
                    strokeDasharray={`${group.dash} ${length}`}
                    style={{ filter: 'drop-shadow(0 0 12px #FE5752)' }}
                    {...loop}
                  />
                ) : null}
              </g>
            )
          })}
        </g>
      ))}

      <circle cx="234" cy="166" r="96" fill="url(#dgl-sb-halo)" />

      <g fill={TRACE}>
        <rect x="182" y="146" width="20" height="8" rx="4" />
        <rect x="182" y="182" width="20" height="8" rx="4" />
        <rect x="182" y="218" width="20" height="8" rx="4" />
        <rect x="210" y="96" width="8" height="24" rx="4" />
        <rect x="242" y="96" width="8" height="24" rx="4" />
        <rect x="274" y="96" width="8" height="24" rx="4" />
        <rect x="210" y="212" width="8" height="24" rx="4" />
        <rect x="242" y="212" width="8" height="24" rx="4" />
      </g>

      <rect
        x="196"
        y="112"
        width="112"
        height="112"
        rx="28"
        fill="#FE5752"
        fillOpacity="0.82"
      />
    </svg>
  )
}

export default function RestCard() {
  const { reduced } = useEnter()
  const ref = useRef<HTMLDivElement>(null)
  /* Les queues ne tournent que quand la carte est a l'ecran. */
  const inView = useInView(ref, { amount: 0.2 })

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-2 ${BOX}`}
    >
      <Circuit run={inView && !reduced} reduced={reduced} />
      <h3 className="text-ink relative z-10 text-base font-medium text-balance">
        {SERVICES_BENTO.rest.title}
      </h3>
    </div>
  )
}
