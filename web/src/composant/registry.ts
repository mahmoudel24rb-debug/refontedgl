'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

/**
 * Registre des demos de l'archive /composant.
 *
 * Chaque prototype est charge a la demande et uniquement dans le
 * navigateur (`ssr: false`) : ces pages figees utilisent des API DOM et,
 * pour refontev2, le paquet `shaders` (three.js), qui ne doivent jamais
 * entrer dans le rendu serveur ni dans les pages du site public.
 *
 * Les metadonnees (nom, statut, notes) vivent dans entries.ts.
 */
export const COMPOSANT_COMPONENTS: Record<string, ComponentType> = {
  'site-v2': dynamic(() => import('./site-v2/Demo'), { ssr: false }),
  'refonte-racine': dynamic(() => import('./refonte-racine/Demo'), { ssr: false }),
  'site-v1': dynamic(() => import('./site-v1/Demo'), { ssr: false }),
  refontev2: dynamic(() => import('./refontev2/Demo'), { ssr: false }),
  hero3: dynamic(() => import('./hero3/Demo'), { ssr: false }),
  'hero-video': dynamic(() => import('./hero-video/Demo'), { ssr: false }),
  hero: dynamic(() => import('./hero/Demo'), { ssr: false }),
  exemple: dynamic(() => import('./exemple/Demo'), { ssr: false }),
}
