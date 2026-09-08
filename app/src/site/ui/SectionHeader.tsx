import type { ReactNode } from 'react'

/**
 * En-tete de section du template : H2 aligne a gauche, slot optionnel a
 * droite (le plus souvent un DotButton).
 */
export default function SectionHeader({
  title,
  right,
  align = 'left',
  className = '',
  id,
}: {
  title: string
  right?: ReactNode
  align?: 'left' | 'center-mobile'
  className?: string
  id?: string
}) {
  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between${
        className ? ` ${className}` : ''
      }`}
    >
      <h2
        id={id}
        className={`text-ink text-4xl font-semibold tracking-tight text-balance md:text-5xl ${
          align === 'center-mobile' ? 'text-center md:text-left' : 'text-left'
        }`}
      >
        {title}
      </h2>
      {right ? (
        <div
          className={
            align === 'center-mobile'
              ? 'flex justify-center md:justify-end'
              : 'flex justify-start md:justify-end'
          }
        >
          {right}
        </div>
      ) : null}
    </div>
  )
}
