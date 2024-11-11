// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  root: 'src',
  plugins: [solidPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/preview': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/thumbnail': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/download': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/caption': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    },
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: '../static/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});