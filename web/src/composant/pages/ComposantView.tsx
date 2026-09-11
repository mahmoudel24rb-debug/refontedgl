'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { getComposant, STATUS_LABEL } from '@/composant/entries'
import { COMPOSANT_COMPONENTS } from '@/composant/registry'

/**
 * Affichage d'une demo de l'archive : barre de controle fixe puis le
 * prototype, charge uniquement dans le navigateur.
 * Le slug est valide par la page serveur ; le garde-fou ci-dessous ne
 * sert que si le registre et les fiches divergent.
 */
export default function ComposantView({ slug }: { slug: string }) {
  const entry = getComposant(slug)
  const Cmp = COMPOSANT_COMPONENTS[slug]

  if (!entry || !Cmp) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Inter Tight", sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 0.75rem' }}>
            Composant introuvable
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.9375rem',
              margin: '0 0 2rem',
              lineHeight: 1.6,
            }}
          >
            Le composant <code>{slug}</code> n&apos;est pas dans le registre.
          </p>
          <Link
            href="/composant"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              borderRadius: '9px',
              background: '#fe5752',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Voir la liste des composants
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Top-bar de contrôle */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'rgba(0,35,41,0.6)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontFamily: '"Inter Tight", sans-serif',
          color: '#fff',
          fontSize: '0.8125rem',
        }}
      >
        <Link
          href="/composant"
          style={{
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          ← Retour à la liste
        </Link>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{entry.name}</span>
          <span
            style={{
              fontSize: '0.6875rem',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            {STATUS_LABEL[entry.status]}
          </span>
        </div>
      </div>

      {/* Composant isolé */}
      <div style={{ paddingTop: '48px', background: '#0a0a0a', minHeight: '100vh' }}>
        <Suspense
          fallback={
            <div
              style={{
                padding: '4rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: '"Inter Tight", sans-serif',
              }}
            >
              Chargement du composant…
            </div>
          }
        >
          <Cmp />
        </Suspense>
      </div>
    </>
  )
}
