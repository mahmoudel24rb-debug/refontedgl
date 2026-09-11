'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '../../ui/Icons'
import { PROJECTS } from '../../content'

/**
 * Briques communes aux cartes du bento realisations : semis de points du
 * template et coquille de carte (lien vers la fiche cas client, zone haute
 * pour la mini interface, pied avec client, titre et fleche).
 * Les sequences d'animation des cartes reprennent `useEnter` / `VIEWPORT` du
 * bento services.
 */

export type CardTone = 'light' | 'dark'

/** Semis de points 1 px, decline sur fond clair (navy) ou fond navy (blanc). */
export function DotBackdrop({ tone = 'light' }: { tone?: CardTone }) {
  const dot =
    tone === 'dark' ? 'rgba(255,255,255,0.40)' : 'rgba(0,35,41,0.14)'
  const mask = 'radial-gradient(120% 90% at 100% 0%, #000 0%, transparent 70%)'
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
        backgroundSize: '9px 9px',
        maskImage: mask,
        WebkitMaskImage: mask,
        opacity: tone === 'dark' ? 0.5 : 1,
      }}
    />
  )
}

/**
 * Coquille commune : hauteur unique, coins tres arrondis, zone haute d'au
 * moins 200 px qui rogne la mini interface, pied cale en bas de la carte.
 */
export function ProjectCard({
  slug,
  tone = 'light',
  children,
}: {
  slug: string
  tone?: CardTone
  children: ReactNode
}) {
  const project = PROJECTS.find((item) => item.slug === slug)
  if (!project) return null
  const dark = tone === 'dark'

  return (
    <Link
      href={`/realisations/${slug}`}
      className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-3xl p-5 transition-shadow duration-300 ${
        dark
          ? 'bg-ink text-white shadow-[0_24px_60px_-40px_rgba(0,35,41,0.9)]'
          : 'text-ink bg-white shadow-[0_18px_44px_-34px_rgba(0,35,41,0.55)]'
      } hover:shadow-[0_28px_70px_-40px_rgba(0,35,41,0.75)]`}
    >
      <DotBackdrop tone={tone} />
      <div className="relative min-h-[200px] flex-1 overflow-hidden">
        {children}
      </div>
      <div className="relative mt-auto pt-6">
        <p
          className={`-tracking-xs font-mono text-xs uppercase ${
            dark ? 'text-white/60' : 'text-muted'
          }`}
        >
          {project.client}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h3 className="-tracking-sm text-xl leading-7 font-medium text-balance">
            {project.title}
          </h3>
          <ArrowRightIcon
            size={20}
            className={`mb-1 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
              dark ? 'text-white/70' : 'text-primary'
            }`}
          />
        </div>
      </div>
    </Link>
  )
}
