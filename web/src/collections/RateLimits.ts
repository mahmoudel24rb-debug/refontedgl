import type { CollectionConfig } from 'payload'

import { admin, serveurUniquement } from './access'

/**
 * Compteurs de quotas par cle.
 *
 * Ecrits par lib/rate-limit.ts en une requete SQL atomique ; la
 * collection sert surtout a faire generer la table et ses index.
 */
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  labels: {
    singular: 'Quota',
    plural: 'Quotas',
  },
  admin: {
    hidden: true,
    useAsTitle: 'key',
    defaultColumns: ['key', 'count', 'resetAt'],
  },
  access: {
    read: admin,
    create: serveurUniquement,
    update: serveurUniquement,
    delete: admin,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      label: 'Clé',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'count',
      type: 'number',
      label: 'Compteur',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'resetAt',
      type: 'date',
      label: 'Fin de fenêtre',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
