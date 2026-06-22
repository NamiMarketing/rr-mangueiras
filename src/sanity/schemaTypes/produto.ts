import { defineField, defineType } from 'sanity'

export const produto = defineType({
  name: 'produto',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Produto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: Record<string, unknown>) =>
          `${doc.nome || ''}-${doc.marca || ''}-${doc.tipo || ''}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'marca',
      title: 'Marca',
      type: 'string',
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
    }),
    defineField({
      name: 'codigo',
      title: 'Código',
      type: 'string',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'imagem',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subcategoria',
      title: 'Subcategoria',
      type: 'string',
      description: 'Subcategoria dentro da categoria (ex: Inox, Aço Carbono)',
    }),
  ],
  preview: {
    select: {
      title: 'nome',
      subtitle: 'marca',
      media: 'imagem',
    },
  },
})
