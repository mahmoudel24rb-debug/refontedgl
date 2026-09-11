import type { MetadataRoute } from 'next'

import { SITE_URL, absoluteUrl } from '@/lib/seo'

/**
 * Regles d'exploration : le back-office, les routes API et l'archive des
 * prototypes restent hors des moteurs, tout le reste est ouvert.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/composant'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
