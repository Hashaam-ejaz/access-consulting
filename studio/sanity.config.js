import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Access Consulting',

  projectId: 'ydoyouty',
  dataset: 'prod',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
