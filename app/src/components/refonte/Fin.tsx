import { ArrowRight } from 'lucide-react'
import { DGL, Reveal, TextRoll } from './ui'

/**
 * Section 7 — CTA FINAL + FOOTER (fond navy).
 * L'offre d'entrée réelle du site : audit SEO & Ads gratuit livré en 48 h.
 * Footer avec les 3 familles de liens du site WordPress (services, agence,
 * outils gratuits) et le wordmark géant coupé — la sortie de page signature.
 */

const FOOTER_COLS: { title: string; links: string[] }[] = [
  {
    title: 'Services',
    links: [
      'Publicité digitale',
      'Référencement naturel',
      'Génération de leads',
      'Landing pages',
      'Automatisation marketing',
      'Stratégie digitale',
    ],
  },
  {
    title: 'Agence',
    links: ['À propos', 'Réalisations', 'Blog', 'Carrières', 'Contact'],
  },
  {
    title: 'Outils gratuits',
    links: [
      'Simulateur de ROI',
      'Test PageSpeed',
      'Générateur de stratégie IA',
      'Cahier des charges IA',
      'Machine à leads',
    ],
  },
]

export default function Fin() {
  return (
    <section id="contact" className="v2f-section">
      <style>{FIN_CSS}</style>

      {/* CTA final */}
      <div className="v2-inner v2f-cta">
        <Reveal>
          <span className="v2f-eyebrow">Audit gratuit</span>
          <h2 className="v2f-title">
            Votre acquisition mérite
            <br className="v2-br-desktop" />
            <span className="v2-space-mobile"> </span>
            un vrai diagnostic.
          </h2>
          <p className="v2f-sub">
            Audit SEO &amp; Ads complet de votre présence en ligne, livré en 48&nbsp;h,
            sans engagement.
          </p>
          <div className="v2f-cta-row">
            <a className="v2-cta-primary group" href="#contact">
              <TextRoll>Réserver mon audit gratuit</TextRoll>
              <span className="v2-cta-primary-arrow">
                <ArrowRight size={14} color={DGL.coral} />
              </span>
            </a>
            <a className="v2f-ghost-link" href="#contact">
              Tester le simulateur de ROI
              <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="v2f-footer">
        <div className="v2-inner v2f-footer-grid">
          <div className="v2f-brand">
            <img
              src="/assets/logos/logo-dgl-agency.webp"
              alt="DGL Agency"
              className="v2f-brand-logo"
              loading="lazy"
            />
            <p>
              Agence digitale à Tours.
              <br />
              SEO, Ads &amp; automatisation pour les PME
              <br />
              qui veulent des résultats mesurables.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="v2f-col">
              <span className="v2f-col-title">{col.title}</span>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="v2-inner v2f-legal">
          <span>© 2026 DGL Agency — Tours, Indre-et-Loire</span>
          <span className="v2f-legal-links">
            <a href="#">Mentions légales</a>
            <a href="#">CGV</a>
          </span>
        </div>

        {/* Wordmark géant coupé en pied de page */}
        <div className="v2f-wordmark" aria-hidden>
          DGL AGENCY
        </div>
      </footer>
    </section>
  )
}

const FIN_CSS = `
.v2f-section {
  background: ${DGL.navy};
  color: ${DGL.white};
  position: relative;
  z-index: 7;
  border-radius: 28px 28px 0 0;
  margin-top: -28px;
}

/* CTA */
.v2f-cta {
  padding-top: 110px;
  padding-bottom: 90px;
  text-align: center;
}
@media (min-width: 1024px) {
  .v2f-cta { padding-top: 160px; padding-bottom: 130px; }
}
.v2f-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${DGL.coral};
  margin-bottom: 24px;
}
.v2f-title {
  font-size: clamp(2.2rem, 6.5vw, 5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: ${DGL.white};
  margin: 0 0 24px;
}
.v2f-sub {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255,255,255,0.65);
  max-width: 460px;
  margin: 0 auto 40px;
}
@media (min-width: 640px) { .v2f-sub { font-size: 17px; } }
.v2f-cta-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
@media (min-width: 640px) {
  .v2f-cta-row { flex-direction: row; justify-content: center; gap: 28px; }
}
.v2f-ghost-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  transition: color 300ms;
}
.v2f-ghost-link:hover { color: ${DGL.white}; }

/* Footer */
.v2f-footer {
  border-top: 1px solid rgba(255,255,255,0.12);
  overflow: hidden;
}
.v2f-footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding-top: 64px;
  padding-bottom: 56px;
}
@media (min-width: 640px) {
  .v2f-footer-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .v2f-footer-grid {
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 48px;
    padding-top: 80px;
    padding-bottom: 72px;
  }
}
.v2f-brand-logo {
  height: 30px;
  width: auto;
  object-fit: contain;
  /* wordmark navy sur fond navy → on le passe en blanc */
  filter: brightness(0) invert(1);
  margin-bottom: 18px;
}
.v2f-brand p {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(255,255,255,0.55);
  margin: 0;
}
.v2f-col-title {
  display: block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin-bottom: 18px;
}
.v2f-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.v2f-col a {
  font-size: 14px;
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  transition: color 300ms;
}
.v2f-col a:hover { color: ${DGL.coral}; }

.v2f-legal {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 24px;
  padding-bottom: 28px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
@media (min-width: 640px) {
  .v2f-legal { flex-direction: row; justify-content: space-between; align-items: center; }
}
.v2f-legal-links { display: flex; gap: 20px; }
.v2f-legal a {
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  transition: color 300ms;
}
.v2f-legal a:hover { color: rgba(255,255,255,0.8); }

/* Wordmark géant, volontairement coupé par le bas de page */
.v2f-wordmark {
  font-size: clamp(3.6rem, 13.5vw, 13.5rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 0.76;
  text-align: center;
  white-space: nowrap;
  color: ${DGL.coral};
  transform: translateY(18%);
  user-select: none;
  pointer-events: none;
}
`
