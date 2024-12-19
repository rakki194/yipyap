/**
 * TypeScript declaration file for Vitest and Vite environment configuration.
 * 
 * This file extends the global ImportMeta interface to provide type definitions
 * for both Vite environment variables and Vitest testing utilities. It ensures
 * proper TypeScript type checking when working with environment variables
 * and testing contexts.
 * 
 * @file
 * @module vitest-declarations
 * 
 * Interfaces:
 * - ImportMetaEnv: Defines the structure of Vite environment variables
 * - ImportMeta: Extends the global ImportMeta interface with Vite and Vitest properties
 * 
 * Environment Variables:
 * - VITE_APP_TITLE: Application title defined in environment
 * 
 * Usage:
 * This file is automatically referenced by TypeScript and doesn't need
 * to be imported explicitly. It provides type safety when accessing:
 * - Environment variables: import.meta.env.VITE_APP_TITLE
 * - Vitest utilities: import.meta.vitest
 * 
 * @example
 * // Accessing environment variables with type safety
 * const title = import.meta.env.VITE_APP_TITLE;
 * 
 * // Using Vitest in test files
 * if (import.meta.vitest) {
 *   // Vitest-specific code
 * }
 */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly vitest: any;
} 