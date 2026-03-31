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
          { title: 'Adaptadores', value: 'Adaptadores' },
          { title: 'Conexões', value: 'Conexões' },
          { title: 'Correias', value: 'Correias' },
          { title: 'Engates', value: 'Engates' },
          { title: 'Estética automotiva', value: 'Estética automotiva' },
          { title: 'Filtro Y', value: 'Filtro Y' },
          { title: 'Lençol de borracha', value: 'Lençol de borracha' },
          { title: 'Lubrificação', value: 'Lubrificação' },
          { title: 'Mangueiras', value: 'Mangueiras' },
          { title: 'Manômetros', value: 'Manômetros' },
          { title: 'Registros', value: 'Registros' },
          { title: 'Terminais hidráulicos', value: 'Terminais hidráulicos' },
          { title: 'Tubos', value: 'Tubos' },
          { title: 'Tubos metálicos flexíveis', value: 'Tubos metálicos flexíveis' },
          { title: 'Válvulas', value: 'Válvulas' },
        ],
      },
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
