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

