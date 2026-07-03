import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { DGL } from './ui'

/**
 * Navbar sticky de la refonte : invisible tant qu'on est dans le hero
 * (qui embarque son propre header), elle apparaît dès qu'on remonte la
 * page ou qu'on a dépassé le hero. Se cache quand on scrolle vers le bas
 * pour laisser le contenu respirer.
 *
 * `topOffset` : décalage en px depuis le haut du viewport (60 dans la vue
 * /composant/[slug] pour passer sous la topbar fixe de 48px, 12 sinon).
 */

const LINKS: { label: string; href: string }[] = [
  { label: 'Services', href: '#services' },
  { label: 'Méthode', href: '#methode' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Agence', href: '#agence' },
]

export default function StickyNav({ topOffset = 12 }: { topOffset?: number }) {
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const pastHero = y > window.innerHeight * 0.9
        const scrollingUp = y < lastY.current - 2
        const scrollingDown = y > lastY.current + 2
        if (!pastHero) setVisible(false)
        else if (scrollingUp) setVisible(true)
        else if (scrollingDown) setVisible(false)
        lastY.current = y
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className={`v2n-wrap${visible ? ' is-visible' : ''}`}
      style={{ top: topOffset }}
    >
      <style>{STICKY_CSS}</style>
      <nav className="v2n-bar" aria-label="Navigation">
        <a href="#top" className="v2n-logo" aria-label="Haut de page">
          DGL
        </a>
        <ul className="v2n-links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="v2n-cta">
          Audit gratuit
          <ArrowRight size={13} />
        </a>
      </nav>
    </div>
  )
}

const STICKY_CSS = `
.v2n-wrap {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  pointer-events: none;
  transform: translateY(calc(-100% - 80px));
  opacity: 0;
  transition: transform 450ms cubic-bezier(0.22,0.61,0.36,1), opacity 300ms ease;
}
.v2n-wrap.is-visible {
  transform: translateY(0);
  opacity: 1;
}
.v2n-bar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0,35,41,0.82);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}
.v2n-logo {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${DGL.white};
  text-decoration: none;
}
.v2n-links {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 18px;
}
@media (min-width: 768px) {
  .v2n-links { display: flex; }
}
.v2n-links a {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  transition: color 250ms;
}
.v2n-links a:hover { color: ${DGL.white}; }
.v2n-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${DGL.coral};
  color: ${DGL.white};
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 999px;
  text-decoration: none;
  transition: background 250ms;
}
.v2n-cta:hover { background: ${DGL.coralHover}; }
@media (prefers-reduced-motion: reduce) {
  .v2n-wrap { transition: opacity 200ms ease; transform: none; }
  .v2n-wrap:not(.is-visible) { visibility: hidden; }
}
`
