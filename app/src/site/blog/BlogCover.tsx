import { LOGO_DGL, LOGO_FILTER_WHITE } from '../tokens'

/**
 * Couverture typographique d'un article : les articles WordPress DGL n'ont
 * pas d'image a la une, la carte est donc generee (fond navy, halo coral,
 * quadrillage, categorie, titre, logo). La position du halo varie selon le
 * slug pour que la grille ne soit pas monotone.
 */

export type BlogCoverSize = 'card' | 'hero'

/** Positions du halo coral (choisies par un hash du slug). */
const HALOS = [
  { x: '82%', y: '88%' },
  { x: '18%', y: '92%' },
  { x: '95%', y: '58%' },
  { x: '50%', y: '108%' },
  { x: '8%', y: '62%' },
] as const

/** Hash stable et court (djb2 simplifie) pour choisir une variante. */
function hash(text: string): number {
  let value = 0
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 33 + text.charCodeAt(i)) % 100000
  }
  return value
}

export default function BlogCover({
  title,
  slug,
  category,
  size = 'card',
}: {
  title: string
  slug: string
  category?: string
  size?: BlogCoverSize
}) {
  const halo = HALOS[hash(slug) % HALOS.length]
  const hero = size === 'hero'

  return (
    <div
      className={`bg-ink relative w-full overflow-hidden rounded-2xl ring-0 ring-white/10 group-hover:ring-1 ${
        hero ? 'aspect-[4/3]' : 'aspect-[16/10]'
      }`}
    >
      {/* Halo coral */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(60% 60% at ${halo.x} ${halo.y}, rgba(254,87,82,0.4) 0%, rgba(254,87,82,0.12) 45%, rgba(254,87,82,0) 72%)`,
        }}
      />
      {/* Quadrillage fin */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: hero ? '48px 48px' : '32px 32px',
        }}
      />

      <div
        className={`relative flex h-full w-full flex-col justify-between ${
          hero ? 'p-6 md:p-8' : 'p-5'
        }`}
      >
        <span className="font-mono text-[11px] tracking-wide text-white/60 uppercase">
          {category ?? 'DGL Agency'}
        </span>

        <div className="flex items-end justify-between gap-4">
          <p
            className={`-tracking-sm line-clamp-3 font-semibold text-balance text-white ${
              hero ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
            }`}
          >
            {title}
          </p>
          <img
            src={LOGO_DGL}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-4 w-auto shrink-0 opacity-80"
            style={{ filter: LOGO_FILTER_WHITE }}
          />
        </div>
      </div>
    </div>
  )
}
