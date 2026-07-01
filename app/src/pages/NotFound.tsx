export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 400 }}>404</h1>
        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>
          Page not found
        </p>
      </div>
    </main>
  )
}
