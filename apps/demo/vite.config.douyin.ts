import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist-douyin',
    // 打包成单个 bundle
    rollupOptions: {
      input: path.resolve(__dirname, 'src', 'main-douyin.ts'),
      output: {
        format: 'cjs',
        entryFileNames: 'game.js',
        // 禁用代码分割，打包成单个文件
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
      // 将外部依赖也打包进来
      external: [],
    },
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      'pixi.js': path.resolve(
        __dirname,
        '../../node_modules/.pnpm/pixi.js@8.17.1/node_modules/pixi.js/lib/index.mjs'
      ),
    },
  },
});
