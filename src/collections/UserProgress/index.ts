import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const UserProgress: CollectionConfig = {
  slug: 'user-progress',
  admin: {
    defaultColumns: ['user', 'lesson', 'progress'],
    useAsTitle: 'user',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => {
      // Only allow reading own progress
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'progress',
      type: 'number',
    },
    {
      name: 'completedSections',
      type: 'array',
      label: 'Completed Sections',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'completedAt',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'lastUpdated',
      type: 'date',
      defaultValue: () => new Date(),
      hooks: {
        beforeChange: [({ value }) => value || new Date()],
      },
    },
  ],
}
