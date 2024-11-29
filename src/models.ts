// src/models.ts
//
// Core type definitions and enums used throughout the application

/**
 * Enum defining the available view modes for displaying content
 */
export enum ViewMode {
  grid = "grid",
  list = "list",
}

/**
 * Utility type that preserves the exact type of T
 * Useful for maintaining type information when working with generic types
 * @template T The type to preserve
 * @returns The same type T with exact property types preserved
 */
export type Identity<T> = T extends object
  ? {} & {
      [P in keyof T]: T[P];
    }
  : T;
