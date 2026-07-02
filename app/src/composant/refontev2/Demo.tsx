import { Component, useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, Clock, Menu, X } from 'lucide-react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'

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

/**
 * Composant refontev2 — page landing complète DGL (3 sections).
 * Adapté du brief "Axion Studio" (composant/refontev2/prompt.md) aux
 * couleurs DGL :
 *   - orange #F26522 / #ff5f03 / #E8704E → coral #fe5752
 *   - dark #111 (gray-900) → navy #002329
 *   - grays #EFEFEF / #F5F5F5 → cream #F0EFE9
 * Copy en français, horloge sur Europe/Paris (au lieu de London).
 *
 * Utilise le package `shaders` (Paper Design) pour la stack shader du
 * hero : Swirl + ChromaFlow + FlutedGlass + FilmGrain empilés en absolu.
 * ⚠️ Le package inclut three.js → bundle ~500 KB supplémentaire.
 */

const DGL = {
  navy: '#002329',
  navyHover: '#001519',
  coral: '#fe5752',
  coralHover: '#e54a45',
  cream: '#F0EFE9',
  white: '#ffffff',
} as const

const NAV_LINKS = ['Réalisations', 'Agence', 'Blog', 'Contact']

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

export default function Demo() {
  return (
    <div style={{ background: DGL.cream, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <style>{STYLES}</style>
      <Hero />
      <About />
      <CaseStudies />
    </div>
  )
}

/* ==============================
   SECTION 1 — HERO
============================== */
function Hero() {
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
                <li key={l}>
                  <a href="#">{l}</a>
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
            <button className="v2-nav-cta group">
              <TextRoll>Réserver un call stratégie</TextRoll>
              <span className="v2-nav-cta-arrow">
                <ArrowRight size={12} />
              </span>
            </button>
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
          <button className="v2-cta-primary group">
            <TextRoll>Démarrer un projet</TextRoll>
            <span className="v2-cta-primary-arrow">
              <ArrowRight size={14} color={DGL.coral} />
            </span>
          </button>

          <div className="v2-partner-badge">
            <svg
              viewBox="0 0 100 100"
              className="v2-partner-svg"
              aria-hidden
            >
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
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
            <button className="v2-mobile-cta">
              Démarrer un projet
              <ArrowRight size={16} color={DGL.coral} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ==============================
   SECTION 2 — ABOUT
============================== */
function About() {
  return (
    <section className="v2-about">
      <div className="v2-about-inner">
        <div className="v2-badge-row">
          <span className="v2-badge-num">1</span>
          <span className="v2-badge-pill">L'agence DGL</span>
        </div>

        <h2 className="v2-h2">
          Une stratégie créative qui délivre
          <br className="v2-br-desktop" />
          <span className="v2-space-mobile"> </span>
          des résultats mesurables partout.
        </h2>

        {/* Mobile/tablet stack */}
        <div className="v2-about-mobile">
          <p className="v2-about-para-mobile">
            Grâce à la recherche, la créativité et l'itération, on aide les
            marques en croissance à révéler tout leur potentiel digital.
          </p>
          <button className="v2-cta-primary group v2-cta-inline">
            <TextRoll>Découvrir l'agence</TextRoll>
            <span className="v2-cta-primary-arrow">
              <ArrowRight size={14} color={DGL.coral} />
            </span>
          </button>
          <div className="v2-about-images-mobile">
            <img src={ABOUT_IMG_SMALL} alt="" className="v2-about-img-small" />
            <img src={ABOUT_IMG_LARGE} alt="" className="v2-about-img-large" />
          </div>
        </div>

        {/* Desktop grid */}
        <div className="v2-about-desktop">
          <div className="v2-about-col-left">
            <img src={ABOUT_IMG_SMALL} alt="" />
          </div>
          <div className="v2-about-col-center">
            <p>
              Grâce à la recherche, la créativité et l'itération,
              <br />
              on aide les marques en croissance à révéler
              <br />
              tout leur potentiel digital.
            </p>
            <button className="v2-cta-primary group">
              <TextRoll>Découvrir l'agence</TextRoll>
              <span className="v2-cta-primary-arrow">
                <ArrowRight size={14} color={DGL.coral} />
              </span>
            </button>
          </div>
          <div className="v2-about-col-right">
            <img src={ABOUT_IMG_LARGE} alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}

const ABOUT_IMG_SMALL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85'
const ABOUT_IMG_LARGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85'

/* ==============================
   SECTION 3 — CASE STUDIES
============================== */
function CaseStudies() {
  return (
    <section className="v2-cases">
      <div className="v2-about-inner">
        <div className="v2-badge-row">
          <span className="v2-badge-num">2</span>
          <span className="v2-badge-pill v2-badge-pill-lighter">
            Nos réalisations phares
          </span>
        </div>

        <h2 className="v2-h1">Nos projets</h2>

        <div className="v2-cases-grid">
          <CaseCard
            variant="light"
            aspectRatio="329 / 246"
            videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
            title="Océades"
            desc="Croissance +180% sur les résas online grâce à un funnel Google Ads + landing sur-mesure"
            hoverLabel="En savoir plus"
          />
          <CaseCard
            variant="dark"
            aspectRatio="1 / 1"
            videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
            title="GYMFIT"
            desc="Refonte complète du parcours acquisition, ROAS multiplié par 3.2"
            hoverLabel="Voir la case study"
          />
        </div>
      </div>
    </section>
  )
}

function CaseCard({
  variant,
  aspectRatio,
  videoSrc,
  title,
  desc,
  hoverLabel,
}: {
  variant: 'light' | 'dark'
  aspectRatio: string
  videoSrc: string
  title: string
  desc: string
  hoverLabel: string
}) {
  return (
    <div className="v2-case-card">
      <div
        className="v2-case-video-wrap group"
        style={{
          aspectRatio,
          background: variant === 'light' ? '#1a1d2e' : '#6b6b6b',
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="v2-case-video"
        />
        <div
          className={
            variant === 'light'
              ? 'v2-case-hover-btn v2-case-hover-btn-light'
              : 'v2-case-hover-btn v2-case-hover-btn-dark'
          }
        >
          <span className="v2-case-hover-label">{hoverLabel}</span>
          <ArrowRight
            size={14}
            className="v2-case-hover-arrow"
            color={variant === 'light' ? DGL.navy : DGL.white}
          />
        </div>
      </div>
      <p className="v2-case-desc">{desc}</p>
      <div className="v2-case-title">{title}</div>
    </div>
  )
}

/* ==============================
   TextRoll — hover text roll
============================== */
function TextRoll({ children }: { children: React.ReactNode }) {
  return (
    <span className="v2-text-roll">
      <span className="v2-text-roll-inner">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  )
}

/* ==============================
   STYLES
============================== */
const STYLES = `
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
.v2-nav-status { font-size: 13px; color: rgba(0,35,41,0.6); }
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
  transition: background 300ms;
}
.v2-nav-cta:hover { background: #001519; }
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
.v2-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${DGL.coral};
  color: ${DGL.white};
  border: none;
  padding: 2px 2px 2px 20px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 300ms;
}
.v2-cta-primary:hover { background: ${DGL.coralHover}; }
@media (min-width: 640px) {
  .v2-cta-primary { padding: 2px 2px 2px 24px; font-size: 14px; }
}
.v2-cta-primary-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${DGL.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 500ms cubic-bezier(0.25,0.1,0.25,1);
}
.v2-cta-primary:hover .v2-cta-primary-arrow { transform: rotate(-45deg); }
@media (min-width: 640px) {
  .v2-cta-primary-arrow { width: 32px; height: 32px; }
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

/* Text roll */
.v2-text-roll {
  display: inline-flex;
  overflow: hidden;
  height: 20px;
  align-items: center;
}
.v2-text-roll-inner {
  display: flex;
  flex-direction: column;
  transition: transform 500ms cubic-bezier(0.25,0.1,0.25,1);
}
.v2-text-roll-inner > span {
  height: 20px;
  display: flex;
  align-items: center;
}
.group:hover .v2-text-roll-inner { transform: translateY(-50%); }

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
}
@keyframes v2FadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes v2SlideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

/* Section 2 — About */
.v2-about {
  background: ${DGL.white};
  overflow: hidden;
  padding: 64px 0 48px;
}
@media (min-width: 640px) { .v2-about { padding: 80px 0 64px; } }
@media (min-width: 1024px) { .v2-about { padding: 128px 0 96px; } }

.v2-about-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}
@media (min-width: 640px) { .v2-about-inner { padding: 0 32px; } }
@media (min-width: 1024px) { .v2-about-inner { padding: 0 48px; } }

.v2-badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
@media (min-width: 640px) { .v2-badge-row { margin-bottom: 32px; } }
.v2-badge-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${DGL.navy};
  color: ${DGL.white};
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 640px) {
  .v2-badge-num { width: 28px; height: 28px; font-size: 12px; }
}
.v2-badge-pill {
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(0,35,41,0.15);
  border-radius: 999px;
  padding: 4px 12px;
  color: ${DGL.navy};
}
.v2-badge-pill-lighter { border-color: rgba(0,35,41,0.1); }
@media (min-width: 640px) {
  .v2-badge-pill { font-size: 13px; padding: 6px 16px; }
}

.v2-h1 {
  font-size: clamp(1.75rem, 7vw, 4.2rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: ${DGL.navy};
  margin: 0 0 40px;
}
@media (min-width: 640px) {
  .v2-h1 { font-size: clamp(2.5rem, 5vw, 4.2rem); margin-bottom: 56px; }
}
@media (min-width: 1024px) {
  .v2-h1 { margin-bottom: 64px; }
}

.v2-h2 {
  font-size: clamp(1.5rem, 4vw, 3.2rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: ${DGL.navy};
  margin: 0 0 48px;
}
@media (min-width: 640px) { .v2-h2 { margin-bottom: 64px; } }
@media (min-width: 1024px) { .v2-h2 { margin-bottom: 112px; } }

.v2-about-mobile { display: block; }
.v2-about-desktop { display: none; }
@media (min-width: 1024px) {
  .v2-about-mobile { display: none; }
  .v2-about-desktop {
    display: grid;
    grid-template-columns: 26% 1fr 48%;
    align-items: end;
    gap: 24px;
  }
}
@media (min-width: 1280px) {
  .v2-about-desktop { gap: 32px; }
}

.v2-about-para-mobile {
  font-size: 15px;
  line-height: 1.6;
  font-weight: 500;
  color: ${DGL.navy};
  margin: 0 0 24px;
}
@media (min-width: 640px) { .v2-about-para-mobile { font-size: 17px; } }

.v2-cta-inline { margin-bottom: 32px; }

.v2-about-images-mobile {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 640px) {
  .v2-about-images-mobile { flex-direction: row; gap: 20px; }
}
.v2-about-img-small,
.v2-about-img-large {
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
}
@media (min-width: 640px) {
  .v2-about-img-small,
  .v2-about-img-large { border-radius: 16px; }
  .v2-about-img-small { width: 45%; aspect-ratio: 438 / 346; }
  .v2-about-img-large { width: 55%; aspect-ratio: 900 / 600; }
}

.v2-about-col-left { align-self: end; }
.v2-about-col-left img {
  width: 100%;
  aspect-ratio: 438 / 346;
  border-radius: 16px;
  object-fit: cover;
  display: block;
}
.v2-about-col-center {
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
}
.v2-about-col-center p {
  font-size: 16px;
  line-height: 1.65;
  white-space: nowrap;
  color: ${DGL.navy};
  margin: 0;
  text-align: right;
}
@media (min-width: 1280px) {
  .v2-about-col-center p { font-size: 18px; }
}
.v2-about-col-right { align-self: end; }
.v2-about-col-right img {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 16px;
  object-fit: cover;
  display: block;
}

/* Section 3 — Case Studies */
.v2-cases {
  background: ${DGL.cream};
  padding: 64px 0;
}
@media (min-width: 640px) { .v2-cases { padding: 80px 0; } }
@media (min-width: 1024px) { .v2-cases { padding: 112px 0; } }

.v2-cases-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 640px) { .v2-cases-grid { gap: 24px; } }
@media (min-width: 768px) {
  .v2-cases-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) { .v2-cases-grid { gap: 28px; } }

.v2-case-card { display: flex; flex-direction: column; }
.v2-case-video-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}
.v2-case-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.v2-case-hover-btn {
  position: absolute;
  bottom: 16px;
  left: 16px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px 0 16px;
  gap: 8px;
  overflow: hidden;
  transition: width 300ms ease-in-out;
  width: 36px;
}
.v2-case-hover-btn-light {
  background: ${DGL.white};
  color: ${DGL.navy};
}
.v2-case-hover-btn-dark {
  background: ${DGL.navy};
  color: ${DGL.white};
}
.v2-case-video-wrap:hover .v2-case-hover-btn-light { width: 148px; }
.v2-case-video-wrap:hover .v2-case-hover-btn-dark { width: 168px; }
.v2-case-hover-label {
  font-size: 13px;
  font-weight: 500;
  opacity: 0;
  white-space: nowrap;
  transition: opacity 300ms 100ms;
}
.v2-case-video-wrap:hover .v2-case-hover-label { opacity: 1; }
.v2-case-hover-arrow {
  flex-shrink: 0;
  transform: rotate(-45deg);
  transition: transform 300ms;
}
.v2-case-video-wrap:hover .v2-case-hover-arrow { transform: rotate(0deg); }

.v2-case-desc {
  font-size: 13px;
  color: rgba(0,35,41,0.65);
  margin: 16px 0 0;
  line-height: 1.5;
}
@media (min-width: 640px) { .v2-case-desc { font-size: 14px; } }
.v2-case-title {
  font-size: 14px;
  font-weight: 600;
  color: ${DGL.navy};
  margin-top: 4px;
}
@media (min-width: 640px) { .v2-case-title { font-size: 15px; } }
`
