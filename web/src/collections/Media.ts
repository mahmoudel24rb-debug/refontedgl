import type { CollectionConfig } from 'payload'

import { publique, redaction } from './access'

/** Medias : images du blog et des pages, stockees sur Vercel Blob. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Média',
    plural: 'Médias',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Contenu',
  },
  access: {
    read: publique,
    create: redaction,
    update: redaction,
    delete: redaction,
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      required: true,
      admin: {
        description: "Decrit l'image pour l'accessibilite et le referencement.",
      },
    },
    {
      name: 'legende',
      type: 'text',
      label: 'Légende',
    },
  ],
}
