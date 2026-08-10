// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

import sanity from "@sanity/astro";


import cloudflare from "@astrojs/cloudflare";


export default defineConfig({
  vite: {
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
},

  integrations: [
    preact({ compat: true }),
    sanity({
      projectId: "ydoyouty",
      dataset: "prod",
      useCdn: false,
      apiVersion: "2024-01-01",
    }),
  ],

  adapter: cloudflare(),
});