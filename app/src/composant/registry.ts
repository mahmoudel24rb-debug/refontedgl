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
    slug: 'refontev2',
    name: 'Refonte v2 — page landing (3 sections)',
    status: 'ready',
    Component: lazy(() => import('./refontev2/Demo')),
    notes:
      "Adaptation DGL du brief 'Axion Studio'. Hero avec stack shader (Swirl+ChromaFlow+FlutedGlass+FilmGrain), Section À propos (grid 26/1fr/48% en desktop), Section réalisations (2 case studies vidéo Océades/GYMFIT). Copy français, horloge Paris, couleurs coral+navy+cream.",
  },
  {
    slug: 'hero3',
    name: 'Hero3 — Glowy waves canvas (réactif souris)',
    status: 'ready',
    Component: lazy(() => import('./hero3/Demo')),
    notes:
      "Canvas 2D avec 5 couches de vagues sinusoïdales qui suivent la souris. Copy DGL, palette coral+navy. Pas de dépendance shadcn (Button inline). Bouclé sur requestAnimationFrame + prefers-reduced-motion honoré.",
  },
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
    name: 'Hero DGL (typewriter + orbites équipe/clients)',
    status: 'ready',
    Component: lazy(() => import('./hero/Demo')),
    notes:
      "Adapté du template Marketeam aux couleurs DGL. Photos Kiara/Mahmoud/Victor sur orbite 2, logos clients sur orbites 3/4, compteur 500+ clients au centre. ✅ Promu comme hero du site principal (components/Hero.tsx). Logos clients en local dans /assets/logos/.",
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

