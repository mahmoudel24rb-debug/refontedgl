import type { CollectionConfig } from 'payload'

import { accesBackOffice, admin, connecte } from './access'

/** Comptes du back-office : administrateurs et editeurs. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administration',
  },
  auth: true,
  access: {
    read: connecte,
    create: admin,
    update: admin,
    delete: admin,
    admin: accesBackOffice,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rôle',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editeur' },
      ],
      admin: {
        description: "L'editeur gere les articles et les medias, pas les comptes.",
      },
    },
  ],
}
