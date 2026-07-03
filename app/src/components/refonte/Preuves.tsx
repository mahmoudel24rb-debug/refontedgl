import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { BadgeRow, DGL, Reveal } from './ui'

/**
 * Section 5 — RÉALISATIONS (fond blanc) : cases studies avec les
 * résultats réels publiés sur dgl-agency.fr (GYMFIT, Océades, Beauregard).
 * Section 6 — TÉMOIGNAGES (fond cream) : les 3 témoignages du site
 * (Hakim, Samuel, Marion) en méga-citation avec switcher.
 */

const OCEADES_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4'
const GYMFIT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4'

const TESTIMONIALS: { name: string; role: string; quote: string }[] = [
  {
    name: 'Hakim',
    role: 'Directeur, GYMFIT',
    quote:
      'Grâce à DGL Agency, nos campagnes Google Ads et Meta Ads ont boosté les adhésions de notre salle. Le suivi est précis, les optimisations constantes, et les résultats clairement mesurables.',
  },
  {
    name: 'Samuel',
    role: 'Coach professionnel',
    quote:
      'Depuis que nous avons confié notre stratégie digitale à DGL, notre site attire plus de visiteurs locaux et nous recevons deux fois plus de demandes de contact.',
  },
  {
    name: 'Marion',
    role: 'Artisane, Tours',
    quote:
      'Ils ont créé une stratégie complète pour nos réseaux sociaux et notre référencement. Des résultats impressionnants en seulement trois mois !',
  },
]

function CaseCard({
  videoSrc,
  metric,
  title,
  desc,
  hoverLabel,
  wide,
}: {
  videoSrc: string
  metric: string
  title: string
  desc: string
  hoverLabel: string
  wide?: boolean
}) {
  return (
    <div className={`v2r-card${wide ? ' v2r-card-wide' : ''}`}>
      <div className="v2r-media">
        <video src={videoSrc} autoPlay muted loop playsInline />
        <span className="v2r-metric">{metric}</span>
        <div className="v2r-hover-btn">
          <span className="v2r-hover-label">{hoverLabel}</span>
          <ArrowRight size={14} className="v2r-hover-arrow" />
        </div>
      </div>
      <div className="v2r-card-meta">
        <span className="v2r-card-title">{title}</span>
        <span className="v2r-card-desc">{desc}</span>
      </div>
    </div>
  )
}

export default function Preuves() {
  const [active, setActive] = useState(0)
  const t = TESTIMONIALS[active]

  return (
    <>
      <section id="realisations" className="v2r-section">
        <style>{PREUVES_CSS}</style>
        <div className="v2-inner">
          <BadgeRow num="4" label="Réalisations" />
          <Reveal>
            <h2 className="v2-h2 v2r-title">Des résultats, pas des maquettes.</h2>
          </Reveal>

          <div className="v2r-grid">
            <Reveal className="v2r-cell-wide">
              <CaseCard
                wide
                videoSrc={OCEADES_VIDEO}
                metric="+75 % de conversions"
                title="Les Océades"
                desc="Funnel Google Ads + landing page sur mesure : +70 % de trafic SEO pour le centre aquatique."
                hoverLabel="Voir le cas client"
              />
            </Reveal>
            <Reveal delay={120} className="v2r-cell-narrow">
              <CaseCard
                videoSrc={GYMFIT_VIDEO}
                metric="0,78 € par lead"
                title="GYMFIT"
                desc="Campagnes Google Ads & Meta Ads : +500 prospects qualifiés pour la salle de sport."
                hoverLabel="Voir le cas client"
              />
            </Reveal>
          </div>

          {/* Bande Beauregard : cas client sans vidéo, métrique en avant */}
          <Reveal delay={80}>
            <div className="v2r-band">
              <div className="v2r-band-metric">+29 %</div>
              <div className="v2r-band-text">
                <span className="v2r-card-title">Parc de Beauregard</span>
                <span className="v2r-card-desc">
                  de leads générés grâce au SEO local et aux campagnes saisonnières.
                </span>
              </div>
              <img
                src="/assets/logos/beauregard.webp"
                alt="Parc de Beauregard"
                className="v2r-band-logo"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="temoignages" className="v2t-section">
        <div className="v2-inner">
          <BadgeRow num="5" label="Témoignages" />
          <div className="v2t-switcher" role="tablist" aria-label="Témoignages clients">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                role="tab"
                aria-selected={active === i}
                className={`v2t-tab${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <blockquote key={t.name} className="v2t-quote">
            <p>«&nbsp;{t.quote}&nbsp;»</p>
            <footer>
              <span className="v2t-name">{t.name}</span>
              <span className="v2t-role"> — {t.role}</span>
            </footer>
          </blockquote>
        </div>
      </section>
    </>
  )
}

const PREUVES_CSS = `
/* ===== Réalisations (blanc) ===== */
.v2r-section {
  background: ${DGL.white};
  padding: 80px 0 96px;
}
@media (min-width: 1024px) { .v2r-section { padding: 120px 0 140px; } }

.v2r-title {
  color: ${DGL.navy};
  margin-bottom: 56px;
}
@media (min-width: 1024px) { .v2r-title { margin-bottom: 88px; } }

.v2r-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
@media (min-width: 900px) {
  .v2r-grid { grid-template-columns: 7fr 5fr; gap: 28px; margin-bottom: 28px; }
}
.v2r-cell-wide, .v2r-cell-narrow { min-width: 0; }

.v2r-card { display: flex; flex-direction: column; height: 100%; }
.v2r-media {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: ${DGL.navy};
  cursor: pointer;
  aspect-ratio: 4 / 3;
  flex: 1;
}
.v2r-card-wide .v2r-media { aspect-ratio: 16 / 10; }
.v2r-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Métrique en chip */
.v2r-metric {
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${DGL.white};
  color: ${DGL.navy};
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

/* Bouton qui s'étend au hover */
.v2r-hover-btn {
  position: absolute;
  bottom: 16px;
  left: 16px;
  height: 38px;
  width: 38px;
  border-radius: 999px;
  background: ${DGL.coral};
  color: ${DGL.white};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px 0 16px;
  overflow: hidden;
  transition: width 300ms ease-in-out;
}
.v2r-media:hover .v2r-hover-btn { width: 172px; }
.v2r-hover-label {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 300ms 100ms;
}
.v2r-media:hover .v2r-hover-label { opacity: 1; }
.v2r-hover-arrow {
  flex-shrink: 0;
  transform: rotate(-45deg);
  transition: transform 300ms;
}
.v2r-media:hover .v2r-hover-arrow { transform: rotate(0deg); }

.v2r-card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 16px;
}
.v2r-card-title {
  font-size: 16px;
  font-weight: 600;
  color: ${DGL.navy};
}
.v2r-card-desc {
  font-size: 14px;
  line-height: 1.55;
  color: rgba(0,35,41,0.6);
}

/* Bande Beauregard */
.v2r-band {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${DGL.cream};
  border-radius: 20px;
  padding: 32px;
}
@media (min-width: 900px) {
  .v2r-band {
    flex-direction: row;
    align-items: center;
    gap: 48px;
    padding: 40px 48px;
  }
}
.v2r-band-metric {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${DGL.coral};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.v2r-band-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.v2r-band-logo {
  height: 52px;
  width: auto;
  object-fit: contain;
  align-self: flex-start;
  /* logo livré en blanc → monochrome navy sur fond cream */
  filter: brightness(0) invert(13%) sepia(21%) saturate(1600%) hue-rotate(140deg);
  opacity: 0.85;
}
@media (min-width: 900px) { .v2r-band-logo { align-self: center; } }

/* ===== Témoignages (cream) ===== */
.v2t-section {
  background: ${DGL.cream};
  padding: 80px 0 96px;
}
@media (min-width: 1024px) { .v2t-section { padding: 120px 0 140px; } }

.v2t-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.v2t-tab {
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,35,41,0.55);
  background: none;
  border: 1px solid rgba(0,35,41,0.18);
  border-radius: 999px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 300ms ease;
}
.v2t-tab:hover { color: ${DGL.navy}; border-color: rgba(0,35,41,0.4); }
.v2t-tab.is-active {
  background: ${DGL.navy};
  border-color: ${DGL.navy};
  color: ${DGL.white};
}

.v2t-quote {
  margin: 0;
  animation: v2tFade 450ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2t-quote p {
  font-size: clamp(1.4rem, 3.2vw, 2.6rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${DGL.navy};
  max-width: 1000px;
  margin: 0 0 28px;
}
.v2t-name {
  font-size: 15px;
  font-weight: 600;
  color: ${DGL.navy};
}
.v2t-role {
  font-size: 15px;
  color: rgba(0,35,41,0.55);
}
@keyframes v2tFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
`
