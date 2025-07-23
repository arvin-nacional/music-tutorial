import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['free', 'subscriber', 'admin'],
      defaultValue: 'free',
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      options: ['none', 'active', 'expired'],
      defaultValue: 'none',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  timestamps: true,
}
