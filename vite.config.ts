// vite.config.ts
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  plugins: [solidPlugin()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/config": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/preview": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/thumbnail": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/download": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/caption": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
    port: process.env.DEV_PORT ? Number(process.env.DEV_PORT) : 5173,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"), // Map '~' to the 'src' directory
    },
  },
  build: {
    target: "esnext",
    outDir: "../static/dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
