// vite.config.ts
import { brotliCompress } from "zlib";
import { promisify } from "util";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";
import gzipPlugin from "rollup-plugin-gzip";

// Custom port configuration with fallbacks
const DEV_PORT = process.env.DEV_PORT ? Number(process.env.DEV_PORT) : 5173;
const BACKEND_PORT = process.env.BACKEND_PORT
  ? Number(process.env.BACKEND_PORT)
  : 8000;
const BACKEND_HOST = `http://localhost:${BACKEND_PORT}`;

const IS_DEV = process.env.NODE_ENV === "development";

const brotliPromise = promisify(brotliCompress);

// Custom development server middleware for correct content-type headers
const configureServer = {
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
};

const viteConfig = defineConfig({
  // Changes root directory to src instead of project root
  root: "src",
  plugins: [
    // Required plugin for SolidJS support
    solidPlugin(),
    // Adds GZIP compression for build artifacts
    gzipPlugin(),
    // Adds Brotli compression with .br extension
    gzipPlugin({
      customCompression: (content) => brotliPromise(Buffer.from(content)),
      fileName: ".br",
    }),
    configureServer,
  ],
  // Development server configuration with proxy setup to backend
  server: {
    proxy: {
      // Proxy configuration for various API endpoints
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
  // Alias configuration for easier imports
  resolve: {
    alias: {
      // Maps '~' to the 'src' directory
      "~": resolve(__dirname, "src"),
    },
  },
  // Build configuration for production
  build: {
    // Use latest ECMAScript features
    target: "esnext",
    // Output to parent dist folder
    outDir: "../dist",
    // Clean the output directory before build
    emptyOutDir: true,
    // Generate asset manifest file
    manifest: true,
    rollupOptions: {
      output: {
        // Disable manual chunk splitting
        manualChunks: undefined,
      },
    },
    // Use Terser for better JS minification
    minify: "terser",
    terserOptions: {
      compress: {
        // Remove console.log and debugger statements in production
        drop_console: !IS_DEV,
        drop_debugger: !IS_DEV,
      },
    },
    // Enable CSS minification and code splitting
    cssMinify: !IS_DEV,
    cssCodeSplit: true,
  },
});


console.log(
  "vite config",
  {
    DEV_PORT,
    BACKEND_PORT,
    BACKEND_HOST,
    IS_DEV,
  },
  viteConfig,
  viteConfig.build?.terserOptions,
);

export default viteConfig;
