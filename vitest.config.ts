/// <reference types="vitest" />
import { defineConfig } from "vite";

import makeConfig from "./vite.config";

export default defineConfig((env) => {
  const viteConfig = makeConfig(env);
  return {
    ...viteConfig,
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"], // Optional setup file
      testTransformMode: {
        web: ["\\.[jt]sx?$"],
      },
      // if you have few tests, try commenting one
      // or both out to improve performance:
      // threads: false,
      // isolate: false,
    },
    resolve: {
      conditions: ["development", "browser"],
      ...viteConfig.resolve,
    },
  };
});
