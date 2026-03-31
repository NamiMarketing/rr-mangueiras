import { type SchemaTypeDefinition } from 'sanity'
import { categoria } from './categoria'
import { produto } from './produto'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoria, produto],
}
