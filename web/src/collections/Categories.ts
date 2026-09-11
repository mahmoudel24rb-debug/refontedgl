import type { CollectionConfig } from 'payload'

import { slugify } from '@/lib/html'

import { publique, redaction } from './access'

/** Categories editoriales des articles (reprises de WordPress). */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Catégorie',
    plural: 'Catégories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Contenu',
  },
  access: {
    read: publique,
    create: redaction,
    update: redaction,
    delete: redaction,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        description: 'Généré depuis le nom quand il est laissé vide.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const propose = typeof value === 'string' ? value.trim() : ''
            if (propose !== '') return slugify(propose)
            const nom = typeof data?.name === 'string' ? data.name : ''
            return nom ? slugify(nom) : value
          },
        ],
      },
    },
    {
      name: 'wpId',
      type: 'number',
      label: 'Identifiant WordPress',
      index: true,
      admin: {
        position: 'sidebar',
        description: "Sert a l'import idempotent des articles.",
      },
    },
  ],
}
