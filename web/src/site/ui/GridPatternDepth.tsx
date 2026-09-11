'use client'

import { motion } from 'framer-motion'

/**
 * Fond de la carte citation (module `GridPattenDepth` du template) : treize
 * carres de 72 px poses en grille qui apparaissent un a un a l'entree dans le
 * viewport, sous deux masques degrades (horizontal et vertical) qui fondent
 * les bords. Couleur adaptee au coral DGL.
 */

const SQUARE = 72
const FILL = '#FE5752'
const FILL_OPACITY = 0.18

/* Ombres portees du template, repassees en coral (254, 87, 82). */
const SHADOW_R = 0.996078
const SHADOW_G = 0.341176
const SHADOW_B = 0.321569

const ID = 'dgl-grid-depth'

type Square = {
  x: number
  y: number
  opacity: number
  group?: { opacity: number; filter: string }
}

/* Ordre du template : l'index sert aussi d'index de delai. */
const SQUARES: Square[] = [
  { x: 105.117, y: 28.7969, opacity: 1 },
  {
    x: 249.117,
    y: 28.7969,
    opacity: 1,
    group: { opacity: 0.6, filter: `${ID}-drop-sm` },
  },
  {
    x: 177.117,
    y: 100.797,
    opacity: 1,
    group: { opacity: 0.6, filter: `${ID}-drop-inner` },
  },
  { x: 249.117, y: 100.797, opacity: 0.45 },
  { x: 321.117, y: 100.797, opacity: 0.3 },
  { x: 105.117, y: 172.797, opacity: 0.6 },
  { x: 177.117, y: 172.797, opacity: 0.45 },
  {
    x: 249.117,
    y: 172.797,
    opacity: 1,
    group: { opacity: 0.3, filter: `${ID}-drop-dark` },
  },
  { x: 105.117, y: 100.797, opacity: 0.3 },
  { x: 177.117, y: 28.7969, opacity: 0.3 },
  { x: 321.117, y: 172.797, opacity: 0.15 },
  { x: 177.117, y: 244.797, opacity: 0.3 },
  { x: 249.117, y: 244.797, opacity: 0.15 },
]

/**
 * Meme generateur pseudo aleatoire deterministe que le template (mulberry32,
 * graine 0x1926af5) : les delais sont donc identiques a chaque rendu.
 */
const DELAYS = (() => {
  let seed = 0x1926af5
  return SQUARES.map(() => {
    seed += 0x6d2b79f5
    let mix = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    mix = (mix + Math.imul(mix ^ (mix >>> 7), 61 | mix)) ^ mix
    return 0.05 + 0.4 * (((mix ^ (mix >>> 14)) >>> 0) / 4294967296)
  })
})()

function PatternSquare({ square, delay }: { square: Square; delay: number }) {
  const rect = (
    <motion.rect
      x={square.x}
      y={square.y}
      width={SQUARE}
      height={SQUARE}
      fill={FILL}
      fillOpacity={FILL_OPACITY}
      shapeRendering={square.group ? 'crispEdges' : undefined}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: square.opacity }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    />
  )
  if (!square.group) return rect
  return (
    <g opacity={square.group.opacity} filter={`url(#${square.group.filter})`}>
      {rect}
    </g>
  )
}

export default function GridPatternDepth({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 497 346"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <mask
        id={`${ID}-fade-x`}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="497"
        height="346"
      >
        <rect width="496.8" height="345.6" fill={`url(#${ID}-gradient-x)`} />
      </mask>
      <g mask={`url(#${ID}-fade-x)`}>
        <mask
          id={`${ID}-fade-y`}
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="497"
          height="346"
        >
          <rect width="496.8" height="345.6" fill={`url(#${ID}-gradient-y)`} />
        </mask>
        <g mask={`url(#${ID}-fade-y)`}>
          {SQUARES.map((square, index) => (
            <PatternSquare
              key={`${square.x}-${square.y}`}
              square={square}
              delay={DELAYS[index] ?? 0.05}
            />
          ))}
        </g>
      </g>
      <defs>
        <filter
          id={`${ID}-drop-sm`}
          x="245.117"
          y="28.7969"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${SHADOW_R} 0 0 0 0 ${SHADOW_G} 0 0 0 0 ${SHADOW_B} 0 0 0 0.35 0`}
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="dropShadow"
          />
          <feBlend mode="normal" in="SourceGraphic" in2="dropShadow" />
        </filter>
        <filter
          id={`${ID}-drop-inner`}
          x="167.117"
          y="94.7969"
          width="92"
          height="92"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${SHADOW_R} 0 0 0 0 ${SHADOW_G} 0 0 0 0 ${SHADOW_B} 0 0 0 0.35 0`}
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="dropShadow"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="innerAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="innerAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend mode="normal" in2="shape" />
        </filter>
        <filter
          id={`${ID}-drop-dark`}
          x="245.117"
          y="172.797"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="dropShadow"
          />
          <feBlend mode="normal" in="SourceGraphic" in2="dropShadow" />
        </filter>
        <linearGradient
          id={`${ID}-gradient-x`}
          x1="100.2"
          y1="172.8"
          x2="402.48"
          y2="172.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0" />
          <stop offset="0.354383" />
          <stop offset="0.79624" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${ID}-gradient-y`}
          x1="249.12"
          y1="23.76"
          x2="248.4"
          y2="327"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0" />
          <stop offset="0.397032" />
          <stop offset="0.70269" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
