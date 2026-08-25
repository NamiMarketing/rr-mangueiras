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
          { title: 'Tubos e conexões PPR', value: 'Tubos e conexões PPR' },
          { title: 'Linha Pneumática', value: 'Linha Pneumática' },
          { title: 'Linha Hidráulica', value: 'Linha Hidráulica' },
          { title: 'Linha Industrial', value: 'Linha Industrial' },
          { title: 'Mangueiras Alimentícias e sanitárias', value: 'Mangueiras Alimentícias e sanitárias' },
          { title: 'Mangueiras', value: 'Mangueiras' },
          { title: 'Válvulas', value: 'Válvulas' },
          { title: 'Engates', value: 'Engates' },
          { title: 'Ar Comprimido', value: 'Ar Comprimido' },
          { title: 'Estética automotiva', value: 'Estética automotiva' },
          { title: 'Conexões galvanizadas e de aço inox', value: 'Conexões galvanizadas e de aço inox' },
          { title: 'Tubos flexíveis inox', value: 'Tubos flexíveis inox' },
          { title: 'Conexões e adaptadores', value: 'Conexões e adaptadores' },
          { title: 'Válvulas industriais', value: 'Válvulas industriais' },
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
      name: 'layout',
      title: 'Layout da listagem',
      type: 'string',
      description:
        'Como os produtos aparecem na página de produtos. "Compacto" é para catálogos sem descrição: só nome e imagem, em duas colunas. Em "Automático" a página decide sozinha — vira compacto quando nenhum produto da categoria tem descrição.',
      options: {
        list: [
          { title: 'Automático', value: 'auto' },
          { title: 'Padrão — nome, imagem e descrição', value: 'padrao' },
          { title: 'Compacto — duas colunas, sem descrição', value: 'compacto' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
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
            defineField({
              name: 'ordem',
              title: 'Ordem',
              type: 'number',
              description:
                'Ordem de exibição da subcategoria na página (menor primeiro). Deixe 0 para ordenar alfabeticamente.',
              initialValue: 0,
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
