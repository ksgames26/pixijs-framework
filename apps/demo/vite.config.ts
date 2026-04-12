import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    preserveSymlinks: true,
    dedupe: ['pixi.js'],
    alias: {
      // Ensure pixi.js resolves to the correct location with its dependencies
      'pixi.js': path.resolve(__dirname, '../../node_modules/.pnpm/pixi.js@8.17.1/node_modules/pixi.js/lib/index.mjs'),
    },
  },
  optimizeDeps: {
    include: [
      'pixi.js',
      'eventemitter3',
      '@pixi/colord',
      '@pixi/colord/plugins/names',
      '@xmldom/xmldom',
      'earcut',
      'ismobilejs',
      'parse-svg-path',
      'tiny-lru',
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
    },
  },
});
