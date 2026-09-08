import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SERVICES_BENTO } from '../../content'
import { BOX, useEnter, VIEWPORT } from './shared'

/**
 * Carte navy « Google Ads et Meta Ads » : planisphere en points, pins qui
 * arrivent en ressort avec un anneau pulse, comme la carte du monde du
 * template.
 */

/* Planisphere simplifie : 60 colonnes (lon -180 a 180) x 24 lignes
   (lat 84 a -60), un caractere plein par cellule de terre. */
const WORLD: string[] = [
  '                     #####                                  ',
  '        ###################     #                           ',
  '  ################## ######     ########################### ',
  '  ################### ##### #  #############################',
  '  ###################          #############################',
  '       ##############        ###############################',
  '         ###########         ############################   ',
  '         ###########        ###########################     ',
  '          ##########       ###########################      ',
  '           ########        ###########################      ',
  '           #########       #########################        ',
  '              #######      #########################        ',
  '               ########    ############   #### ######       ',
  '                #########  ############       #########     ',
  '                ########## ##########         ##########    ',
  '                ########## ##########          #########    ',
  '                 #########  ##########           #######    ',
  '                 #########  ######## ##         ########    ',
  '                  #######    #######            ########    ',
  '                  ######      #####              #######    ',
  '                   ####                               ##  ##',
  '                    ###                                   ##',
  '                    ###                                     ',
  '                    ##                                      ',
]

const WORLD_DOTS: { x: number; y: number }[] = WORLD.flatMap((row, y) =>
  row
    .split('')
    .map((cell, x) => (cell === '#' ? { x, y } : null))
    .filter((dot): dot is { x: number; y: number } => dot !== null),
)

function WorldMap() {
  return (
    <svg
      viewBox="0 0 60 24"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {WORLD_DOTS.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x + 0.5}
          cy={dot.y + 0.5}
          r="0.3"
          fill="#ffffff"
          opacity="0.34"
        />
      ))}
    </svg>
  )
}

/** Petite tuile « serveur » posee sur la carte. */
function ServerBadge() {
  return (
    <span className="flex size-7 flex-col items-center justify-center gap-1 rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur-[2px]">
      <span className="block h-0.5 w-3.5 rounded-full bg-white/60" />
      <span className="block h-0.5 w-3.5 rounded-full bg-white/60" />
    </span>
  )
}

type PinKind = 'avatar' | 'server'

interface Pin {
  kind: PinKind
  /** Index dans SERVICES_BENTO.ads.avatars pour les pins d'equipe. */
  avatar?: number
  style: CSSProperties
}

/* Ordre de gauche a droite : la cascade traverse la carte. */
const PINS: Pin[] = [
  { kind: 'avatar', avatar: 0, style: { left: '15%', top: '30%' } },
  { kind: 'server', style: { left: '22%', top: '46%' } },
  { kind: 'server', style: { left: '44%', top: '24%' } },
  { kind: 'avatar', avatar: 1, style: { left: '48%', top: '42%' } },
  { kind: 'server', style: { left: '50%', top: '32%' } },
  { kind: 'avatar', avatar: 2, style: { left: '68%', top: '33%' } },
  { kind: 'server', style: { left: '76%', top: '28%' } },
  { kind: 'server', style: { left: '80%', top: '42%' } },
]

function PinMarker({
  pin,
  index,
  children,
}: {
  pin: Pin
  index: number
  children: ReactNode
}) {
  const { reduced, from } = useEnter()
  const delay = 0.1 * index

  return (
    <motion.div
      aria-hidden="true"
      className="absolute size-7"
      style={pin.style}
      initial={from({ opacity: 0, scale: 0 }, { opacity: 1, scale: 1 })}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      <motion.span
        className="absolute top-1/2 left-1/2 block size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
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
        className="absolute inset-0"
        initial={
          pin.kind === 'avatar'
            ? from({ scale: 0.8 }, { scale: 1 })
            : from({ scale: 0, y: 20 }, { scale: 1, y: 0 })
        }
        whileInView={pin.kind === 'avatar' ? { scale: 1 } : { scale: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={
          pin.kind === 'avatar'
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
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function AdsCard() {
  const avatars = SERVICES_BENTO.ads.avatars

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
      <WorldMap />
      {PINS.map((pin, index) => (
        <PinMarker key={index} pin={pin} index={index}>
          {pin.kind === 'server' ? (
            <ServerBadge />
          ) : (
            <img
              src={avatars[(pin.avatar ?? 0) % avatars.length]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={28}
              height={28}
              className="size-7 rounded-full object-cover ring-2 ring-white/70"
            />
          )}
        </PinMarker>
      ))}
      <h3 className="relative z-10 text-base font-medium text-balance text-white">
        {SERVICES_BENTO.ads.title}
      </h3>
    </div>
  )
}
