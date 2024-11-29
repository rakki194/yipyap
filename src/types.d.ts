// src/types.d.ts
//
// Core type definitions re-exported from various modules
// Provides a central location for commonly used types

/**
 * Re-exports core type definitions used throughout the application:
 * - Gallery related types for state management and context
 * - Size type for resize observer functionality
 * - Data types for images, directories and captions
 *
 * @module types
 */
export type {
  GalleryState,
  SaveCaption,
  GalleryContextType,
} from "./contexts/gallery.ts";

/**
 * Size type from solid-primitives resize observer
 * Used for tracking element dimensions
 */
export type { Size } from "@solid-primitives/resize-observer";

/**
 * Core data types for gallery items and navigation:
 * - ImageData: Metadata and properties for image files
 * - DirectoryData: Information about directory contents and structure
 * - Captions: Caption data associated with images
 * - DirectoryItem: Directory entry with path and metadata
 * - ImageItem: Image entry with path and metadata
 * - AnyItem: Union type of DirectoryItem | ImageItem
 */
export type {
  ImageData,
  //   SaveCaption,
  DirectoryData,
  Captions,
  //   AnyData,
  DirectoryItem,
  ImageItem,
  AnyItem,
} from "./resources/browse";
