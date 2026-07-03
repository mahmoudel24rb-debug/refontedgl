import { Component, useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, Clock, Menu, X } from 'lucide-react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'
import { DGL, TextRoll } from '@/components/refonte/ui'

/**
 * Section 1 — HERO (conservé tel quel de la v1 du prototype).
 * Stack shader Paper Design (Swirl + ChromaFlow + FlutedGlass + FilmGrain)
 * + navbar pill blanche avec horloge Paris + H1 + CTA + badge partenaire.
 * Seule évolution : les liens/CTA pointent vers les ancres des sections.
 */

// Si le shader stack throw (WebGL indispo, contexte GPU perdu, etc.),
// on garde le reste du hero visible avec juste le fond cream.
class ShaderBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('[refontev2] shader stack failed, falling back:', err)
  }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Services', href: '#services' },
  { label: 'Agence', href: '#agence' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Contact', href: '#contact' },
]

const PARTNER_SVG_PATH =
  'm19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z'

function useParisTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      setTime(formatter.format(now))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const time = useParisTime()

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 48px)',
        background: DGL.cream,
        overflow: 'hidden',
      }}
    >
      <style>{HERO_CSS}</style>

      {/* Shader stack fullscreen */}
      <div className="v2-shader-stack">
        <ShaderBoundary>
          <Shader style={{ width: '100%', height: '100%' }}>
            <Swirl colorA={DGL.white} colorB="#F0EFE9" detail={1.7} />
            <ChromaFlow
              baseColor={DGL.white}
              downColor={DGL.coral}
              leftColor={DGL.coral}
              rightColor={DGL.coral}
              upColor={DGL.coral}
              momentum={13}
              radius={3.5}
            />
            <FlutedGlass
              aberration={0.61}
              angle={31}
              frequency={8}
              highlight={0.12}
              highlightSoftness={0}
              lightAngle={-90}
              refraction={4}
              shape="rounded"
              softness={1}
              speed={0.15}
            />
            <FilmGrain strength={0.05} />
          </Shader>
        </ShaderBoundary>
      </div>

      {/* Navbar */}
      <div className="v2-nav-wrap">
        <nav className="v2-nav">
          {/* Left */}
          <div className="v2-nav-left">
            <div className="v2-logo">DGL</div>
            <ul className="v2-nav-links">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="v2-nav-right">
            <span className="v2-nav-status">Nouveaux projets Q3 2026</span>
            <span className="v2-nav-time">
              <Clock size={14} />
              {time} à Paris
            </span>
            <a className="v2-nav-cta group" href="#contact">
              <TextRoll>Réserver un call stratégie</TextRoll>
              <span className="v2-nav-cta-arrow">
                <ArrowRight size={12} />
              </span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="v2-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={16} color={DGL.white} />
          </button>
        </nav>
      </div>

      {/* Hero content */}
      <div className="v2-hero-content">
        <div className="v2-hero-label">DGL Agency</div>
        <h1 className="v2-hero-h1">
          Marketing digital sur mesure
          <br className="v2-br-desktop" />
          <span className="v2-space-mobile"> </span>
          pour les marques qui veulent
          <br className="v2-br-desktop" />
          <span className="v2-space-mobile"> </span>
          dominer leur marché en ligne.
        </h1>

        <div className="v2-cta-row">
          <a className="v2-cta-primary group" href="#contact">
            <TextRoll>Démarrer un projet</TextRoll>
            <span className="v2-cta-primary-arrow">
              <ArrowRight size={14} color={DGL.coral} />
            </span>
          </a>

          <div className="v2-partner-badge">
            <svg viewBox="0 0 100 100" className="v2-partner-svg" aria-hidden>
              <path d={PARTNER_SVG_PATH} fill="currentColor" />
            </svg>
            <span className="v2-partner-label">Partenaire Certifié</span>
            <span className="v2-partner-featured">Premium</span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="v2-mobile-overlay">
          <div className="v2-mobile-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="v2-mobile-sheet">
            <div className="v2-mobile-header">
              <span className="v2-mobile-time">
                <Clock size={12} /> {time} Paris
              </span>
              <button
                className="v2-mobile-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={16} color={DGL.white} />
              </button>
            </div>
            <ul className="v2-mobile-links">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              className="v2-mobile-cta"
              href="#contact"
              onClick={() => setMobileOpen(false)}
            >
              Démarrer un projet
              <ArrowRight size={16} color={DGL.coral} />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

const HERO_CSS = `
/* Shader stack — <Shader> root is the direct child, it renders a canvas */
.v2-shader-stack {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
.v2-shader-stack canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* Navbar */
.v2-nav-wrap {
  position: relative;
  z-index: 20;
  max-width: 1440px;
  margin: 0 auto;
  padding: 12px;
}
.v2-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${DGL.white};
  border-radius: 999px;
  padding: 5px;
}
.v2-nav-left { display: flex; align-items: center; gap: 24px; }
.v2-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${DGL.navy};
  color: ${DGL.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: -0.02em;
}
.v2-nav-links {
  display: none;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.v2-nav-links a {
  color: ${DGL.navy};
  font-size: 14px;
  text-decoration: none;
  transition: color 300ms;
}
.v2-nav-links a:hover { color: rgba(0,35,41,0.55); }

.v2-nav-right {
  display: none;
  align-items: center;
  gap: 16px;
  padding-right: 4px;
}
.v2-nav-status { font-size: 13px; color: rgba(0,35,41,0.6); display: none; }
.v2-nav-time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(0,35,41,0.6);
  font-variant-numeric: tabular-nums;
}
.v2-nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${DGL.navy};
  color: ${DGL.white};
  border: none;
  padding: 2px 2px 2px 20px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: background 300ms;
}
.v2-nav-cta:hover { background: ${DGL.navyDeep}; }
.v2-nav-cta-arrow {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${DGL.white};
  color: ${DGL.navy};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 500ms cubic-bezier(0.25,0.1,0.25,1);
}
.v2-nav-cta:hover .v2-nav-cta-arrow { transform: rotate(-45deg); }

.v2-mobile-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${DGL.navy};
  border: none;
  cursor: pointer;
}
@media (min-width: 768px) {
  .v2-nav-links { display: flex; }
  .v2-nav-right { display: flex; }
  .v2-mobile-toggle { display: none; }
}
@media (min-width: 1024px) {
  .v2-nav-status { display: inline; }
}

/* Hero content */
.v2-hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px 56px;
}
@media (min-width: 640px) {
  .v2-hero-content { padding: 0 32px 64px; }
}
@media (min-width: 1024px) {
  .v2-hero-content { padding: 0 48px 80px; }
}
.v2-hero-label {
  font-size: 13px;
  color: ${DGL.navy};
  letter-spacing: 0.05em;
  margin-bottom: 20px;
}
.v2-hero-h1 {
  font-size: clamp(1.75rem, 7vw, 4.2rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: ${DGL.navy};
  margin: 0;
}
@media (min-width: 640px) {
  .v2-hero-label { font-size: 14px; margin-bottom: 32px; }
  .v2-hero-h1 { font-size: clamp(2.5rem, 5vw, 4.2rem); }
}
.v2-br-desktop { display: none; }
.v2-space-mobile { display: inline; }
@media (min-width: 640px) {
  .v2-br-desktop { display: inline; }
  .v2-space-mobile { display: none; }
}

/* CTA row */
.v2-cta-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  align-items: flex-start;
}
@media (min-width: 640px) {
  .v2-cta-row { flex-direction: row; align-items: center; gap: 20px; margin-top: 48px; }
}

.v2-partner-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${DGL.white};
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 300ms;
}
.v2-partner-badge:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.v2-partner-svg {
  width: 20px;
  height: 20px;
  color: ${DGL.coral};
  flex-shrink: 0;
}
@media (min-width: 640px) {
  .v2-partner-svg { width: 24px; height: 24px; }
}
.v2-partner-label {
  font-size: 13px;
  font-weight: 500;
  color: ${DGL.navy};
}
@media (min-width: 640px) {
  .v2-partner-label { font-size: 14px; }
}
.v2-partner-featured {
  font-size: 10px;
  background: ${DGL.navy};
  color: ${DGL.white};
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}
@media (min-width: 640px) {
  .v2-partner-featured { font-size: 11px; padding: 2px 8px; }
}

/* Mobile menu */
.v2-mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
}
.v2-mobile-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  animation: v2FadeIn 300ms ease forwards;
}
.v2-mobile-sheet {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background: ${DGL.white};
  border-radius: 16px;
  padding: 20px;
  animation: v2SlideUp 500ms cubic-bezier(0.32,0.72,0,1) forwards;
}
.v2-mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.v2-mobile-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${DGL.cream};
  color: ${DGL.navy};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
}
.v2-mobile-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${DGL.navy};
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.v2-mobile-links {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.v2-mobile-links li a {
  display: block;
  font-size: 28px;
  font-weight: 500;
  color: ${DGL.navy};
  text-decoration: none;
  padding: 4px 0;
}
.v2-mobile-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${DGL.coral};
  color: ${DGL.white};
  border: none;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
}
@keyframes v2FadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes v2SlideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
`
