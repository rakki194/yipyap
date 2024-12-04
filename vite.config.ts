// vite.config.ts
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

const DEV_PORT = process.env.DEV_PORT ? Number(process.env.DEV_PORT) : 5173;
const BACKED_PORT = process.env.BACKED_PORT
  ? Number(process.env.BACKED_PORT)
  : 8000;
const BACKED_HOST = `http://localhost:${BACKED_PORT}`;

export default defineConfig({
  root: "src",
  plugins: [
    solidPlugin(),
    {
      name: "configure-server",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
          } else if (req.url?.endsWith(".jsx")) {
            res.setHeader("Content-Type", "text/jsx");
          } else if (req.url?.endsWith(".tsx") || req.url?.endsWith(".ts")) {
            res.setHeader("Content-Type", "application/x-typescript");
          }
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": {
        target: BACKED_HOST,
        changeOrigin: true,
      },
      "/config": {
        target: BACKED_HOST,
        changeOrigin: true,
      },
      "/preview": {
        target: BACKED_HOST,
        changeOrigin: true,
      },
      "/thumbnail": {
        target: BACKED_HOST,
        changeOrigin: true,
      },
      "/download": {
        target: BACKED_HOST,
        changeOrigin: true,
      },
      "/caption": {
        target: BACKED_HOST,
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
    outDir: "../static/dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
