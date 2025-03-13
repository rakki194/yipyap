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

/** Caching function that preloads `options.forward` items in the direction
 * of navigation given by `getIdx()`,
 * Also `options.backward` items are retained for quick access.
 *
 * Cache busting is manual, the mapping `idx => items[idx]` is not expected to change, appending is ok.
 * */
export function cacheNavigation<T, U>(
  items: () => T[],
  getIdx: () => number | null,
  load: (item: T, idx: number) => U | undefined,
  options?: {
    unload?: (item: U, idx: number) => void;
    preload_fwd?: number;
    preload_rev?: number;
    keep_fwd?: number;
    keep_rev?: number;
  }
): [() => U | undefined, () => void] {
  const preload_fwd = options?.preload_fwd ?? 1,
    preload_rev = options?.preload_rev ?? 1,
    min_preload = Math.min(preload_fwd, preload_rev),
    keep_fwd = Math.min(options?.keep_fwd ?? preload_fwd, preload_fwd),
    keep_rev = Math.min(options?.keep_rev ?? preload_rev, preload_rev),
    min_keep = Math.min(keep_fwd, keep_rev),
    unload = options?.unload,
    cache = new Map<number, U>();
  let prev_idx: number | undefined;

  const getCached = () => {
    const idx = getIdx();
    const xs = items();
    if (idx == null) return undefined;
    if (idx === prev_idx) {
      const res = cache.get(idx);
      if (!!res) return res;
    }
    if (idx < 0 || idx >= xs.length) return undefined;
    let lower_preload, higher_preload, lower_keep, higher_keep;
    if (prev_idx === undefined) {
      lower_preload = idx - min_preload;
      higher_preload = idx + min_preload;
      lower_keep = idx - min_keep;
      higher_keep = idx + min_keep;
    } else {
      const delta = idx - prev_idx;
      if (delta > 0) {
        lower_preload = idx - preload_rev;
        higher_preload = idx + preload_fwd;
        lower_keep = idx - keep_rev;
        higher_keep = idx + keep_fwd;
      } else {
        lower_preload = idx - preload_fwd;
        higher_preload = idx + preload_rev;
        lower_keep = idx - keep_rev;
        higher_keep = idx + keep_fwd;
      }
    }

    // Clamp to valid indices, also goes from inclusive, to end-exclusive
    lower_preload = Math.max(lower_preload, 0);
    higher_preload = Math.min(higher_preload + 1, xs.length);
    lower_keep = Math.max(lower_keep, 0);
    higher_keep = Math.min(higher_keep + 1, xs.length);

    // console.log("cache limits", {
    //   prev_idx,
    //   idx,
    //   lower_preload,
    //   higher_preload,
    //   lower_keep,
    //   higher_keep,
    //   preload_fwd,
    //   preload_rev,
    //   length: xs.length,
    // });

    // Evict items that are no longer in the keep window
    for (const key of cache.keys()) {
      if (key < lower_keep || key >= higher_keep) {
        if (unload) {
          unload(cache.get(key)!, key);
        }
        cache.delete(key);
      }
    }

    // Load the current item if it's not already cached
    let res = cache.get(idx);
    if (res == undefined) {
      res = load(xs[idx], idx);
      if (res) {
        cache.set(idx, res);
      }
    }

    // Load items that are now in the preload window
    queueMicrotask(() => {
      for (let i = lower_preload; i < higher_preload; i++) {
        if (!cache.has(i)) {
          const res = load(xs[i], i);
          if (res) {
            cache.set(i, res);
          }
        }
      }
    });

    prev_idx = idx;
    return res;
  };

  return [
    getCached,
    () => {
      prev_idx = undefined;
      cache.clear();
    },
  ];
}
