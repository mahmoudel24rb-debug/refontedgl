'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Compteur a chiffres roulants du template (module Metrics) : une colonne par
 * position decimale, dix chiffres empiles, positionnes par un ressort.
 * Le decalage vertical suit la formule du template :
 * `t = (10 + chiffre - valeur % 10) % 10 ; y = t * hauteur ; si t > 5, y -= 10 * hauteur`.
 */

const SPRING = { stiffness: 280, damping: 18, mass: 0.3 }

function Digit({
  progress,
  digit,
  height,
}: {
  progress: MotionValue<number>
  digit: number
  height: number
}) {
  const y = useTransform(progress, (value) => {
    if (!height) return 0
    const offset = (10 + digit - (value % 10)) % 10
    const shift = offset * height
    return offset > 5 ? shift - 10 * height : shift
  })

  return (
    <motion.span
      style={{ y }}
      transition={SPRING}
      className="absolute inset-0 flex items-center justify-center"
    >
      {digit}
    </motion.span>
  )
}

function Place({ value, place }: { value: number; place: number }) {
  const digit = Math.floor(value / place) % 10
  const progress = useSpring(digit, SPRING)
  const boxRef = useRef<HTMLSpanElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    progress.set(digit)
  }, [progress, digit])

  /* La hauteur de reference est celle de la colonne elle-meme (une ligne de
     texte en leading-none), comme le template qui mesure le span positionne. */
  useLayoutEffect(() => {
    const node = boxRef.current
    if (!node) return
    const update = () => setHeight(node.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={boxRef}
      className="relative inline-block w-[1ch] overflow-clip leading-none tabular-nums"
      style={{ clipPath: 'inset(0)' }}
    >
      <span className="invisible">0</span>
      {height > 0
        ? Array.from({ length: 10 }, (_unused, candidate) => (
            <Digit
              key={candidate}
              progress={progress}
              digit={candidate}
              height={height}
            />
          ))
        : null}
    </span>
  )
}

export default function RollingNumber({
  value,
  className = '',
}: {
  value: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const amount = Math.trunc(Math.abs(value))
  const digits = amount.toString().split('')

  if (reduced) {
    return (
      <span className={`tabular-nums${className ? ` ${className}` : ''}`}>
        {amount}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center leading-none${
        className ? ` ${className}` : ''
      }`}
    >
      {digits.map((_unused, position) => {
        const place = Math.pow(10, digits.length - position - 1)
        return <Place key={`pos-${place}`} value={amount} place={place} />
      })}
    </span>
  )
}
