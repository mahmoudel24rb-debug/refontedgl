import type { CollectionConfig } from 'payload'

import { LEAD_SOURCES, LEAD_STATUTS, LEAD_TAGS } from '@/lib/leads'

import { admin, serveurUniquement } from './access'

/**
 * Leads collectes par les outils et formulaires du site.
 *
 * La creation passe par la local API (lib/leads.ts) : l'API REST
 * publique n'ecrit jamais dans cette collection.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Lead',
    plural: 'Leads',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'entreprise',
      'email',
      'source',
      'statut',
      'rappelSous2h',
      'derniereActivite',
    ],
    listSearchableFields: ['email', 'entreprise', 'nom', 'telephone'],
    group: 'CRM',
  },
  access: {
    read: admin,
    create: serveurUniquement,
    update: admin,
    delete: admin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (typeof data.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }
        data.derniereActivite = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'prenom', type: 'text', label: 'Prénom' },
        { name: 'nom', type: 'text', label: 'Nom' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'telephone', type: 'text', label: 'Téléphone' },
        { name: 'entreprise', type: 'text', label: 'Entreprise' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Site web',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      required: true,
      options: [...LEAD_SOURCES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'select',
      label: 'Étiquettes',
      hasMany: true,
      options: [...LEAD_TAGS],
      admin: { position: 'sidebar' },
    },
    {
      name: 'statut',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'nouveau',
      options: [...LEAD_STATUTS],
      admin: { position: 'sidebar' },
    },
    {
      name: 'rappelSous2h',
      type: 'checkbox',
      label: 'Rappel sous 2 h',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'derniereActivite',
      type: 'date',
      label: 'Dernière activité',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'consentement',
          type: 'checkbox',
          label: 'Consentement recueilli',
          defaultValue: false,
        },
        {
          name: 'consentementDate',
          type: 'date',
          label: 'Date du consentement',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes internes',
    },
    {
      name: 'journal',
      type: 'array',
      label: 'Journal',
      labels: { singular: 'Entrée', plural: 'Entrées' },
      admin: {
        readOnly: true,
        description: 'Historique des interactions, alimenté par les outils.',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'source', type: 'text', label: 'Source' },
        { name: 'texte', type: 'textarea', label: 'Texte' },
      ],
    },
    {
      name: 'donnees',
      type: 'json',
      label: 'Données des outils',
      admin: {
        readOnly: true,
        description: 'Résultats bruts, regroupés par outil.',
      },
    },
    {
      type: 'collapsible',
      label: 'Traces techniques',
      admin: { initCollapsed: true },
      fields: [
        { name: 'ip', type: 'text', label: 'Adresse IP' },
        { name: 'userAgent', type: 'text', label: 'User agent' },
        { name: 'pageUrl', type: 'text', label: "Page d'origine" },
        {
          name: 'utm',
          type: 'group',
          label: 'UTM',
          fields: [
            { name: 'source', type: 'text', label: 'utm_source' },
            { name: 'medium', type: 'text', label: 'utm_medium' },
            { name: 'campaign', type: 'text', label: 'utm_campaign' },
            { name: 'term', type: 'text', label: 'utm_term' },
            { name: 'content', type: 'text', label: 'utm_content' },
          ],
        },
      ],
    },
  ],
}
