import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Determine if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), tailwind()],
  site: 'https://patrickcmserrano.github.io',
  base: isGitHubPages ? '/AnilistExplorer' : '/',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
});
