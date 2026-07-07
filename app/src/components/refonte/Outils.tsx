import { ArrowUpRight, Calculator, FileText, Gauge, Sparkles } from 'lucide-react'
import { BadgeRow, DGL, Reveal } from './ui'

/**
 * Section 6 — OUTILS GRATUITS (fond blanc).
 * Les 4 lead magnets réels de dgl-agency.fr en cartes premium :
 * un halo coral suit le curseur dans chaque carte (variables CSS
 * --mx/--my mises à jour au mousemove), flèche qui glisse au hover.
 */

const OUTILS: {
  Icon: typeof Calculator
  title: string
  desc: string
  tag: string
  href: string
}[] = [
  {
    Icon: Calculator,
    title: 'Simulateur de ROI',
    desc: "Estimez le retour sur investissement de vos campagnes avant de dépenser un euro.",
    tag: 'Calculateur',
    href: 'https://dgl-agency.fr/simulateur-de-roi/',
  },
  {
    Icon: Gauge,
    title: 'Test PageSpeed',
    desc: 'Mesurez la vitesse réelle de votre site et son impact sur vos conversions.',
    tag: 'Audit technique',
    href: 'https://dgl-agency.fr/pagespeed-tool/',
  },
  {
    Icon: Sparkles,
    title: 'Générateur de stratégie IA',
    desc: 'Un plan marketing 90 jours personnalisé selon votre secteur, vos objectifs et votre budget.',
    tag: 'IA',
    href: 'https://dgl-agency.fr/generateur-strategie-marketing/',
  },
  {
    Icon: FileText,
    title: 'Cahier des charges IA',
    desc: 'Générez le cahier des charges de votre projet web en quelques minutes.',
    tag: 'IA',
    href: 'https://dgl-agency.fr/cahier-de-charges/',
  },
]

function OutilCard({
  Icon,
  title,
  desc,
  tag,
  href,
}: (typeof OUTILS)[number]) {
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }
  return (
    <a
      className="v2o-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
    >
      <div className="v2o-card-top">
        <span className="v2o-icon">
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <span className="v2o-tag">{tag}</span>
      </div>
      <h3 className="v2o-title">{title}</h3>
      <p className="v2o-desc">{desc}</p>
      <span className="v2o-try">
        Essayer gratuitement
        <ArrowUpRight size={15} className="v2o-try-arrow" />
      </span>
    </a>
  )
}

export default function Outils() {
  return (
    <section id="outils" className="v2o-section">
      <style>{OUTILS_CSS}</style>
      <div className="v2-inner">
        <BadgeRow num="6" label="Outils gratuits" />
        <Reveal>
          <h2 className="v2-h2 v2o-h2">Testez avant d'investir.</h2>
        </Reveal>
        <div className="v2o-grid">
          {OUTILS.map((o, i) => (
            <Reveal key={o.title} delay={i * 90}>
              <OutilCard {...o} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const OUTILS_CSS = `
.v2o-section {
  background: ${DGL.white};
  padding: 80px 0 96px;
  position: relative;
  z-index: 7;
  border-radius: 28px 28px 0 0;
  margin-top: -28px;
}
@media (min-width: 1024px) { .v2o-section { padding: 120px 0 140px; } }

.v2o-h2 {
  color: ${DGL.navy};
  margin-bottom: 56px;
}
@media (min-width: 1024px) { .v2o-h2 { margin-bottom: 88px; } }

.v2o-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 640px) { .v2o-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1200px) { .v2o-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
.v2o-grid > * { min-width: 0; height: 100%; }

.v2o-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${DGL.cream};
  border: 1px solid rgba(0,35,41,0.06);
  border-radius: 20px;
  padding: 26px 24px 24px;
  text-decoration: none;
  overflow: hidden;
  transition: transform 350ms cubic-bezier(0.22,0.61,0.36,1),
              box-shadow 350ms ease, border-color 350ms ease;
}
.v2o-card:hover {
  transform: translateY(-4px);
  border-color: rgba(254,87,82,0.35);
  box-shadow: 0 18px 44px rgba(0,35,41,0.10);
}
/* halo coral qui suit le curseur */
.v2o-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%),
              rgba(254,87,82,0.13), transparent 65%);
  opacity: 0;
  transition: opacity 350ms ease;
  pointer-events: none;
}
.v2o-card:hover::before { opacity: 1; }
.v2o-card > * { position: relative; }

.v2o-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.v2o-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(254,87,82,0.12);
  color: ${DGL.coral};
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.v2o-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(0,35,41,0.45);
  border: 1px solid rgba(0,35,41,0.12);
  border-radius: 999px;
  padding: 4px 10px;
}
.v2o-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${DGL.navy};
  margin: 0 0 8px;
}
.v2o-desc {
  font-size: 14px;
  line-height: 1.55;
  color: rgba(0,35,41,0.6);
  margin: 0 0 24px;
  flex: 1;
}
.v2o-try {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${DGL.coral};
}
.v2o-try-arrow {
  transition: transform 300ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2o-card:hover .v2o-try-arrow { transform: translate(3px, -3px); }
`
