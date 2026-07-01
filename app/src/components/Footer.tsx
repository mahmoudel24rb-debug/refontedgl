import { useEffect, useState } from 'react'

const Twitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const LinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const Instagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)
const Facebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const YouTube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

/*
  Footer — spec incomplete in the source prompt.
  Structure invented from the hints:
    - dark green bg #002329
    - brand logo with filter brightness(0) invert(1)
    - description, link columns, copyright, socials.
*/

const LINK_COLUMNS = [
  {
    heading: 'Services',
    items: [
      'Publicité digitale',
      'SEO',
      'Génération de leads',
      'Automatisation',
      'Landing pages',
    ],
  },
  {
    heading: 'Agence',
    items: ['À propos', 'Nos réalisations', 'Carrières', 'Contact'],
  },
  {
    heading: 'Ressources',
    items: [
      'Simulateur ROI',
      'Audit landing page',
      'PageSpeed tool',
      'Blog',
    ],
  },
  {
    heading: 'Légal',
    items: ['Mentions légales', 'CGV', 'Politique de confidentialité'],
  },
]

const SOCIALS = [
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: LinkedIn, label: 'LinkedIn', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: YouTube, label: 'YouTube', href: '#' },
]

export default function Footer() {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <footer
      style={{
        background: '#002329',
        color: '#FFFFFF',
        padding: '80px clamp(1rem, 3vw, 2rem) 32px',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top row : brand + link columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 2fr',
            gap: narrow ? '3rem' : 'clamp(3rem, 8vw, 8rem)',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Brand */}
          <div>
            <img
              src="https://dgl-agency.fr/wp-content/uploads/2025/11/logo-dgl-agency.webp"
              alt="DGL Agency"
              style={{
                height: '2rem',
                width: 'auto',
                marginBottom: '20px',
              }}
            />
            <p
              style={{
                fontSize: '0.9375rem',
                fontWeight: 400,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
                maxWidth: '340px',
              }}
            >
Votre partenaire digital pour transformer vos idées en résultats concrets.
              Agence SEO, Google Ads & Meta Ads basée à Tours.
            </p>
          </div>

          {/* Link columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: narrow
                ? 'repeat(2, minmax(0, 1fr))'
                : 'repeat(4, minmax(0, 1fr))',
              gap: '32px',
            }}
          >
            {LINK_COLUMNS.map((col) => (
              <div key={col.heading}>
                <div
                  style={{
                    color: '#fe5752',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '18px',
                  }}
                >
                  {col.heading}
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        style={{
                          color: 'rgba(255,255,255,0.65)',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          textDecoration: 'none',
                          transition: 'color 200ms',
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = '#FFFFFF')
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color =
                            'rgba(255,255,255,0.65)')
                        }
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row : copyright + socials */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            paddingTop: '28px',
            flexDirection: narrow ? 'column' : 'row',
          }}
        >
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            © {new Date().getFullYear()} DGL Agency. Tous droits réservés.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.65)',
                  transition:
                    'color 200ms, border-color 200ms, background 200ms',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
