import { defineField, defineType } from 'sanity'

export const categoria = defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Abraçadeiras', value: 'Abraçadeiras' },
          { title: 'PUC', value: 'PUC' },
          { title: 'Tubos e Conexões', value: 'Tubos e Conexões' },
          { title: 'Linha Pneumática', value: 'Linha Pneumática' },
          { title: 'Linha Hidráulica', value: 'Linha Hidráulica' },
          { title: 'Linha Industrial', value: 'Linha Industrial' },
          { title: 'Linha Alimentícia', value: 'Linha Alimentícia' },
          { title: 'Mangueiras', value: 'Mangueiras' },
          { title: 'Válvulas', value: 'Válvulas' },
          { title: 'Engate', value: 'Engate' },
          { title: 'Ar Comprimido', value: 'Ar Comprimido' },
        ],
      },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem',
      type: 'number',
      description: 'Define a ordem de exibição das categorias (menor primeiro).',
      initialValue: 0,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nome',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subcategorias',
      title: 'Subcategorias',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'nome',
              title: 'Nome da Subcategoria',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'nome',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'nome',
    },
  },
})
