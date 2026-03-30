import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
  basePath: '/admin',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yoursanityprojectid',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'RR Mangueiras Admin',
  schema,
  plugins: [
    structureTool(),
    visionTool(),
  ],
})
