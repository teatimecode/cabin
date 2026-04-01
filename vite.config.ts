import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  resolve: {
    alias: {
      // 保持与 Next.js 相同的路径别名
      'app': './app',
      '@react95/core': 'node_modules/@react95/core',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css.ts.vanilla.css'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./styles/variables.scss";`,
      },
    },
  },
  optimizeDeps: {
    include: ['styled-components', '@react95/core'],
  },
});
