import type { CollectionConfig } from 'payload'

import { admin, serveurUniquement } from './access'

/**
 * Executions des outils gratuits.
 *
 * Un run est cree anonyme des le premier resultat, puis passe en
 * debloque et se relie a un lead lorsque le visiteur laisse ses
 * coordonnees.
 */
export const ToolRuns: CollectionConfig = {
  slug: 'tool-runs',
  labels: {
    singular: "Exécution d'outil",
    plural: "Exécutions d'outils",
  },
  admin: {
    useAsTitle: 'url',
    defaultColumns: ['tool', 'statut', 'url', 'entreprise', 'createdAt'],
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
      name: 'tool',
      type: 'select',
      label: 'Outil',
      required: true,
      index: true,
      options: [
        { label: 'Test PageSpeed', value: 'pagespeed' },
        { label: 'Simulateur de ROI', value: 'roi' },
        { label: 'Test de visibilité IA', value: 'geoscan' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'statut',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'anonyme',
      index: true,
      options: [
        { label: 'Anonyme', value: 'anonyme' },
        { label: 'Débloqué', value: 'debloque' },
        { label: 'Échec', value: 'echec' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL analysée',
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'scoreMobile', type: 'number', label: 'Score mobile' },
        { name: 'scoreDesktop', type: 'number', label: 'Score ordinateur' },
      ],
    },
    {
      name: 'rapport',
      type: 'json',
      label: 'Rapport PageSpeed',
    },
    {
      name: 'entreprise',
      type: 'text',
      label: 'Entreprise',
    },
    {
      name: 'scan',
      type: 'relationship',
      relationTo: 'scans',
      label: 'Scan de visibilité',
    },
    {
      type: 'row',
      fields: [
        { name: 'score', type: 'number', label: 'Score' },
        { name: 'cited', type: 'number', label: 'Citations' },
        { name: 'total', type: 'number', label: 'Réponses analysées' },
      ],
    },
    {
      name: 'donnees',
      type: 'json',
      label: 'Données',
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      label: 'Lead',
      admin: { position: 'sidebar' },
    },
    {
      name: 'ip',
      type: 'text',
      label: 'Adresse IP',
    },
    {
      name: 'erreur',
      type: 'textarea',
      label: 'Erreur',
    },
  ],
}
