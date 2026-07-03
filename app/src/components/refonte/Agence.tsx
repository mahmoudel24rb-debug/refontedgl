import { useEffect, useRef, useState } from 'react'
import { BadgeRow, DGL, Reveal, useInView } from './ui'

/**
 * Section 2 — L'AGENCE (fond blanc).
 * Bande marquee logos clients, manifesto révélé mot à mot au scroll
 * (l'élément signature de la page), stats animées en compteur, équipe.
 * Contenu : chiffres réels du site dgl-agency.fr.
 */

const LOGOS: { src: string; alt: string }[] = [
  { src: '/assets/logos/oceades.webp', alt: 'Les Océades' },
  { src: '/assets/logos/gymfit.webp', alt: 'GYMFIT' },
  { src: '/assets/logos/beauregard.webp', alt: 'Parc de Beauregard' },
  { src: '/assets/logos/epicure.webp', alt: 'Epicure Social Club' },
  { src: '/assets/logos/ipms.webp', alt: 'IPMS' },
]

const MANIFESTO =
  "À Tours et partout en France, on aide les PME à transformer leur visibilité en chiffre d'affaires. SEO, Google Ads, Meta Ads, automatisation : tout est intégré dans une seule stratégie, chaque euro investi est tracké, chaque décision est mesurée."

const STATS: { value: number; prefix?: string; suffix?: string; label: string }[] = [
  { value: 10, suffix: ' ans', label: "d'expertise digitale" },
  { value: 500, suffix: '+', label: 'clients accompagnés' },
  { value: 65, prefix: '+', suffix: ' %', label: 'de ROI moyen constaté' },
  { value: 120, suffix: '+', label: 'campagnes actives' },
]

const TEAM: { src: string; name: string; role: string }[] = [
  {
    src: '/composant-hero/team/Image-Equipe-Mahmoud.webp',
    name: 'Mahmoud',
    role: 'Stratégie & SEO',
  },
  {
    src: '/composant-hero/team/Image-Equipe-Kiara.webp',
    name: 'Kiara',
    role: 'Création & Contenus',
  },
  {
    src: '/composant-hero/team/Image-Equipe-Victor.webp',
    name: 'Victor',
    role: 'Acquisition & Data',
  },
]

/* Le paragraphe signature : chaque mot passe de 12% à 100% d'opacité
   au fil du scroll, piloté par la position de l'élément dans le viewport. */
function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const p = (vh * 0.88 - rect.top) / (vh * 0.55)
        setProgress(Math.min(1, Math.max(0, p)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const words = text.split(' ')
  return (
    <p ref={ref} className="v2a-manifesto">
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: i / words.length < progress ? 1 : 0.12,
            transition: 'opacity 350ms ease',
          }}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  )
}

function Stat({
  value,
  prefix = '',
  suffix = '',
  label,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const start = performance.now()
    const duration = 1400
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <div ref={ref} className="v2a-stat">
      <div className="v2a-stat-value">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="v2a-stat-label">{label}</div>
    </div>
  )
}

function MarqueeHalf() {
  return (
    <div className="v2a-marquee-half" aria-hidden>
      {LOGOS.map((l) => (
        <img key={l.alt} src={l.src} alt={l.alt} loading="lazy" />
      ))}
    </div>
  )
}

export default function Agence() {
  return (
    <section id="agence" className="v2a-section">
      <style>{AGENCE_CSS}</style>
      <div className="v2-inner">
        {/* Bande logos clients */}
        <div className="v2a-trust">
          <span className="v2a-trust-label">Ils nous font confiance</span>
          <div className="v2a-marquee">
            <div className="v2a-marquee-track">
              <MarqueeHalf />
              <MarqueeHalf />
            </div>
          </div>
        </div>

        <BadgeRow num="1" label="L'agence DGL" />

        <WordReveal text={MANIFESTO} />

        {/* Stats */}
        <div className="v2a-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <Stat {...s} />
            </Reveal>
          ))}
        </div>

        {/* Équipe */}
        <div className="v2a-team">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 110}>
              <figure className="v2a-member">
                <div className="v2a-member-photo">
                  <img src={m.src} alt={`${m.name} — équipe DGL Agency`} loading="lazy" />
                </div>
                <figcaption>
                  <span className="v2a-member-name">{m.name}</span>
                  <span className="v2a-member-role">{m.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const AGENCE_CSS = `
.v2a-section {
  background: ${DGL.white};
  padding: 0 0 72px;
  overflow: hidden;
}
@media (min-width: 1024px) { .v2a-section { padding-bottom: 120px; } }

/* Bande de confiance */
.v2a-trust {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 36px 0;
  border-bottom: 1px solid rgba(0,35,41,0.08);
  margin-bottom: 64px;
}
@media (min-width: 1024px) {
  .v2a-trust {
    flex-direction: row;
    align-items: center;
    gap: 48px;
    padding: 44px 0;
    margin-bottom: 110px;
  }
}
.v2a-trust-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0,35,41,0.55);
  flex-shrink: 0;
}
.v2a-marquee {
  overflow: hidden;
  flex: 1;
  min-width: 0;
  mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
}
.v2a-marquee-track {
  display: flex;
  width: max-content;
  animation: v2aScroll 34s linear infinite;
  opacity: 0.75;
}
.v2a-marquee:hover .v2a-marquee-track { animation-play-state: paused; }
.v2a-marquee-half {
  display: flex;
  align-items: center;
  gap: clamp(2.5rem, 6vw, 5.5rem);
  padding-right: clamp(2.5rem, 6vw, 5.5rem);
  flex-shrink: 0;
}
.v2a-marquee-half img {
  height: 40px;
  width: auto;
  object-fit: contain;
  /* logos livrés en blanc → monochrome navy pour rester lisibles sur blanc */
  filter: brightness(0) invert(13%) sepia(21%) saturate(1600%) hue-rotate(140deg);
  opacity: 0.75;
}
@keyframes v2aScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Manifesto mot-à-mot */
.v2a-manifesto {
  font-size: clamp(1.5rem, 3.4vw, 2.9rem);
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: ${DGL.navy};
  max-width: 1120px;
  margin: 0 0 72px;
}
@media (min-width: 1024px) { .v2a-manifesto { margin-bottom: 110px; } }

/* Stats */
.v2a-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 24px;
  margin-bottom: 72px;
}
@media (min-width: 900px) {
  .v2a-stats { grid-template-columns: repeat(4, 1fr); margin-bottom: 120px; }
}
.v2a-stat {
  border-top: 1px solid rgba(0,35,41,0.14);
  padding-top: 20px;
}
.v2a-stat-value {
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${DGL.coral};
  font-variant-numeric: tabular-nums;
}
.v2a-stat-label {
  font-size: 14px;
  color: rgba(0,35,41,0.6);
  margin-top: 10px;
}

/* Équipe */
.v2a-team {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 640px) { .v2a-team { grid-template-columns: repeat(3, 1fr); } }
.v2a-member { margin: 0; }
.v2a-member-photo {
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: ${DGL.cream};
}
.v2a-member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 700ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2a-member:hover .v2a-member-photo img { transform: scale(1.045); }
.v2a-member figcaption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
}
.v2a-member-name {
  font-size: 16px;
  font-weight: 600;
  color: ${DGL.navy};
}
.v2a-member-role {
  font-size: 13px;
  color: rgba(0,35,41,0.55);
}
`
