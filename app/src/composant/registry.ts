import { lazy, type ComponentType } from 'react'

/**
 * Registry of isolated components in prototype phase.
 * Each entry produces a demo route /composant/[slug].
 *
 * To add a new one:
 *   1. Create a file at src/composant/[slug]/Demo.tsx exporting `default`
 *   2. Add an entry below with its slug + display name + status
 */
export interface ComposantEntry {
  slug: string
  name: string
  status: 'wip' | 'ready' | 'validated' | 'rejected'
  Component: ComponentType
  notes?: string
}

export const COMPOSANTS: ComposantEntry[] = [
  {
    slug: 'hero-video',
    name: 'Hero video + marquee logos',
    status: 'ready',
    Component: lazy(() => import('./hero-video/Demo')),
    notes:
      "Hero card 1400x600 avec video background, texte animé, floating navbar glass, et marquee logos avec gradient hover.",
  },
  {
    slug: 'hero',
    name: 'Hero "Marketeam" (typewriter + orbites)',
    status: 'ready',
    Component: lazy(() => import('./hero/Demo')),
    notes:
      "Full viewport hero avec typewriter, 4 orbites d'avatars, curseur \"David\", ticker de logos et bordures conic-gradient animées.",
  },
  {
    slug: 'exemple',
    name: 'Composant exemple',
    status: 'ready',
    Component: lazy(() => import('./exemple/Demo')),
    notes: 'Placeholder pour valider le workflow. À supprimer.',
  },
]

export const STATUS_LABEL: Record<ComposantEntry['status'], string> = {
  wip: '🔨 En cours',
  ready: '🧪 À tester',
  validated: '✅ Validé',
  rejected: '❌ Rejeté',
}

