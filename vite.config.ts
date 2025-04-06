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
const NODE_ENV = process.env.NODE_ENV;
const DEBUG = !!process.env.DEBUG;

const brotliPromise = promisify(brotliCompress);

// Custom development server middleware for correct content-type headers
const configureServer = {
  name: "configure-server",
  configureServer(server) {
    if (process.env.NODE_ENV === "development") {
      server.middlewares.use((req, res, next) => {
        // Add debug logging
        // console.debug('Vite middleware request:', {
        //   url: req.url,
        //   method: req.method,
        //   headers: req.headers
        // });

        // Set security headers
        res.setHeader("X-Content-Type-Options", "nosniff");

        // Handle content types based on file extensions and paths
        if (req.url) {
          // Extract extension, handling query parameters
          const urlWithoutQuery = req.url.split("?")[0];
          const ext = urlWithoutQuery.split(".").pop()?.toLowerCase();

          // console.debug('Processing file:', {
          //   url: urlWithoutQuery,
          //   extension: ext
          // });

          // Set content type based on file extension, regardless of path
          switch (ext) {
            // Scripts
            case "js":
            case "mjs":
              res.setHeader("Content-Type", "text/javascript; charset=utf-8");
              break;
            case "jsx":
              // Ensure JSX files (including those from node_modules) get correct type
              res.setHeader("Content-Type", "text/jsx; charset=utf-8");
              break;
            case "ts":
            case "tsx":
              res.setHeader("Content-Type", "application/x-typescript; charset=utf-8");
              break;

            // Styles - ensure all CSS files get correct type
            case "css":
              res.setHeader("Content-Type", "text/css; charset=utf-8");
              break;

            // Images
            case "svg":
              res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
              break;
            case "png":
              res.setHeader("Content-Type", "image/png");
              break;
            case "jpg":
            case "jpeg":
              res.setHeader("Content-Type", "image/jpeg");
              break;
            case "gif":
              res.setHeader("Content-Type", "image/gif");
              break;
            case "webp":
              res.setHeader("Content-Type", "image/webp");
              break;

            // Data
            case "json":
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              break;
            case "txt":
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              break;
          }
        }
        next();
      });
    }
  },
};

const viteConfig = (env) => {
  const { command, mode: vit_mode } = env;

  const IS_SERVE = command === "serve";
  const mode = NODE_ENV || vit_mode;
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
        // Proxy configuration for various API endpoints
        // More specific routes first
        "/api/png-download": {
          target: BACKEND_HOST,
          changeOrigin: true,
        },
        "/api/jtp2-config": {
          target: BACKEND_HOST,
          changeOrigin: true,
        },
        "/api/browse": {
          target: BACKEND_HOST,
          changeOrigin: true,
        },
        "/api/caption": {
          target: BACKEND_HOST,
          changeOrigin: true,
        },
        // General routes
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
        // Only proxy API-related assets, rewrite to remove /api prefix
        "^/assets/api/(.*)": {
          target: BACKEND_HOST,
          changeOrigin: true,
          rewrite: (path) => `/assets/${path.replace('/assets/api/', '')}`
        },
      },
      port: DEV_PORT,
      fs: {
        // Allow serving files from parent directory
        allow: ['..'],
        strict: false
      }
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
  if (IS_SERVE) {
    // Custom development server middleware for correct content-type headers
    plugins.push(configureServer);
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
    // Configure public assets directory relative to root
    // Note: In development, assets are served from the root path (/)
    // Example: assets/pixelings/image.png is served at /pixelings/image.png
    publicDir: "../assets",
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
          // Configure asset file names
          assetFileNames: (assetInfo: any) => {
            const name = assetInfo.name || '';
            if (!name) return 'assets/[name]-[hash][extname]';

            const info = name.split('.');
            const ext = info[info.length - 1];

            // Special handling for pixelings to preserve their paths
            if (name.includes('pixelings/')) {
              return name;
            }

            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      // Use Terser for better JS minification
      minify: IS_DEV ? "terser" : false,
      terserOptions: {
        compress: {
          // Remove console.log and debugger statements in production
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Enable CSS minification and code splitting
      cssCodeSplit: IS_DEV || IS_SERVE,
    },
  });

  if (DEBUG) {
    console.log(config);
  }

  return config;
};

export default viteConfig;
