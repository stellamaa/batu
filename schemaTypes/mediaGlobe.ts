import { defineType, defineField, defineArrayMember } from 'sanity';

export const mediaGlobe = defineType({
  name: 'mediaGlobe',
  title: 'Media Globe',
  type: 'document',
  

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Media Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'mediaItem',
          title: 'Media Item',
          type: 'object',
          

          fields: [
            defineField({
              name: 'type',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== 'image',
            }),

            defineField({
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: { accept: 'video/*' },
              hidden: ({ parent }) => parent?.type !== 'video',
            }),

            defineField({
              name: 'videoUrl',
              title: 'Video URL (fallback)',
              type: 'url',
              hidden: ({ parent }) => parent?.type !== 'video',
            }),

            defineField({
              name: 'externalLink',
              title: 'External Link (opens on click)',
              type: 'url',
              hidden: ({ parent }) => parent?.type !== 'video',
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
});