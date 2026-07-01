import { Link } from 'react-router-dom'
import { COMPOSANTS, STATUS_LABEL } from '@/composant/registry'

export default function ComposantIndex() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: '"Inter Tight", sans-serif',
        padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            color: '#fe5752',
            marginBottom: '1rem',
          }}
        >
          PROTOTYPES DGL
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: '0 0 1rem',
          }}
        >
          Composants isolés
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '0 0 3rem',
          }}
        >
          Chaque composant ci-dessous est prototypé en isolation. Il sera
          intégré au site principal une fois validé. Pour en ajouter un
          nouveau, envoie un prompt à Claude.
        </p>

        {COMPOSANTS.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '18px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.9375rem',
            }}
          >
            Aucun composant en cours de prototypage.
            <br />
            Envoie un prompt à Claude pour en créer un.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {COMPOSANTS.map((c) => (
              <Link
                key={c.slug}
                to={`/composant/${c.slug}`}
                style={{
                  display: 'block',
                  padding: '1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 200ms',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(254,87,82,0.4)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: '1rem',
                  }}
                >
                  {STATUS_LABEL[c.status]}
                </div>
                <div
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    margin: '0 0 0.375rem',
                    lineHeight: 1.3,
                  }}
                >
                  {c.name}
                </div>
                <code
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily:
                      'ui-monospace, Menlo, Consolas, monospace',
                  }}
                >
                  /composant/{c.slug}
                </code>
                {c.notes && (
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                      marginTop: '0.75rem',
                      margin: '0.75rem 0 0',
                    }}
                  >
                    {c.notes}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'color 200ms',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')
            }
          >
            ← Retour au site principal
          </Link>
        </div>
      </div>
    </main>
  )
}
