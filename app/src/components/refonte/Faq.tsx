import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BadgeRow, DGL, Reveal } from './ui'

/**
 * Section 7 — FAQ (fond cream).
 * Accordion premium (animation grid-rows, plus qui pivote en croix)
 * + données structurées FAQPage pour les résultats enrichis Google.
 */

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment se passe l'audit gratuit ?",
    a: "On analyse votre SEO, vos campagnes publicitaires et votre tracking, puis on vous livre un diagnostic complet en 48 h avec un plan d'action priorisé. Sans engagement — et il reste à vous, même si on ne travaille pas ensemble.",
  },
  {
    q: 'Sous combien de temps voit-on des résultats ?',
    a: 'Les campagnes Google Ads et Meta Ads produisent leurs premiers résultats en quelques semaines. Le SEO se construit sur 3 à 6 mois. Dans les deux cas, vous suivez tout en temps réel via votre tableau de bord et le reporting mensuel.',
  },
  {
    q: 'Travaillez-vous uniquement avec des entreprises de Tours ?',
    a: "Non. L'agence est basée à Tours et connaît très bien l'Indre-et-Loire, mais on accompagne des PME partout en France, entièrement à distance quand il le faut.",
  },
  {
    q: 'Comment sont facturés vos accompagnements ?',
    a: "Un forfait mensuel clair, défini après l'audit selon vos objectifs et votre budget publicitaire. Pas de frais cachés, pas d'engagement de 24 mois.",
  },
  {
    q: "Qu'est-ce qui vous différencie d'une agence classique ?",
    a: "On intègre SEO, publicité digitale et automatisation dans une seule stratégie pilotée par la data : chaque euro investi est tracké jusqu'au chiffre d'affaires qu'il génère.",
  },
  {
    q: 'Que contient le reporting mensuel ?',
    a: "Vos KPIs business (leads, coût par lead, ROAS), ce qu'on a fait, ce qu'on a appris et ce qu'on optimise ensuite. En clair, pas en jargon.",
  },
]

const FAQ_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
})

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="v2q-section">
      <style>{FAQ_CSS}</style>
      <script type="application/ld+json">{FAQ_JSONLD}</script>
      <div className="v2-inner">
        <BadgeRow num="7" label="FAQ" />
        <div className="v2q-layout">
          <Reveal>
            <h2 className="v2-h2 v2q-h2">
              Les questions qu'on
              <br className="v2-br-desktop" />
              <span className="v2-space-mobile"> </span>
              nous pose vraiment.
            </h2>
          </Reveal>
          <div className="v2q-list">
            {FAQ.map((item, i) => {
              const isOpen = open === i
              return (
                <Reveal key={item.q} delay={i * 60}>
                  <div className={`v2q-row${isOpen ? ' is-open' : ''}`}>
                    <button
                      className="v2q-question"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <Plus size={20} strokeWidth={1.8} className="v2q-plus" />
                    </button>
                    <div className="v2q-answer-wrap">
                      <p className="v2q-answer">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQ_CSS = `
.v2q-section {
  background: ${DGL.cream};
  padding: 80px 0 96px;
  position: relative;
  z-index: 8;
  border-radius: 28px 28px 0 0;
  margin-top: -28px;
}
@media (min-width: 1024px) { .v2q-section { padding: 120px 0 140px; } }

.v2q-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}
@media (min-width: 1024px) {
  .v2q-layout { grid-template-columns: 5fr 7fr; gap: 64px; align-items: start; }
}
.v2q-h2 { color: ${DGL.navy}; }

.v2q-list { border-top: 1px solid rgba(0,35,41,0.14); }
.v2q-row { border-bottom: 1px solid rgba(0,35,41,0.14); }

.v2q-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  padding: 22px 4px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${DGL.navy};
  transition: color 300ms ease;
}
@media (min-width: 640px) { .v2q-question { font-size: 18px; padding: 26px 4px; } }
.v2q-question:hover { color: ${DGL.coral}; }

.v2q-plus {
  flex-shrink: 0;
  color: ${DGL.coral};
  transition: transform 400ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2q-row.is-open .v2q-plus { transform: rotate(45deg); }

.v2q-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 450ms cubic-bezier(0.22,0.61,0.36,1);
}
.v2q-row.is-open .v2q-answer-wrap { grid-template-rows: 1fr; }
.v2q-answer {
  overflow: hidden;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(0,35,41,0.65);
  margin: 0;
  padding: 0 40px 0 4px;
}
.v2q-row.is-open .v2q-answer { padding-bottom: 26px; }
`
