// src/utils/format.ts
//
// This file contains utility functions for formatting data.

/**
 * Formats a file size from bytes into a human-readable string with appropriate units.
 *
 * @param bytes - The file size in bytes to format
 * @returns A string representing the file size with units (e.g. "1.5 MB")
 *
 * @example
 * formatFileSize(1500) // Returns "1.5 KB"
 * formatFileSize(1500000) // Returns "1.4 MB"
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
