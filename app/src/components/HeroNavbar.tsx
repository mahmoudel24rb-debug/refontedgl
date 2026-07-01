import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { asset } from '@/lib/utils'

interface NavLink {
  label: string
  active?: boolean
  dropdown?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'ACCUEIL', active: true },
  { label: 'SERVICES', dropdown: true },
  { label: 'RÉALISATIONS' },
  { label: 'À PROPOS' },
  { label: 'RESSOURCES' },
]

export default function HeroNavbar() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hideContact, setHideContact] = useState(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 1024)
      setHideContact(window.innerWidth <= 600)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const openAbout = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setAboutOpen(true)
  }

  const closeAbout = () => {
    closeTimer.current = window.setTimeout(() => setAboutOpen(false), 120)
  }

  return (
    <>
      {/* Full-page blur backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          pointerEvents: 'none',
          backdropFilter: aboutOpen ? 'blur(8px)' : 'blur(0px)',
          WebkitBackdropFilter: aboutOpen ? 'blur(8px)' : 'blur(0px)',
          background: aboutOpen ? 'rgba(0,0,0,0.25)' : 'transparent',
          transition: 'backdrop-filter 280ms ease, background 280ms ease',
        }}
      />

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '70px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr auto 1fr',
          alignItems: 'center',
          padding: '0 clamp(1rem, 3vw, 2rem)',
          // Liquid glass DGL — dark navy tint + strong blur + saturation
          background:
            'linear-gradient(180deg, rgba(0,35,41,0.55) 0%, rgba(0,35,41,0.35) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px -12px rgba(0,0,0,0.4)',
          fontFamily: '"Inter Tight", sans-serif',
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://dgl-agency.fr/wp-content/uploads/2025/11/logo-dgl-agency.webp"
            alt="DGL Agency"
            style={{ height: '1.75rem', width: 'auto' }}
          />
        </div>

        {/* Center: Nav links */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.active || (link.dropdown && aboutOpen)
              return (
                <button
                  key={link.label}
                  onMouseEnter={link.dropdown ? openAbout : closeAbout}
                  onMouseLeave={link.dropdown ? closeAbout : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: '"Inter Tight", sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    padding: '6px 14px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive
                      ? 'rgba(255,255,255,0.95)'
                      : 'rgba(255,255,255,0.65)',
                    transition: 'color 200ms',
                    letterSpacing: '0.5px',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
                  }}
                  onMouseOut={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  }}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      size={11}
                      color="rgba(255,255,255,0.65)"
                      style={{
                        transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 220ms ease',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Right: Contact + Learn more */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          {!hideContact && (
            <button
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 200ms',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')
              }
            >
              Contact
            </button>
          )}
          <LearnMoreWhiteButton />
        </div>
      </nav>

      {/* ABOUT Dropdown panel */}
      <div
        style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          zIndex: 60,
          background: 'rgba(15,15,15,0.85)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: '32px 0 40px',
          opacity: aboutOpen ? 1 : 0,
          pointerEvents: aboutOpen ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
        }}
        onMouseEnter={openAbout}
        onMouseLeave={closeAbout}
      >
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '0 24px',
            opacity: aboutOpen ? 1 : 0,
            transform: aboutOpen ? 'translateY(0)' : 'translateY(-12px)',
            transition:
              'opacity 320ms ease, transform 380ms cubic-bezier(0.22,1,0.36,1)',
            transitionDelay: aboutOpen ? '80ms' : '0ms',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
            }}
          >
            <DropdownColumn
              heading="Acquisition"
              items={['Publicité Digitale', 'Génération de leads', 'Landing Pages']}
            />
            <DropdownColumn
              heading="Croissance"
              items={['SEO', 'Automatisation', 'Stratégie Digitale']}
            />
          </div>

          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '14px',
                letterSpacing: '0.02em',
              }}
            >
              Outils gratuits
            </div>
            <DropdownItem>
              Simulateur ROI <ArrowUpRight />
            </DropdownItem>
            <DropdownItem>
              Audit landing page <ArrowUpRight />
            </DropdownItem>
          </div>
        </div>
      </div>
    </>
  )
}

function DropdownColumn({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '12px',
          fontWeight: 500,
          marginBottom: '14px',
          letterSpacing: '0.02em',
        }}
      >
        {heading}
      </div>
      {items.map((item) => (
        <DropdownItem key={item}>{item}</DropdownItem>
      ))}
    </div>
  )
}

function DropdownItem({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        color: 'rgba(255,255,255,0.92)',
        fontSize: '14px',
        fontWeight: 500,
        background: 'transparent',
        border: 'none',
        padding: '6px 0',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
        transition: 'color 200ms',
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseOut={(e) =>
        (e.currentTarget.style.color = 'rgba(255,255,255,0.92)')
      }
    >
      {children}
    </button>
  )
}

function ArrowUpRight() {
  return <span style={{ fontSize: '11px' }}>↗</span>
}

function LearnMoreWhiteButton() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '38px',
        padding: '13px 19.2px',
        gap: '10px',
        borderRadius: '9px',
        border: '1px solid rgba(250,250,250,0.20)',
        background: '#FFF',
        color: '#111111',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      Audit gratuit
      <span
        style={{
          position: 'relative',
          width: '14px',
          height: '14px',
          display: 'inline-block',
          overflow: 'hidden',
        }}
      >
        <img
          src={asset('arrow-right.svg')}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '14px',
            height: '14px',
            transform: hover ? 'translateX(150%)' : 'translateX(0)',
            transition: 'transform 500ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />
        <img
          src={asset('arrow-right.svg')}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '14px',
            height: '14px',
            transform: hover ? 'translateX(0)' : 'translateX(-150%)',
            transition: 'transform 500ms cubic-bezier(0.65,0,0.35,1)',
          }}
        />
      </span>
    </button>
  )
}
