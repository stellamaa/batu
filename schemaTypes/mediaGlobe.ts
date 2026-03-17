import { defineArrayMember, defineField, defineType } from 'sanity';

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
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'mediaGlobeItem',
          title: 'Media Globe Item',
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({ parent }) => parent?.kind !== 'image',
            }),
            defineField({
              name: 'videoFile',
              title: 'Video file (for playback)',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.kind !== 'video',
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video source URL (fallback)',
              type: 'url',
              hidden: ({ parent }) => parent?.kind !== 'video',
            }),
            defineField({
              name: 'linkUrl',
              title: 'External link for this video',
              type: 'url',
              hidden: ({ parent }) => parent?.kind !== 'video',
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

