import { useEffect, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import SectionHeader from '../ui/SectionHeader'
import { GoogleGIcon } from '../ui/Icons'
import { CAMPAIGN_DASHBOARD, SERVICES_BENTO } from '../content'

/**
 * Bento services « Remplacez votre equipe marketing » : grille 19 colonnes,
 * une carte navy (mockup navigateur) et quatre cartes illustrees a droite.
 * Les mockups sont dessines en CSS/SVG, aucune image externe.
 */

const CSS = `
.dgl-sb-note{animation:dgl-sb-note-in .5s ease-out both}
@keyframes dgl-sb-note-in{from{opacity:0;transform:translate3d(0,6px,0)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.dgl-sb-note{animation:none}}
`

const BOX = 'min-h-[var(--box-min-height)]'
const FADE_DOWN = 'linear-gradient(to bottom, #000 72%, transparent 100%)'

/* -------------------------------------------------------------------------- */
/* Fonds decoratifs                                                           */
/* -------------------------------------------------------------------------- */

/** Semis de points 1 px (cartes claires du template). */
function DotBackdrop({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0${className ? ` ${className}` : ''}`}
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

/* -------------------------------------------------------------------------- */
/* Carte navy : mockup navigateur + tableau de bord de campagne               */
/* -------------------------------------------------------------------------- */

const KPI_BARS = ['82%', '46%', '68%', '55%']

function CampaignDashboard() {
  return (
    <div className="flex h-full flex-col bg-white px-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-primary/15 size-5 rounded-full" />
          <span className="block h-2 w-28 rounded-full bg-neutral-200" />
        </div>
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[9px] font-medium">
          {CAMPAIGN_DASHBOARD.badge}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {CAMPAIGN_DASHBOARD.kpis.map((kpi, index) => (
          <div key={kpi.label} className="rounded-md bg-neutral-100 p-2">
            <p className="text-[8px] font-medium tracking-wide text-neutral-500 uppercase">
              {kpi.label}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-neutral-800">
              {kpi.value}
            </p>
            <span className="mt-1.5 block h-1 rounded-full bg-neutral-200">
              <span
                className="bg-primary/70 block h-1 rounded-full"
                style={{ width: KPI_BARS[index % KPI_BARS.length] }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex-1 rounded-md bg-neutral-50 p-3 ring-1 ring-neutral-100 ring-inset">
        <span className="block h-1.5 w-20 rounded-full bg-neutral-200" />
        <svg
          viewBox="0 0 220 70"
          className="mt-2 h-auto w-full"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dgl-sb-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FE5752" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FE5752" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 58 C 26 52, 34 38, 56 36 S 92 46, 114 32 S 150 12, 174 16 S 206 6, 220 8 L 220 70 L 0 70 Z"
            fill="url(#dgl-sb-area)"
          />
          <path
            d="M0 58 C 26 52, 34 38, 56 36 S 92 46, 114 32 S 150 12, 174 16 S 206 6, 220 8"
            stroke="#FE5752"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="220" cy="8" r="3" fill="#FE5752" />
        </svg>
      </div>
    </div>
  )
}

function BrowserMockup() {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg bg-[#E6E6E6] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="block size-2 rounded-full bg-[#F45B4F]" />
          <span className="block size-2 rounded-full bg-[#F5BE3F]" />
          <span className="block size-2 rounded-full bg-[#4FBF5F]" />
        </span>
        <span className="mx-auto block h-2.5 w-1/2 rounded-full bg-white/90" />
        <span className="block size-2 rounded-full bg-black/10" />
      </div>
      <CampaignDashboard />
    </div>
  )
}

function MainCard() {
  return (
    <div className="bg-ink relative col-span-19 flex min-h-[520px] flex-col overflow-hidden rounded-2xl p-4 lg:col-span-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '9px 9px',
          maskImage: 'linear-gradient(to bottom, transparent 48%, #000 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 48%, #000 100%)',
        }}
      />
      <div
        className="relative min-h-[260px] flex-1 overflow-hidden"
        style={{ maskImage: FADE_DOWN, WebkitMaskImage: FADE_DOWN }}
      >
        <BrowserMockup />
      </div>
      <div className="relative mt-6">
        <h3 className="text-base font-medium text-white">
          {SERVICES_BENTO.main.title}
        </h3>
        <p className="mt-4 text-base text-neutral-400">
          {SERVICES_BENTO.main.text}
        </p>
        <div className="mt-6">
          <DotButton
            label={SERVICES_BENTO.main.cta.label}
            href={SERVICES_BENTO.main.cta.to}
          />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte claire : reporting temps reel                                        */
/* -------------------------------------------------------------------------- */

const R = 42
const CIRC = 2 * Math.PI * R

function Donut() {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 right-0 size-44 md:size-48"
    >
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="#EBE9E1"
        strokeWidth="26"
      />
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="#FE5752"
        strokeOpacity="0.8"
        strokeWidth="26"
        strokeDasharray={`${CIRC * 0.34} ${CIRC}`}
        transform="rotate(-38 60 60)"
      />
    </svg>
  )
}

function ReportingCard() {
  const reduced = useReducedMotion()
  const notes = SERVICES_BENTO.reporting.notifications
  const [front, setFront] = useState(0)

  useEffect(() => {
    if (reduced || notes.length < 2) return
    const id = window.setInterval(() => {
      setFront((value) => (value + 1) % notes.length)
    }, 3000)
    return () => window.clearInterval(id)
  }, [reduced, notes.length])

  const note = notes[front]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-2 ${BOX}`}
    >
      <style>{CSS}</style>
      <DotBackdrop />
      <Donut />
      <h3 className="text-ink relative z-10 text-base font-medium text-balance">
        {SERVICES_BENTO.reporting.title}
      </h3>

      <div className="absolute inset-x-4 bottom-4 z-10 h-[102px]">
        <div className="ring-ink/5 absolute inset-x-8 bottom-[22px] h-14 rounded-xl bg-white ring-1" />
        <div className="ring-ink/5 absolute inset-x-4 bottom-[11px] h-14 rounded-xl bg-white ring-1" />
        <div className="ring-ink/8 absolute inset-x-0 bottom-0 rounded-xl bg-white p-3 shadow-[0_10px_28px_-14px_rgba(0,35,41,0.45)] ring-1">
          <div key={front} className="dgl-sb-note">
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
            <p className="mt-1 text-base text-neutral-700">{note.text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte navy : pilotage Google Ads et Meta Ads (planisphere en points)        */
/* -------------------------------------------------------------------------- */

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
function ServerBadge({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className="absolute flex size-7 flex-col items-center justify-center gap-1 rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur-[2px]"
      style={style}
    >
      <span className="block h-0.5 w-3.5 rounded-full bg-white/60" />
      <span className="block h-0.5 w-3.5 rounded-full bg-white/60" />
    </span>
  )
}

const SERVER_POSITIONS: CSSProperties[] = [
  { left: '22%', top: '46%' },
  { left: '44%', top: '24%' },
  { left: '50%', top: '32%' },
  { left: '76%', top: '28%' },
  { left: '80%', top: '42%' },
]

const AVATAR_POSITIONS: CSSProperties[] = [
  { left: '15%', top: '30%' },
  { left: '48%', top: '42%' },
  { left: '68%', top: '33%' },
]

function AdsCard() {
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
      {SERVER_POSITIONS.map((style, index) => (
        <ServerBadge key={index} style={style} />
      ))}
      {SERVICES_BENTO.ads.avatars.map((avatar, index) => (
        <img
          key={avatar}
          src={avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={28}
          height={28}
          className="absolute size-7 rounded-full object-cover ring-2 ring-white/70"
          style={AVATAR_POSITIONS[index % AVATAR_POSITIONS.length]}
        />
      ))}
      <h3 className="relative z-10 text-base font-medium text-balance text-white">
        {SERVICES_BENTO.ads.title}
      </h3>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte claire : etre trouve sur Google                                      */
/* -------------------------------------------------------------------------- */

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

function GoogleCard() {
  const google = SERVICES_BENTO.google
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-3 ${BOX}`}
    >
      <GridBackdrop />
      <h3 className="text-ink relative z-10 text-base font-medium">
        {google.title}
      </h3>

      <div className="relative z-10 mt-6">
        <div className="ring-ink/5 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_10px_28px_-16px_rgba(0,35,41,0.5)] ring-1">
          <GoogleGIcon size={18} />
          <span className="flex-1 truncate text-sm text-neutral-500">
            {google.query}
          </span>
          <MicIcon />
        </div>

        <div className="relative mt-3">
          <div className="ring-ink/5 absolute inset-x-6 top-3 h-full rounded-xl bg-white ring-1" />
          <div className="ring-ink/5 absolute inset-x-3 top-1.5 h-full rounded-xl bg-white ring-1" />
          <div className="ring-ink/5 relative -rotate-[0.6deg] rounded-xl bg-white p-4 shadow-[0_16px_36px_-20px_rgba(0,35,41,0.55)] ring-1">
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
            <span className="mt-3 block h-2 w-full rounded-full bg-neutral-100" />
            <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Carte claire : landing pages et automatisation (circuit imprime)           */
/* -------------------------------------------------------------------------- */

const TRACE = '#E7E5DE'

function Circuit() {
  return (
    <svg
      viewBox="0 0 300 314"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="dgl-sb-spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FE5752" stopOpacity="0" />
          <stop offset="45%" stopColor="#FE5752" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FE5752" stopOpacity="0.15" />
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
        <path d="M-10 150 H 190" />
        <path d="M-10 186 H 190" />
        <path d="M-10 222 H 190" />
        <path d="M-10 258 H 40 L 66 232 H 190" />
        <path d="M-10 96 H 96 L 122 70 H 214 V 116" />
        <path d="M-10 60 H 130 L 156 34 H 246 V 116" />
        <path d="M278 34 V 116" />
        <path d="M214 216 V 300" />
        <path d="M246 216 V 268 L 220 294 H 120" />
      </g>

      <g stroke="url(#dgl-sb-spark)" strokeWidth="4" strokeLinecap="round">
        <path d="M60 150 H 132" />
        <path d="M18 186 H 92" />
        <path d="M22 222 H 96" />
        <path d="M50 232 H 118" />
      </g>

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

function RestCard() {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-4 lg:col-span-2 ${BOX}`}
    >
      <Circuit />
      <h3 className="text-ink relative z-10 text-base font-medium text-balance">
        {SERVICES_BENTO.rest.title}
      </h3>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function ServicesBento() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader title={SERVICES_BENTO.heading} />
        <div className="mt-10 grid grid-cols-19 gap-3 md:mt-14">
          <MainCard />
          <div className="col-span-19 grid grid-cols-1 gap-3 [--box-min-height:314px] md:grid-cols-2 lg:col-span-13 lg:grid-cols-5">
            <ReportingCard />
            <AdsCard />
            <GoogleCard />
            <RestCard />
          </div>
        </div>
      </Container>
    </section>
  )
}
