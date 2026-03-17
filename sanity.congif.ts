"use client";

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const config = defineConfig({
  projectId: 'ccx6q9vb',
  dataset: 'production',
  title: 'Batu',
  apiVersion: '2026-03-04',
  basePath: '/admin',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

export default config;
