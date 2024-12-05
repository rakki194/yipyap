// vite.config.ts
import { brotliCompress } from "zlib";
import { promisify } from "util";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";
import gzipPlugin from "rollup-plugin-gzip";

const DEV_PORT = process.env.DEV_PORT ? Number(process.env.DEV_PORT) : 5173;
const BACKEND_PORT = process.env.BACKEND_PORT
  ? Number(process.env.BACKEND_PORT)
  : 8000;
const BACKEND_HOST = `http://localhost:${BACKEND_PORT}`;

console.log("vite config", { DEV_PORT, BACKEND_PORT, BACKEND_HOST });

const brotliPromise = promisify(brotliCompress);

export default defineConfig({
  root: "src",
  plugins: [
    solidPlugin(),
    gzipPlugin(),
    gzipPlugin({
      customCompression: (content) => brotliPromise(Buffer.from(content)),
      fileName: ".br",
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/config": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/preview": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/thumbnail": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/download": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/caption": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
    },
    port: DEV_PORT,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"), // Map '~' to the 'src' directory
    },
  },
  build: {
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
