import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Redirections permanentes des anciennes URL WordPress.
 *
 * Les variantes avec barre oblique finale sont conservees cote source :
 * trailingSlash est desactive, Next les redirige donc deja, mais ces
 * regles pointent vers les nouvelles adresses.
 */
const REDIRECTIONS = [
  { source: '/gymfit', destination: '/realisations/gymfit-site' },
  { source: '/epicure', destination: '/realisations/epicure-pilates' },
  { source: '/les-oceades', destination: '/realisations/oceades-seo' },
  { source: '/parcbeauregard', destination: '/realisations/beauregard-kid-fitness' },
  { source: '/nos-realisations', destination: '/realisations' },
  { source: '/pagespeed-tool', destination: '/outils/test-pagespeed' },
  { source: '/simulateur-de-roi', destination: '/outils/simulateur-roi' },
  { source: '/test-visibilite-ia', destination: '/outils/test-visibilite-ia' },
  { source: '/article/:slug', destination: '/blog/:slug' },
]

const nextConfig: NextConfig = {
  // Pas de fichiers AGENTS.md / CLAUDE.md generes par next dev.
  agentRules: false,
  // Permet des builds paralleles (NEXT_DIST_DIR=.next-lotN) pendant le chantier.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  async redirects() {
    return REDIRECTIONS.map((regle) => ({ ...regle, permanent: true }))
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
