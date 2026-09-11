'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Jauge circulaire des outils (portage exact de la jauge WordPress) :
 * cercle de rayon 90 dans un carre de 200, trait de 8, rotation de -90
 * degres, remplissage anime par stroke-dashoffset et compteur en
 * easeOutCubic sur 1200 ms.
 */

/** Couleurs officielles Lighthouse. */
export const SCORE_COLORS = {
  good: '#0cce6b',
  average: '#ffa400',
  poor: '#ff4e42',
} as const

/** Seuils d'un score : au dessus de good, au dessus de average. */
export interface ScoreThresholds {
  good: number
  average: number
}

/** Seuils par defaut (score de performance sur 100). */
export const DEFAULT_THRESHOLDS: ScoreThresholds = { good: 90, average: 50 }

/** Categorie d'un score selon ses seuils. */
export function scoreCategory(
  value: number,
  thresholds: ScoreThresholds = DEFAULT_THRESHOLDS,
): 'good' | 'average' | 'poor' {
  if (value >= thresholds.good) return 'good'
  if (value >= thresholds.average) return 'average'
  return 'poor'
}

/** Couleur associee a un score. */
export function scoreColor(
  value: number,
  thresholds: ScoreThresholds = DEFAULT_THRESHOLDS,
): string {
  return SCORE_COLORS[scoreCategory(value, thresholds)]
}

const RAYON = 90
const CIRCONFERENCE = 2 * Math.PI * RAYON
const DUREE_MS = 1200

export interface ScoreGaugeProps {
  /** Valeur affichee, de 0 a max. */
  value: number
  /** Valeur maximale de la jauge (100 par defaut). */
  max?: number
  thresholds?: ScoreThresholds
  /** Taille en pixels sur grand ecran (200 par defaut, 160 en mobile). */
  size?: number
  /** Libelle sous le nombre. */
  label?: string
}

export default function ScoreGauge({
  value,
  max = 100,
  thresholds = DEFAULT_THRESHOLDS,
  size = 200,
  label,
}: ScoreGaugeProps) {
  const reduced = useReducedMotion()
  const [affiche, setAffiche] = useState(0)
  const [rempli, setRempli] = useState(false)
  const trameRef = useRef<number | null>(null)

  const borne = Math.max(0, Math.min(max, Math.round(value)))
  const couleur = scoreColor(borne, thresholds)
  const ratio = max > 0 ? borne / max : 0
  const offset = CIRCONFERENCE - ratio * CIRCONFERENCE

  useEffect(() => {
    // Animation limitee : la valeur finale est posee au tour suivant.
    if (reduced) {
      const immediat = window.setTimeout(() => {
        setAffiche(borne)
        setRempli(true)
      }, 0)
      return () => window.clearTimeout(immediat)
    }

    // Un tour de boucle avant d'armer la transition, sinon le navigateur
    // part deja de la valeur finale et n'anime rien.
    const depart = window.setTimeout(() => {
      setRempli(true)
      const debut = performance.now()
      const avancer = (maintenant: number) => {
        const progression = Math.min((maintenant - debut) / DUREE_MS, 1)
        const adouci = 1 - Math.pow(1 - progression, 3)
        setAffiche(Math.round(borne * adouci))
        if (progression < 1) {
          trameRef.current = requestAnimationFrame(avancer)
        }
      }
      trameRef.current = requestAnimationFrame(avancer)
    }, 100)

    return () => {
      window.clearTimeout(depart)
      if (trameRef.current !== null) cancelAnimationFrame(trameRef.current)
    }
  }, [borne, reduced])

  return (
    <div
      className="relative mx-auto aspect-square w-[160px] md:w-[var(--jauge-taille)]"
      style={{ '--jauge-taille': `${size}px` } as CSSProperties}
    >
      <svg
        viewBox="0 0 200 200"
        className="size-full -rotate-90"
        role="img"
        aria-label={`${borne} sur ${max}`}
      >
        <circle
          cx="100"
          cy="100"
          r={RAYON}
          fill="none"
          stroke="rgba(0, 35, 41, 0.08)"
          strokeWidth="8"
        />
        <circle
          cx="100"
          cy="100"
          r={RAYON}
          fill="none"
          stroke={couleur}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCONFERENCE}
          strokeDashoffset={rempli ? offset : CIRCONFERENCE}
          style={{
            transition: reduced ? undefined : `stroke-dashoffset ${DUREE_MS}ms ease-out`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="-tracking-xl text-5xl font-semibold tabular-nums md:text-6xl"
          style={{ color: couleur }}
        >
          {affiche}
        </span>
        {label ? (
          <span className="text-muted mt-1 font-mono text-xs uppercase">{label}</span>
        ) : null}
      </div>
    </div>
  )
}
