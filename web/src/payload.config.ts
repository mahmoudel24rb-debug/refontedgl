import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { RateLimits } from './collections/RateLimits'
import { Scans } from './collections/Scans'
import { ToolRuns } from './collections/ToolRuns'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins: Plugin[] = [
  seoPlugin({
    collections: ['articles'],
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle: ({ doc }: { doc: { title?: string } }) =>
      doc?.title ? `${doc.title} | DGL Agency` : 'DGL Agency',
    generateDescription: ({ doc }: { doc: { excerpt?: string } }) => doc?.excerpt ?? '',
  }),
]

// Stockage des medias sur Vercel Blob uniquement quand le jeton existe :
// en local, Payload retombe sur le disque.
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

// Sans cle Resend, aucun adaptateur n'est fourni : Payload journalise
// les emails au lieu de les envoyer.
const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
      defaultFromName: 'DGL Agency',
    })
  : undefined

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - DGL Agency',
    },
  },
  collections: [Users, Media, Categories, Articles, Leads, Scans, ToolRuns, RateLimits],
  editor: lexicalEditor(),
  email,
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: 'fr',
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    idType: 'uuid',
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins,
})
