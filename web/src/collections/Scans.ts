import type { CollectionConfig } from 'payload'

import { admin, serveurUniquement } from './access'

/**
 * Scans de visibilite IA (GEO scan).
 *
 * Un scan est mutualise entre les visiteurs qui demandent le meme
 * couple metier + ville tant qu il n est pas expire.
 */
export const Scans: CollectionConfig = {
  slug: 'scans',
  labels: {
    singular: 'Scan',
    plural: 'Scans',
  },
  admin: {
    useAsTitle: 'metier',
    defaultColumns: ['metier', 'ville', 'status', 'coutCents', 'createdAt'],
    group: 'Outils',
  },
  access: {
    read: admin,
    create: serveurUniquement,
    update: serveurUniquement,
    delete: admin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'metier', type: 'text', label: 'Métier', required: true },
        { name: 'ville', type: 'text', label: 'Ville', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'metierNorm',
          type: 'text',
          label: 'Métier normalisé',
          required: true,
          index: true,
        },
        {
          name: 'villeNorm',
          type: 'text',
          label: 'Ville normalisée',
          required: true,
          index: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'queued',
      index: true,
      options: [
        { label: 'En file', value: 'queued' },
        { label: 'En cours', value: 'running' },
        { label: 'Terminé', value: 'done' },
        { label: 'Erreur', value: 'error' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'progress',
      type: 'json',
      label: 'Progression',
      admin: { description: 'Étape courante et compteurs, lus par le polling.' },
    },
    {
      name: 'results',
      type: 'json',
      label: 'Résultats bruts',
    },
    {
      name: 'error',
      type: 'textarea',
      label: 'Erreur',
    },
    {
      name: 'coutCents',
      type: 'number',
      label: 'Coût (centimes)',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'attempts',
      type: 'number',
      label: 'Tentatives',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expire le',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
