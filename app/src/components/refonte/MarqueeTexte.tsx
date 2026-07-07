import { DGL } from './ui'

/**
 * Bandeau typographique géant entre l'agence et les services :
 * les expertises DGL défilent en très grand, lettres détourées navy
 * (text-stroke) séparées par des astérisques coral pleins.
 * Purement décoratif → aria-hidden, coupé aux lecteurs d'écran.
 */

const WORDS = [
  'SEO',
  'Google Ads',
  'Meta Ads',
  'Automatisation',
  'Landing pages',
  'Data',
]

function Half() {
  return (
    <div className="v2x-half">
      {WORDS.map((w) => (
        <span key={w} className="v2x-item">
          <span className="v2x-word">{w}</span>
          <span className="v2x-sep">✳</span>
        </span>
      ))}
    </div>
  )
}

export default function MarqueeTexte() {
  return (
    <div className="v2x-band" aria-hidden>
      <style>{MARQUEE_CSS}</style>
      <div className="v2x-track">
        <Half />
        <Half />
      </div>
    </div>
  )
}

const MARQUEE_CSS = `
.v2x-band {
  background: ${DGL.white};
  overflow: hidden;
  /* le bas est recouvert par l'arrondi de la section services (-28px) */
  padding: 8px 0 96px;
  position: relative;
  z-index: 2;
}
.v2x-track {
  display: flex;
  width: max-content;
  animation: v2xScroll 46s linear infinite;
}
.v2x-half {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.v2x-item {
  display: inline-flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  padding-right: clamp(1.5rem, 3vw, 3rem);
}
.v2x-word {
  font-size: clamp(3.2rem, 8.5vw, 7.5rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.1;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(0, 35, 41, 0.32);
  transition: color 400ms ease, -webkit-text-stroke-color 400ms ease;
}
.v2x-item:hover .v2x-word {
  color: ${DGL.navy};
  -webkit-text-stroke-color: ${DGL.navy};
}
.v2x-sep {
  font-size: clamp(1.6rem, 4vw, 3.4rem);
  color: ${DGL.coral};
  line-height: 1;
}
@keyframes v2xScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
`
