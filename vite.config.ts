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
    {
      name: "configure-server",
      configureServer(server) {
        if (process.env.NODE_ENV === "development") {
          server.middlewares.use((req, res, next) => {
            if (req.url?.endsWith(".css")) {
              res.setHeader("Content-Type", "text/css; charset=utf-8");
            } else if (req.url?.endsWith(".svg")) {
              res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
            } else if (req.url?.endsWith(".jsx")) {
              res.setHeader("Content-Type", "text/jsx; charset=utf-8");
            } else if (req.url?.endsWith(".tsx") || req.url?.endsWith(".ts")) {
              res.setHeader(
                "Content-Type",
                "application/x-typescript; charset=utf-8"
              );
            } else if (req.url?.endsWith(".mjs")) {
              res.setHeader(
                "Content-Type",
                "application/javascript; charset=utf-8"
              );
            }
            next();
          });
        }
      },
    },
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
      "/api/config": {
        target: BACKEND_HOST,
        changeOrigin: true,
      },
      "/assets": {
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
