import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: 'dist-douyin',
    sourcemap: true,
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
    alias: {
    },
  },
});
