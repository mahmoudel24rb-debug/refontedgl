import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BadgeRow, DGL, Reveal } from './ui'

/**
 * Section 3 — NOS SERVICES (fond navy, l'inversion sombre de la page).
 * Les 6 services réels de dgl-agency.fr/nos-services/ en lignes pleine
 * largeur : au hover (desktop) ou au tap (mobile), un balayage coral
 * monte du bas de la ligne et révèle description + expertises.
 *
 * Section 4 — LA MÉTHODE (fond cream). Vraie séquence → numérotation.
 */

const SERVICES: { title: string; desc: string; tags: string[] }[] = [
  {
    title: 'Publicité digitale',
    desc: 'Campagnes Google Ads, Meta Ads et remarketing orientées conversion — pas des impressions, des clients.',
    tags: ['Google Ads', 'Meta Ads', 'Remarketing'],
  },
  {
    title: 'Référencement naturel',
    desc: 'Première page de Google, durablement : audits techniques, contenus qui rankent et SEO local.',
    tags: ['Audit technique', 'Contenu', 'SEO local'],
  },
  {
    title: 'Génération de leads',
    desc: 'Des funnels ciblés qui produisent un flux continu de prospects qualifiés pour vos équipes.',
    tags: ['Funnels', 'Tracking', 'CRO'],
  },
  {
    title: 'Landing pages',
    desc: "Pages d'atterrissage haute conversion, testées et mesurées sur chaque clic.",
    tags: ['Design', 'A/B testing', 'Analytics'],
  },
  {
    title: 'Automatisation marketing',
    desc: 'Emails, CRM et parcours clients automatisés pour convertir et fidéliser sans effort manuel.',
    tags: ['Email', 'CRM', 'Workflows'],
  },
  {
    title: 'Stratégie digitale',
    desc: "Un plan d'acquisition complet piloté par vos objectifs business — pas par des vanity metrics.",
    tags: ['Positionnement', 'KPIs', 'Plan 90 jours'],
  },
]

const STEPS: { n: string; title: string; desc: string }[] = [
  {
    n: '01',
    title: 'Audit SEO & Ads gratuit',
    desc: "Diagnostic complet de votre acquisition en 48 h, avec plan d'action priorisé.",
  },
  {
    n: '02',
    title: 'Stratégie sur mesure',
    desc: 'Un plan piloté par vos objectifs business et vos KPIs, pas par un template.',
  },
  {
    n: '03',
    title: 'Déploiement express',
    desc: 'Campagnes, tracking et landing pages en production en 15 jours.',
  },
  {
    n: '04',
    title: 'Optimisation continue',
    desc: 'Reporting mensuel transparent et itérations constantes pour maximiser le ROI.',
  },
]

export default function Services() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <section id="services" className="v2s-section">
        <style>{SERVICES_CSS}</style>
        <div className="v2-inner">
          <BadgeRow num="2" label="Nos services" tone="light" />
          <Reveal>
            <h2 className="v2-h2 v2s-title">
              Tout ce qu'il faut pour acquérir,
              <br className="v2-br-desktop" /> convertir et fidéliser.
            </h2>
          </Reveal>
        </div>

        <div className="v2s-list">
          {SERVICES.map((s, i) => {
            const isOpen = open === i
            return (
              <div key={s.title} className={`v2s-row${isOpen ? ' is-open' : ''}`}>
                <button
                  className="v2s-row-head"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="v2s-row-title">{s.title}</span>
                  <ArrowUpRight className="v2s-row-arrow" size={28} strokeWidth={1.5} />
                </button>
                <div className="v2s-row-body">
                  <div className="v2s-row-body-inner">
                    <p className="v2s-row-desc">{s.desc}</p>
                    <div className="v2s-row-tags">
                      {s.tags.map((t) => (
                        <span key={t} className="v2s-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="methode" className="v2m-section">
        <div className="v2-inner">
          <BadgeRow num="3" label="La méthode" />
          <Reveal>
            <h2 className="v2-h2 v2m-title">
              Une méthode rodée,
              <br className="v2-br-desktop" /> zéro boîte noire.
            </h2>
          </Reveal>
          <div className="v2m-steps">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="v2m-step">
                  <span className="v2m-step-num">{step.n}</span>
                  <h3 className="v2m-step-title">{step.title}</h3>
                  <p className="v2m-step-desc">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const SERVICES_CSS = `
/* ===== Services (navy) ===== */
.v2s-section {
  background: ${DGL.navy};
  padding: 80px 0 96px;
}
@media (min-width: 1024px) { .v2s-section { padding: 120px 0 140px; } }

.v2s-title {
  color: ${DGL.white};
  margin-bottom: 56px;
}
@media (min-width: 1024px) { .v2s-title { margin-bottom: 88px; } }

.v2s-list {
  border-top: 1px solid rgba(255,255,255,0.14);
}
.v2s-row {
  position: relative;
  border-bottom: 1px solid rgba(255,255,255,0.14);
  overflow: hidden;
}
/* Balayage coral qui monte du bas */
.v2s-row::before {
  content: '';
  position: absolute;
  inset: 0;
  background: ${DGL.coral};
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 450ms cubic-bezier(0.22,0.61,0.36,1);
  pointer-events: none;
}
.v2s-row.is-open::before { transform: scaleY(1); }
@media (hover: hover) {
  .v2s-row:hover::before { transform: scaleY(1); }
}

.v2s-row-head {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  max-width: 1440px;
  margin: 0 auto;
  padding: 26px 20px;
}
@media (min-width: 640px) { .v2s-row-head { padding: 30px 32px; } }
@media (min-width: 1024px) { .v2s-row-head { padding: 34px 48px; } }

.v2s-row-title {
  font-size: clamp(1.5rem, 4.2vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: ${DGL.white};
  transition: color 350ms ease, transform 450ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2s-row-arrow {
  color: rgba(255,255,255,0.4);
  flex-shrink: 0;
  transition: color 350ms ease, transform 450ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2s-row.is-open .v2s-row-title { color: ${DGL.navy}; transform: translateX(10px); }
.v2s-row.is-open .v2s-row-arrow { color: ${DGL.navy}; transform: rotate(45deg); }
@media (hover: hover) {
  .v2s-row:hover .v2s-row-title { color: ${DGL.navy}; transform: translateX(10px); }
  .v2s-row:hover .v2s-row-arrow { color: ${DGL.navy}; transform: rotate(45deg); }
}

.v2s-row-body {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 450ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2s-row.is-open .v2s-row-body { grid-template-rows: 1fr; }
@media (hover: hover) {
  .v2s-row:hover .v2s-row-body { grid-template-rows: 1fr; }
}
.v2s-row-body-inner {
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}
@media (min-width: 640px) { .v2s-row-body-inner { padding: 0 32px; } }
@media (min-width: 1024px) { .v2s-row-body-inner { padding: 0 48px; } }

.v2s-row-desc {
  font-size: 15px;
  line-height: 1.55;
  color: rgba(0,35,41,0.85);
  max-width: 560px;
  margin: 0 0 16px;
}
@media (min-width: 640px) { .v2s-row-desc { font-size: 16px; } }
.v2s-row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 28px;
}
.v2s-tag {
  font-size: 12px;
  font-weight: 500;
  color: ${DGL.navy};
  border: 1px solid rgba(0,35,41,0.35);
  border-radius: 999px;
  padding: 4px 12px;
}

/* ===== Méthode (cream) ===== */
.v2m-section {
  background: ${DGL.cream};
  padding: 80px 0 96px;
}
@media (min-width: 1024px) { .v2m-section { padding: 120px 0 140px; } }

.v2m-title {
  color: ${DGL.navy};
  margin-bottom: 56px;
}
@media (min-width: 1024px) { .v2m-title { margin-bottom: 88px; } }

.v2m-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px 28px;
}
@media (min-width: 640px) { .v2m-steps { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .v2m-steps { grid-template-columns: repeat(4, 1fr); } }

.v2m-step {
  border-top: 1px solid rgba(0,35,41,0.18);
  padding-top: 20px;
}
.v2m-step-num {
  font-size: 13px;
  font-weight: 600;
  color: ${DGL.coral};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}
.v2m-step-title {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${DGL.navy};
  margin: 14px 0 10px;
}
.v2m-step-desc {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(0,35,41,0.62);
  margin: 0;
}
`
