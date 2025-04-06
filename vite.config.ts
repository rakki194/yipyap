// vite.config.ts
import { brotliCompress } from "zlib";
import { promisify } from "util";
import { defineConfig, ConfigEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";
import gzipPlugin from "rollup-plugin-gzip";

// Custom port configuration with fallbacks
const DEV_PORT = process.env.DEV_PORT ? Number(process.env.DEV_PORT) : 5173;
const BACKEND_PORT = process.env.BACKEND_PORT
  ? Number(process.env.BACKEND_PORT)
  : 8000;
const BACKEND_HOST = `http://localhost:${BACKEND_PORT}`;
const NODE_ENV = process.env.NODE_ENV;
const DEBUG = !!process.env.DEBUG;

const brotliPromise = promisify(brotliCompress);

const viteConfig = (env: ConfigEnv) => {
  const { command, mode: vite_mode } = env;

  const IS_SERVE = command === "serve";
  const mode = NODE_ENV || vite_mode;
  const IS_DEV = IS_SERVE ? mode !== "production" : mode === "development";

  console.log({
    env,
    NODE_ENV,
    DEV_PORT,
    BACKEND_PORT,
    BACKEND_HOST,
    IS_SERVE,
    IS_DEV,
  });

  const server = IS_SERVE
    ? {
      proxy: {
        // Proxy to the backend
        "^/(api|preview|thumbnail|download)/.*": {
          target: BACKEND_HOST,
          changeOrigin: true,
        },
      },
      port: DEV_PORT,
    }
    : {};

  const plugins = [
    // Required plugin for SolidJS support
    solidPlugin({
      dev: IS_DEV,
      hot: IS_DEV && IS_SERVE,
      ssr: false,
    }),
  ];
  if (!IS_DEV) {
    // Adds GZIP compression for build artifacts
    plugins.push(
      gzipPlugin(),
      gzipPlugin({
        customCompression: (content) => brotliPromise(Buffer.from(content.toString())),
        fileName: ".br",
      })
    );
  }

  const config = defineConfig({
    // Changes root directory to src instead of project root
    root: "src",
    plugins,
    // Development server configuration with proxy setup to backend
    server,
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
      // Use Terser for better JS minification
      minify: IS_DEV ? "terser" : false,
      terserOptions: {
        compress: {
          // Remove console.log and debugger statements in production
          drop_console: !DEBUG, // FIXME: Remove this
          drop_debugger: !DEBUG,
        },
      },
      // Enable CSS minification and code splitting
      cssCodeSplit: !IS_DEV,
    },
  });

  if (DEBUG) {
    console.log(config);
  }

  return config;
};

export default viteConfig;
