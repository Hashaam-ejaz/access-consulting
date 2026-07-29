// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
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
  optimizeDeps: {
    include: ["downshift"],
    esbuildOptions: {
      alias: {
        react: "preact/compat",
        "react-dom": "preact/compat",
      },
    },
  },
},

  integrations: [
    preact({ compat: true }),   // ← the compat flag adds the react aliases
  ],

});