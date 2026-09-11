import type { ReactNode } from 'react'

/** Gouttiere commune a toutes les sections du site racine. */
export default function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`max-w-container mx-auto w-full px-4 sm:px-6 lg:px-8${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  )
}
