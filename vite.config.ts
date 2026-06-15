import { default as react } from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  css: {
    preprocessorOptions: {
      // `@include hover { ... }` gates hover styles to hover-capable pointers (no touch sticky-hover).
      scss: { additionalData: '@mixin hover { @media (hover: hover) { @content; } }\n' },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
    port: 3000,
  }
});
