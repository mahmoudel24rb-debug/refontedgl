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
    slug: 'refonte-racine',
    name: 'Refonte racine — hero glowy waves + sections v2',
    status: 'validated',
    Component: lazy(() => import('./refonte-racine/Demo')),
    notes:
      "✅ Promu comme site principal le 2026-07-03. Hero glowy waves + sections refonte partagées (components/refonte/) : manifesto scroll-reveal, bandeau typo géant, 6 services balayage coral, méthode, réalisations chiffrées, témoignages autorotate, outils gratuits (halo curseur), FAQ (JSON-LD), CTA magnétique + footer wordmark géant.",
  },
  {
    slug: 'site-v1',
    name: 'Site v1 — archive (template Bancuip)',
    status: 'validated',
    Component: lazy(() => import('./site-v1/Demo')),
    notes:
      "Archive de l'ancienne page d'accueil (avant la refonte du 2026-07-03) : hero glowy waves + FintechPlatform + FinanceFeatures + Testimonials + PowerOfFinance + Footer, hérités du template Bancuip et adaptés DGL. Conservée pour référence.",
  },
  {
    slug: 'refontev2',
    name: 'Refonte v2 — site agence complet (7 sections)',
    status: 'ready',
    Component: lazy(() => import('./refontev2/Demo')),
    notes:
      "v2 : hero shader (Swirl+ChromaFlow+FlutedGlass+FilmGrain) + les sections refonte partagées (components/refonte/) avec le contenu réel de dgl-agency.fr — manifesto scroll-reveal, 6 services balayage coral, réalisations chiffrées, témoignages, footer wordmark géant. ✅ Sections promues sur le site principal (avec le hero glowy waves à la place du shader).",
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

