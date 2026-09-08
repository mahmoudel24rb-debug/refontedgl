import { useEffect, useState } from 'react'
import type { TocEntry } from './posts'

/**
 * Sommaire de l'article (template) : cartes numerotees « 01 Titre… ».
 * L'entree active suit le H2 visible (IntersectionObserver).
 * En mobile la liste devient une bande horizontale defilante.
 */
export default function BlogToc({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = items.find((item) => visible.has(item.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="Sommaire de l'article"
      className="-mx-4 flex min-w-0 snap-x gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {items.map((item, index) => {
        const isActive = item.id === active
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={(event) => {
              const target = document.getElementById(item.id)
              if (!target) return
              event.preventDefault()
              target.scrollIntoView({ behavior: 'smooth', block: 'start' })
              window.history.replaceState(null, '', `#${item.id}`)
              setActive(item.id)
            }}
            className={`flex w-64 shrink-0 snap-start items-center gap-2 rounded-lg border px-4 py-4 transition-colors lg:w-full lg:max-w-96 ${
              isActive
                ? 'border-ink bg-white'
                : 'border-ink/10 hover:border-ink/25 bg-white/60'
            }`}
          >
            <span className="text-muted font-mono text-sm">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-ink truncate font-medium">{item.text}</span>
          </a>
        )
      })}
    </nav>
  )
}
