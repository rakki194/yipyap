import { Component, JSX, createComponent } from "solid-js";
import { render } from "@solidjs/testing-library";
import { AppContext } from "~/contexts/contexts";
import { GalleryContext } from "~/contexts/contexts";
import type { Resource } from "solid-js";
import { vi } from "vitest";
import type { ImageInfo, SaveCaption } from "~/contexts/gallery";
import { action } from "@solidjs/router";

// Define Mode type locally
type Mode = "view" | "edit";

// Common mock data types
export interface MockResource<T> {
  loading: boolean;
  error: null | Error;
  latest: T;
  state: "ready" | "pending" | "refreshing" | "errored";
  mutate: (v: T) => void;
  refetch: () => Promise<T>;
  get: () => T;
  (): T;
}

// Standard test wrapper component
export const TestWrapper: Component<{ context: any; children: JSX.Element }> = (props) => {
  const galleryState = {
    saveCaption: mockFns.saveCaption,
    deleteCaption: mockFns.deleteCaption,
    saveWithHistory: mockFns.saveWithHistory,
    undo: mockFns.undo,
    selection: {
      editedImage: mockBrowseData.items[0](),
      selectedImage: mockBrowseData.items[0],
      multiSelected: new Set<number>(),
      multiFolderSelected: new Set<number>(),
      mode: 'view' as Mode,
      select: (idx: number | "last" | null) => false,
      selectPrev: () => false,
      selectNext: () => false,
      selectDown: () => false,
      selectUp: () => false,
      selectPageUp: () => false,
      selectPageDown: () => false,
      toggleEdit: () => false,
      edit: () => false,
      setColumns: () => { },
      toggleMultiSelect: () => false,
      selectAll: () => false,
      clearMultiSelect: () => { },
      toggleFolderMultiSelect: () => false,
      clearFolderMultiSelect: () => { },
      selectAllFolders: () => false,
      setMode: () => true,
      selected: null,
    },
    data: createMockResource(mockBrowseData),
    state: {
      viewMode: "grid" as const,
      sort: "name" as const,
      search: "",
      page: 1,
      path: "",
    },
    setViewMode: (mode: "grid" | "list") => { },
    setSort: (sort: "name" | "date" | "size") => { },
    setSearch: (search: string) => { },
    setPage: async (page: number) => { },
    refetch: () => null,
    invalidate: () => { },
    getEditedImage: () => undefined,
    clearImageCache: () => { },
    getAllKnownFolders: async () => [],
    generateTags: action(async (generator: string) => undefined),
    windowSize: { width: 1920, height: 1080 },
    getThumbnailSize: () => ({ width: 300, height: 300 }),
    captionHistory: () => [],
    getPreviewSize: () => ({ width: 1024, height: 1024 }),
    params: { id: "test", path: "test/path" },
    deleteImage: action(async (idx: number) => new Error("Mock error")),
    getImageInfo: () => null,
    getImagePath: () => "",
    getImageUrl: () => "",
    getImageThumbnailUrl: () => "",
    getImagePreviewUrl: () => "",
    getThumbnailComputedSize: () => ({ width: 300, height: 300 }),
    selectedImage: mockBrowseData.items[0],
    selected: null,
    setMode: () => true,
    toggleEdit: () => false,
    edit: () => false,
    setColumns: () => { },
    toggleMultiSelect: () => false,
    selectAll: () => false,
    clearMultiSelect: () => { },
    toggleFolderMultiSelect: () => false,
    clearFolderMultiSelect: () => { },
    selectAllFolders: () => false,
    editedImage: mockBrowseData.items[0](),
    mode: 'view' as Mode,
    multiSelected: new Set<number>(),
    multiFolderSelected: new Set<number>(),
    select: (idx: number | "last" | null) => false,
    selectPrev: () => false,
    selectNext: () => false,
    selectDown: () => false,
    selectUp: () => false,
    selectPageUp: () => false,
    selectPageDown: () => false,
    refetchGallery: vi.fn(),
    setData: vi.fn(),
    invalidateFolderCache: vi.fn(),
    setFavoriteState: action(async (image: ImageInfo, state: number) => new Error("Mock error")),
  };

  return createComponent(AppContext.Provider, {
    value: props.context,
    get children() {
      return createComponent(GalleryContext.Provider, {
        value: galleryState,
        get children() {
          return props.children;
        }
      });
    }
  });
};

// Helper to create mock resources
export function createMockResource<T>(data: T): Resource<T> {
  const resource = (() => data) as Resource<T>;
  resource.loading = false;
  resource.error = undefined;
  resource.latest = data;
  resource.state = "ready";
  return resource;
}

// Helper to render with context
export function renderWithContext(ui: () => JSX.Element, context = mockAppContext) {
  return render(() => createComponent(TestWrapper, {
    context,
    children: ui()
  }));
}

// Common mock app context
export const mockAppContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      "tools.undo": "Undo",
      "tools.removeCommas": "Remove commas",
      "tools.replaceNewlinesWithCommas": "Replace newlines with commas",
      "tools.replaceUnderscoresWithSpaces": "Replace underscores with spaces",
      "Add a tag...": "Add a tag...",
      "Remove tag": "Remove tag",
      "Add tag": "Add tag",
      "Delete tags caption": "Delete tags caption",
      "Undo last change": "Undo last change",
      "gallery.addCaption": "Add caption"
    };
    return translations[key] || key;
  },
  theme: "light",
  setTheme: () => { },
  preserveLatents: false,
  preserveTxt: false,
  enableZoom: true,
  enableMinimap: true,
  thumbnailSize: 250,
  createNotification: () => { },
};

// Common mock functions
export const mockFns = {
  saveCaption: Object.assign(
    action(async (caption: SaveCaption) => new Error("Mock error")),
    { mockClear: vi.fn() }
  ),
  deleteCaption: Object.assign(
    action(async (type: string) => new Error("Mock error")),
    { mockClear: vi.fn() }
  ),
  saveWithHistory: Object.assign(
    action(async (caption: string) => new Error("Mock error")),
    { mockClear: vi.fn() }
  ),
  undo: Object.assign(
    action(async () => new Error("Mock error")),
    { mockClear: vi.fn() }
  ),
};

// Common mock data
export const mockBrowseData = {
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
      captions: [["tags", "tag1, tag2"]] as [string, string][],
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