import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Cross-platform API restriction: framework packages MUST NOT use Web-only APIs
  {
    files: ['packages/core/src/**/*.ts', 'packages/assets/src/**/*.ts', 'packages/scene/src/**/*.ts', 'packages/ui/src/**/*.ts', 'packages/spine/src/**/*.ts', 'packages/debug/src/**/*.ts', 'packages/test-utils/src/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error',
        { name: 'document', message: 'Use PlatformAdapter.createCanvas() or PlatformAdapter.createImage() instead.' },
        { name: 'window', message: 'Use PlatformAdapter.getSystemInfo() for screen info, PlatformAdapter.requestAnimationFrame() for rAF.' },
        { name: 'localStorage', message: 'Use PlatformAdapter.getStorage() instead.' },
        { name: 'fetch', message: 'Use PlatformAdapter.fetch() instead.' },
        { name: 'requestAnimationFrame', message: 'Use PlatformAdapter.requestAnimationFrame() instead.' },
        { name: 'cancelAnimationFrame', message: 'Use PlatformAdapter.cancelAnimationFrame() instead.' },
        { name: 'Image', message: 'Use PlatformAdapter.createImage() instead.' },
        { name: 'HTMLElement', message: 'Use PlatformAdapter for DOM operations.' },
        { name: 'HTMLCanvasElement', message: 'Use PlatformAdapter.createCanvas() instead.' },
      ],
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
);
