import { motion } from 'framer-motion'

/**
 * Composant Exemple — placeholder pour valider le workflow.
 * À supprimer quand les vrais composants arrivent.
 */
export default function Demo() {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 6vw, 5rem)',
        background:
          'radial-gradient(circle at 30% 20%, rgba(254,87,82,0.10), transparent 60%), #0a0a0a',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: '520px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          borderRadius: '20px',
          background:
            'linear-gradient(140deg, rgba(0,35,41,0.9) 0%, rgba(0,35,41,0.6) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            color: '#fe5752',
            marginBottom: '1rem',
          }}
        >
          COMPOSANT EXEMPLE
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 1rem',
          }}
        >
          Le workflow marche !
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            margin: '0 0 2rem',
          }}
        >
          Ce composant sert de placeholder pour valider que le système de
          prototypage isolé fonctionne. Envoie un prompt à Claude pour créer
          ton premier vrai composant.
        </p>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            background: '#fe5752',
            color: '#fff',
            border: 'none',
            borderRadius: '9px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 200ms, transform 200ms',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e54a45'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#fe5752'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Un CTA d'exemple →
        </button>
      </motion.div>
    </main>
  )
}
