// src/utils.ts
//
// Utility functions for working with URLs and file paths

/**
 * Joins URL or path parts together, handling leading/trailing slashes
 * @param parts - Array of URL/path segments to join
 * @returns Joined URL/path string with normalized slashes
 *
 * @example
 * joinUrlParts('/api/', '/images', 'photo.jpg') // Returns 'api/images/photo.jpg'
 */
export function joinUrlParts(...parts: string[]) {
  return parts
    .map(
      (part, index) =>
        index === 0
          ? part.replace(/\/+$/, "") // Only strip trailing slashes from the first part
          : part.replace(/(^\/+|\/+$)/g, "") // Strip leading and trailing slashes for others
    )
    .filter(Boolean) // Remove empty parts
    .join("/");
}

/**
 * Replaces the extension of a filename with a new one
 * @param name - Original filename with extension
 * @param newExtension - New extension to apply (with or without dot)
 * @returns Filename with replaced extension
 *
 * @example
 * replaceExtension('image.jpg', '.png') // Returns 'image.png'
 */
export function replaceExtension(name: string, newExtension: string) {
  return name.replace(/\.\w+$/, newExtension);
}
