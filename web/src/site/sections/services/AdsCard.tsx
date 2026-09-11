'use client'

import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { SERVICES_BENTO, type AdsPin } from '../../content'
import { FRANCE_MAP } from '../../data/france-map'
import { LOGO_FILTER_INK } from '../../tokens'
import { BOX, useEnter, VIEWPORT } from './shared'

/**
 * Carte navy « Google Ads et Meta Ads » : la France en points (generee hors
 * ligne par `scripts/gen-france-map.mjs`), avec les reperes clients (pastille
 * blanche + logo) et les villes ou des campagnes tournent (point coral). Les
 * reperes arrivent en ressort avec un anneau pulse, comme la carte du monde
 * du template.
 */

/* -------------------------------------------------------------------------- */
/* Fond : les points de la France, un seul chemin plutot que 2000 cercles      */
/* -------------------------------------------------------------------------- */

const DOT_R = 0.22

const DOTS_PATH = FRANCE_MAP.dots
  .map(
    ([x, y]) =>
      `M${x} ${y - DOT_R}a${DOT_R} ${DOT_R} 0 1 0 0 ${2 * DOT_R}a${DOT_R} ${DOT_R} 0 1 0 0 ${-2 * DOT_R}`,
  )
  .join('')

/* -------------------------------------------------------------------------- */
/* Reperes : regroupement par ville puis placement des etiquettes              */
/* -------------------------------------------------------------------------- */

interface Marker {
  city: string
  kind: 'client' | 'zone'
  /** Clients de la ville (un seul repere pour plusieurs enseignes). */
  clients: AdsPin[]
  /** Position en pourcentage de la boite de la carte. */
  left: number
  top: number
  /** Taille du repere en pixels. */
  width: number
  height: number
  /** Cote de l'etiquette. */
  label: LabelPlacement
  /** Etiquette affichee en permanence (sinon, seulement au survol). */
  labelAlways: boolean
}

interface LabelPlacement {
  dx: number
  dy: number
  ax: number
  ay: number
}

interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

/* Echelle approximative du rendu : la boite de la carte fait environ 250 px
   de haut pour 60 unites, quelle que soit la largeur de la carte du bento.
   Elle ne sert qu'a placer les etiquettes (police fixe de 10 px). */
const SCALE = 4.2
const BOX_W = FRANCE_MAP.width * SCALE
const BOX_H = FRANCE_MAP.height * SCALE

/* 24 px et non 28 : Tours et Le Mans ne sont distants que de 17 px sur la
   carte rendue, des pastilles plus grandes se confondraient. */
const CLIENT_SIZE = 24
const CLIENT_OVERLAP = 7
const ZONE_SIZE = 8
const ZONE_RING = 20
/* Encombrement retenu pour une zone : le point, pas son anneau (transparent),
   sinon plus aucune etiquette ne trouverait de place au centre de la France. */
const ZONE_COLLIDE = 10

const CHAR_W = 6.1
const LABEL_H = 14
const LABEL_PAD = 8

function overlaps(a: Rect, b: Rect) {
  return a.x0 < b.x1 + 2 && b.x0 < a.x1 + 2 && a.y0 < b.y1 + 2 && b.y0 < a.y1 + 2
}

/* Uniquement les quatre cotes : une etiquette posee en diagonale finit plus
   pres du repere voisin que du sien et devient ambigue. */
function candidates(halfW: number, halfH: number): LabelPlacement[] {
  return [
    { dx: halfW + 5, dy: 0, ax: 0, ay: -50 },
    { dx: 0, dy: halfH + 4, ax: -50, ay: 0 },
    { dx: -(halfW + 5), dy: 0, ax: -100, ay: -50 },
    { dx: 0, dy: -(halfH + 4), ax: -50, ay: -100 },
  ]
}

/**
 * Regroupe les reperes par ville, puis colle les etiquettes contre leur
 * repere : la premiere position libre l'emporte. Les clients passent en
 * premier et gardent toujours leur etiquette ; une etiquette de zone qui ne
 * trouve pas de creneau n'apparait qu'au survol du point. Aucun
 * chevauchement, quelle que soit la liste de villes.
 */
function buildMarkers(pins: AdsPin[]): Marker[] {
  const byCity = new Map<string, Marker>()
  const order: Marker[] = []

  for (const pin of pins) {
    const point = FRANCE_MAP.pins[pin.city]
    if (!point) continue
    const existing = byCity.get(pin.city)
    if (existing) {
      if (pin.kind === 'client') existing.clients.push(pin)
      continue
    }
    const marker: Marker = {
      city: pin.city,
      kind: pin.kind,
      clients: pin.kind === 'client' ? [pin] : [],
      left: (point.x / FRANCE_MAP.width) * 100,
      top: (point.y / FRANCE_MAP.height) * 100,
      width: pin.kind === 'client' ? CLIENT_SIZE : ZONE_SIZE,
      height: pin.kind === 'client' ? CLIENT_SIZE : ZONE_SIZE,
      label: { dx: 0, dy: 0, ax: 0, ay: -50 },
      labelAlways: false,
    }
    byCity.set(pin.city, marker)
    order.push(marker)
  }

  /* Deux pastilles clients trop proches (Tours et Le Mans) sont ecartees
     symetriquement le long de leur axe, en unites de carte. */
  const clientsOnly = order.filter((marker) => marker.kind === 'client')
  const minGap = (CLIENT_SIZE + 6) / SCALE
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 0; i < clientsOnly.length; i += 1) {
      for (let j = i + 1; j < clientsOnly.length; j += 1) {
        const a = clientsOnly[i]
        const b = clientsOnly[j]
        const ax = (a.left / 100) * FRANCE_MAP.width
        const ay = (a.top / 100) * FRANCE_MAP.height
        const bx = (b.left / 100) * FRANCE_MAP.width
        const by = (b.top / 100) * FRANCE_MAP.height
        const dx = bx - ax
        const dy = by - ay
        const dist = Math.hypot(dx, dy) || 0.01
        if (dist >= minGap) continue
        const push = (minGap - dist) / 2
        const ux = dx / dist
        const uy = dy / dist
        a.left = ((ax - ux * push) / FRANCE_MAP.width) * 100
        a.top = ((ay - uy * push) / FRANCE_MAP.height) * 100
        b.left = ((bx + ux * push) / FRANCE_MAP.width) * 100
        b.top = ((by + uy * push) / FRANCE_MAP.height) * 100
      }
    }
  }

  for (const marker of order) {
    if (marker.kind !== 'client') continue
    marker.width =
      CLIENT_SIZE + (marker.clients.length - 1) * (CLIENT_SIZE - CLIENT_OVERLAP)
  }

  /* Encombrement de chaque repere. */
  const centers = order.map((marker) => ({
    cx: (marker.left / 100) * BOX_W,
    cy: (marker.top / 100) * BOX_H,
  }))
  const half = (marker: Marker) => ({
    w: (marker.kind === 'client' ? marker.width : ZONE_COLLIDE) / 2,
    h: (marker.kind === 'client' ? marker.height : ZONE_COLLIDE) / 2,
  })
  const busy: Rect[] = order.map((marker, index) => {
    const { w, h } = half(marker)
    return {
      x0: centers[index].cx - w,
      y0: centers[index].cy - h,
      x1: centers[index].cx + w,
      y1: centers[index].cy + h,
    }
  })

  const placed: Rect[] = [...busy]
  const sorted = [...order].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === 'client' ? -1 : 1,
  )

  for (const marker of sorted) {
    const index = order.indexOf(marker)
    const { cx, cy } = centers[index]
    const labelW = marker.city.length * CHAR_W + LABEL_PAD
    const { w, h } = half(marker)
    const options = candidates(w, h)

    for (const option of options) {
      const x0 = cx + option.dx + (option.ax / 100) * labelW
      const y0 = cy + option.dy + (option.ay / 100) * LABEL_H
      const rect = { x0, y0, x1: x0 + labelW, y1: y0 + LABEL_H }
      if (x0 < -28 || rect.x1 > BOX_W + 28) continue
      if (y0 < -4 || rect.y1 > BOX_H + 6) continue
      if (placed.some((other) => overlaps(rect, other))) continue
      marker.label = option
      marker.labelAlways = true
      placed.push(rect)
      break
    }

    if (marker.labelAlways) continue
    /* Aucun creneau : le client garde son etiquette a droite, la zone ne
       montre la sienne qu'au survol du point. */
    marker.label = options[cx > BOX_W / 2 ? 2 : 0]
    marker.labelAlways = marker.kind === 'client'
  }

  return order
}

const MARKERS = buildMarkers(SERVICES_BENTO.ads.pins)

/* -------------------------------------------------------------------------- */
/* Rendu                                                                      */
/* -------------------------------------------------------------------------- */

function labelStyle(placement: LabelPlacement): CSSProperties {
  return {
    left: `calc(50% + ${placement.dx}px)`,
    top: `calc(50% + ${placement.dy}px)`,
    transform: `translate(${placement.ax}%, ${placement.ay}%)`,
  }
}

function MapMarker({ marker, index }: { marker: Marker; index: number }) {
  const { reduced, from } = useEnter()
  const delay = 0.1 * index
  const isClient = marker.kind === 'client'
  const ringSize = isClient ? marker.width + 6 : ZONE_RING

  return (
    <div
      className="group/pin absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${marker.left}%`,
        top: `${marker.top}%`,
        width: marker.width,
        height: marker.height,
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={from({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 })}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      >
        <motion.span
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isClient ? 'border border-white/50' : 'bg-primary/40'
          }`}
          style={{ width: ringSize, height: ringSize }}
          animate={
            reduced
              ? { scale: 1, opacity: 0.3 }
              : { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay + 0.2,
                }
          }
        />
        <motion.div
          className="absolute inset-0 flex items-center"
          initial={
            isClient
              ? from({ scale: 0.8 }, { scale: 1 })
              : from({ scale: 0, y: 20 }, { scale: 1, y: 0 })
          }
          whileInView={isClient ? { scale: 1 } : { scale: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={
            isClient
              ? {
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: delay + 0.15,
                }
              : {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: delay + 0.15,
                }
          }
        >
          {isClient ? (
            <span
              title={marker.clients.map((client) => client.label).join(', ')}
              className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-white p-[3px] ring-2 ring-[#002329]"
            >
              <img
                src={marker.clients[0]?.logo}
                alt={marker.clients.map((client) => client.label).join(', ')}
                loading="lazy"
                className="h-full w-full object-contain"
                style={{ filter: LOGO_FILTER_INK }}
              />
              {marker.clients.length > 1 ? (
                <span
                  aria-hidden="true"
                  className="bg-primary absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] leading-none font-semibold text-white ring-2 ring-[#002329]"
                >
                  {marker.clients.length}
                </span>
              ) : null}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="bg-primary block size-2 rounded-full ring-2 ring-[#002329]"
            />
          )}
        </motion.div>
      </motion.div>

      {marker.labelAlways ? (
        <motion.span
          className={`bg-ink/70 pointer-events-none absolute rounded px-1 font-mono text-[10px] leading-[14px] whitespace-nowrap ${
            isClient ? 'text-white' : 'text-white/70'
          }`}
          style={labelStyle(marker.label)}
          initial={from({ opacity: 0 }, { opacity: 1 })}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: delay + 0.25 }}
        >
          {marker.city}
        </motion.span>
      ) : (
        <span className="pointer-events-none absolute" style={labelStyle(marker.label)}>
          <span className="bg-ink/80 block rounded px-1 font-mono text-[10px] leading-[14px] whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover/pin:opacity-100">
            {marker.city}
          </span>
        </span>
      )}
    </div>
  )
}

export default function AdsCard() {
  return (
    <div
      className={`bg-ink relative overflow-hidden rounded-2xl p-4 lg:col-span-3 ${BOX}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 110% at 0% 0%, rgba(255,255,255,0.10) 0%, transparent 55%)',
        }}
      />

      <div className="absolute inset-x-4 top-11 bottom-2 flex items-center justify-center">
        <div
          className="relative h-full max-w-full"
          style={{ aspectRatio: `${FRANCE_MAP.width} / ${FRANCE_MAP.height}` }}
        >
          <svg
            viewBox={`0 0 ${FRANCE_MAP.width} ${FRANCE_MAP.height}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              maskImage:
                'radial-gradient(115% 115% at 50% 45%, black 55%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(115% 115% at 50% 45%, black 55%, transparent 100%)',
            }}
          >
            <path d={DOTS_PATH} fill="#ffffff" opacity="0.28" />
          </svg>

          {MARKERS.map((marker, index) => (
            <MapMarker key={marker.city} marker={marker} index={index} />
          ))}
        </div>
      </div>

      <h3 className="relative z-20 text-base font-medium text-balance text-white">
        {SERVICES_BENTO.ads.title}
      </h3>
    </div>
  )
}
