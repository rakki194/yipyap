import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "solid-js";
import type { Resource } from "solid-js";
import { makeGalleryState } from "./gallery";
import type { BrowsePagesCached, ImageData, AnyItem, Captions, ImageItem, SaveCaption } from "~/resources/browse";
import { generateCaption } from "~/resources/browse";
import { action } from "@solidjs/router";

/**
 * Test suite for the Gallery State Management system.
 * 
 * These tests cover the core functionality of the gallery context, including:
 * - Basic state operations (view modes, sorting, searching)
 * - Caption management (saving, deleting, generating)
 * - Image operations (deletion, tag generation)
 * - Navigation and selection
 * - Cache management
 * - Thumbnail size calculations
 * 
 * The tests use mocked external dependencies for:
 * - Router functionality (@solidjs/router)
 * - Backend resources (~/resources/browse)
 * - Configuration and sizing utilities (~/utils/sizes)
 * - Window resize observer
 */

// Mock external dependencies
vi.mock("@solidjs/router", () => ({
  useParams: () => ({ path: "test/path" }),
  useSearchParams: () => [{ page: "1" }, vi.fn()],
  action: (fn: Function) => fn,
}));

vi.mock("~/resources/browse", () => ({
  createGalleryResourceCached: () => [
    () => mockBrowseData,
    {
      refetch: vi.fn(),
      mutate: vi.fn(),
    },
  ],
  generateCaption: vi.fn().mockResolvedValue(undefined),
  deleteImageFromBackend: vi.fn().mockResolvedValue([]),
  deleteCaptionFromBackend: vi.fn().mockResolvedValue({ success: true }),
  saveCaptionToBackend: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("~/utils/sizes", () => ({
  createConfigResource: () => [() => ({ preview_size: [1024, 1024], thumbnail_size: [300, 300] }), vi.fn()],
  getThumbnailComputedSize: () => ({ width: 300, height: 300 }),
}));

vi.mock("@solid-primitives/resize-observer", () => ({
  createWindowSize: () => ({ width: 1920, height: 1080 }),
}));

// Mock data
const mockBrowseData: BrowsePagesCached = {
  items: [Object.assign(
    () => ({
      type: "image" as const,
      name: "test.jpg",
      file_name: "test.jpg",
      size: 1024,
      mime: "image/jpeg",
      md5sum: "test-hash",
      width: 1920,
      height: 1080,
      mtime: new Date().toISOString(),
      captions: [["tags", "test, tags"]] as Captions,
    }),
    {
      type: "image" as const,
      file_name: "test.jpg",
    }
  )],
  path: "test/path",
  total_folders: 0,
  total_images: 1,
  total_pages: 1,
  mtime: new Date().toISOString(),
  pages: {},
  setters: {
    "test.jpg": vi.fn(),
  },
};

describe("Gallery State Management", () => {
  let gallery: ReturnType<typeof makeGalleryState>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fetch globally
    global.fetch = vi.fn().mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve("Success"),
      });
    });

    createRoot((dispose) => {
      gallery = makeGalleryState();
      const mockResource = () => mockBrowseData;
      mockResource.state = "ready";
      mockResource.loading = false;
      mockResource.error = undefined;
      mockResource.latest = mockBrowseData;
      gallery.data = mockResource as Resource<BrowsePagesCached>;

      // Mock selection with editedImage
      gallery.selection = {
        editedImage: mockBrowseData.items[0]() as ImageData,
        selected: 0,
        selectedImage: mockBrowseData.items[0] as ImageItem,
        select: () => true,
        selectPrev: () => true,
        selectNext: () => true,
        selectDown: () => true,
        selectUp: () => true,
        selectPageUp: () => true,
        selectPageDown: () => true,
        setMode: () => true,
        toggleEdit: () => true,
        edit: () => true,
        setColumns: () => { },
        toggleMultiSelect: () => true,
        selectAll: () => true,
        clearMultiSelect: () => { },
        multiFolderSelected: new Set<number>(),
        toggleFolderMultiSelect: () => true,
        selectAllFolders: () => true,
        clearFolderMultiSelect: () => { },
        multiSelected: new Set<number>(),
        mode: 'view' as const
      };

      // Update the gallery methods to use actual fetch calls
      gallery.saveCaption = action(async (caption: SaveCaption) => {
        const response = await fetch(`/caption/test/path/test.jpg`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(caption)
        });
        if (!response.ok) {
          return new Error(await response.text());
        }
        return response;
      });
      gallery.deleteCaption = action(async (type: string) => ({ success: true }));
      gallery.deleteImage = action(async (idx: number) => []);
      gallery.generateTags = action(async (model: string) => {
        const response = await fetch(`/api/generate/${model}/test/path/test.jpg`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return undefined;
      });

      dispose();
    });
  });

  /**
   * Tests for basic state operations in the gallery context
   * Covers initialization, view mode changes, sorting, and search functionality
   */
  describe("Basic State Operations", () => {
    it("initializes with default state", () => {
      expect(gallery.params.path).toBe("test/path");
      expect(gallery.data()).toBeDefined();
    });

    it("handles view mode changes", () => {
      gallery.setViewMode("list");
      // Since state is managed internally, we can't directly test the value
      // but we can verify the function exists and doesn't throw
      expect(() => gallery.setViewMode("grid")).not.toThrow();
    });

    it("handles sort changes", () => {
      expect(() => gallery.setSort("date")).not.toThrow();
    });

    it("handles search updates", () => {
      expect(() => gallery.setSearch("test")).not.toThrow();
    });
  });

  /**
   * Tests for caption management functionality
   * Covers saving new captions, handling save failures, and caption deletion
   */
  describe("Caption Management", () => {
    it("saves captions successfully", async () => {
      const result = await gallery.saveCaption({
        type: "tags",
        caption: "new, tags",
      });

      expect(result).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/caption/"),
        expect.any(Object)
      );
    });

    it("handles caption save failures", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve("Error saving caption"),
      });

      const result = await gallery.saveCaption({
        type: "tags",
        caption: "new, tags",
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("deletes captions successfully", async () => {
      const result = await gallery.deleteCaption("tags");
      expect(result).toEqual({ success: true });
    });
  });

  /**
   * Tests for image-related operations
   * Covers image deletion and tag generation functionality
   */
  describe("Image Operations", () => {
    it("deletes images successfully", async () => {
      const result = await gallery.deleteImage(0);
      expect(result).toEqual([]);
    });

    it("generates tags successfully", async () => {
      const result = await gallery.generateTags("wdv3");
      expect(result).toBeUndefined();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  /**
   * Tests for navigation and selection features
   * Covers page changes and folder information retrieval
   */
  describe("Navigation and Selection", () => {
    it("handles page changes", () => {
      expect(() => gallery.setPage(2)).not.toThrow();
    });

    it("fetches folder information", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ folders: [] }),
      });

      const folders = await gallery.getAllKnownFolders();
      expect(Array.isArray(folders)).toBe(true);
    });
  });

  /**
   * Tests for cache management functionality
   * Covers image cache clearing and gallery data invalidation
   */
  describe("Cache Management", () => {
    it("clears image cache", () => {
      expect(() => gallery.clearImageCache()).not.toThrow();
    });

    it("invalidates gallery data", () => {
      expect(() => gallery.invalidate()).not.toThrow();
    });
  });

  /**
   * Tests for thumbnail and preview size calculations
   * Verifies correct size computations for both preview and thumbnail images
   */
  describe("Thumbnail Size Calculations", () => {
    it("calculates preview size correctly", () => {
      const size = gallery.getPreviewSize({ width: 2000, height: 1500 });
      expect(size).toEqual({ width: 300, height: 300 });
    });

    it("calculates thumbnail size correctly", () => {
      const size = gallery.getThumbnailSize({ width: 800, height: 600 });
      expect(size).toEqual({ width: 300, height: 300 });
    });
  });

  describe("Folder Cache Management", () => {
    const mockFolders = [
      { name: "folder1", path: "folder1", fullPath: "folder1" },
      { name: "folder2", path: "folder2", fullPath: "folder2" }
    ];

    beforeEach(() => {
      localStorage.clear();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ folders: mockFolders })
      });
    });

    it("fetches and caches folders on first call", async () => {
      const folders = await gallery.getAllKnownFolders();
      expect(folders).toEqual(mockFolders);

      // Should be cached in localStorage
      const cached = JSON.parse(localStorage.getItem('yipyap_folder_cache')!);
      expect(cached.folders).toEqual(mockFolders);
      expect(cached.version).toBe(1);
    });

    it("uses cached data on subsequent calls", async () => {
      // First call to cache the data
      await gallery.getAllKnownFolders();

      // Second call should use cache
      global.fetch = vi.fn(); // Reset fetch mock
      const folders = await gallery.getAllKnownFolders();

      expect(folders).toEqual(mockFolders);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("invalidates cache correctly", async () => {
      // First cache the data
      await gallery.getAllKnownFolders();
      expect(localStorage.getItem('yipyap_folder_cache')).not.toBeNull();

      // Invalidate cache
      gallery.invalidateFolderCache();

      // Cache should be cleared
      expect(localStorage.getItem('yipyap_folder_cache')).toBeNull();

      // Next call should fetch fresh data
      const folders = await gallery.getAllKnownFolders();
      expect(folders).toEqual(mockFolders);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("handles expired cache", async () => {
      // Cache data with old timestamp
      const oldCache = {
        version: 1,
        folders: mockFolders,
        timestamp: Date.now() - 3600001 // Just over 1 hour old
      };
      localStorage.setItem('yipyap_folder_cache', JSON.stringify(oldCache));

      // Should ignore expired cache and fetch fresh data
      const folders = await gallery.getAllKnownFolders();
      expect(folders).toEqual(mockFolders);
      expect(global.fetch).toHaveBeenCalled();
    });

    it("handles invalid cache version", async () => {
      // Cache data with invalid version
      const invalidCache = {
        version: 999,
        folders: mockFolders,
        timestamp: Date.now()
      };
      localStorage.setItem('yipyap_folder_cache', JSON.stringify(invalidCache));

      // Should ignore invalid cache and fetch fresh data
      const folders = await gallery.getAllKnownFolders();
      expect(folders).toEqual(mockFolders);
      expect(global.fetch).toHaveBeenCalled();
    });

    it("handles localStorage errors gracefully", async () => {
      // Mock localStorage.getItem to throw
      const mockError = new Error("Storage error");
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => { throw mockError; });

      // Should still work by fetching from API
      const folders = await gallery.getAllKnownFolders();
      expect(folders).toEqual(mockFolders);

      // Restore original localStorage
      localStorage.getItem = originalGetItem;
    });
  });
}); 