import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { MultiSelectActions } from "./MultiSelectActions";
import { Component } from "solid-js";
import { AppContext, GalleryContext } from "~/contexts/contexts";
import type { Theme } from "~/contexts/theme";
import type { Locale } from "~/i18n";
import type { AppContext as AppContextType } from "~/contexts/app";
import type { GalleryContextType } from "~/contexts/gallery";
import { createMockResource } from "~/test/test-utils";
import { action } from "@solidjs/router";
import getIcon from "~/icons";
import { AnyItem } from "~/types";
import type { SaveCaption } from "~/types";

// Mock icons
vi.mock("~/icons", () => ({
  default: () => null
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock app context
const mockAppContext: AppContextType = {
  t: (key: string, params?: any) => {
    const translations: Record<string, string> = {
      'gallery.deleteSelected': 'Delete Selected',
      'gallery.selectAll': 'Select All',
      'gallery.deselectAll': 'Deselect All',
      'gallery.deletingFiles': 'Deleting files...',
      'gallery.deleteSuccess': 'Files deleted successfully',
      'gallery.deleteError': 'Error deleting files',
      'gallery.folderDeleteError': 'Error deleting folders',
      'gallery.someDeletesFailed': 'Some files failed to delete',
      'gallery.deleteConfirmation': 'Delete Confirmation',
      'gallery.confirmMultiDelete': params?.count ? 
        `Delete ${params.count} items (${params.folders || 0} folders, ${params.images || 0} images)?` : 
        'Delete selected items?',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete'
    };
    return translations[key] || key;
  },
  notify: vi.fn(),
  preserveLatents: false,
  setPreserveLatents: vi.fn(),
  preserveTxt: false,
  setPreserveTxt: vi.fn(),
  theme: "light" as Theme,
  locale: "en" as Locale,
  setTheme: vi.fn(),
  instantDelete: false,
  setInstantDelete: vi.fn(),
  enableZoom: true,
  setEnableZoom: vi.fn(),
  enableMinimap: true,
  setEnableMinimap: vi.fn(),
  thumbnailSize: 250,
  setThumbnailSize: vi.fn(),
  alwaysShowCaptionEditor: false,
  setAlwaysShowCaptionEditor: vi.fn(),
  disableAnimations: false,
  setDisableAnimations: vi.fn(),
  location: { pathname: "/", search: "", hash: "", query: {}, state: null, key: "" },
  prevRoute: undefined,
  createNotification: vi.fn(),
  setLocale: vi.fn(),
  disableNonsense: false,
  setDisableNonsense: vi.fn(),
  jtp2: {
    modelPath: "",
    tagsPath: "",
    threshold: 0.35,
    forceCpu: false,
    setModelPath: vi.fn(),
    setTagsPath: vi.fn(),
    setThreshold: vi.fn(),
    setForceCpu: vi.fn()
  },
  wdv3: {
    modelName: "vit",
    genThreshold: 0.35,
    charThreshold: 0.35,
    forceCpu: false,
    setModelName: vi.fn(),
    setGenThreshold: vi.fn(),
    setCharThreshold: vi.fn(),
    setForceCpu: vi.fn()
  },
  wdv3ModelName: "vit",
  wdv3GenThreshold: 0.35,
  wdv3CharThreshold: 0.35,
  setWdv3ModelName: vi.fn(),
  setWdv3GenThreshold: vi.fn(),
  setWdv3CharThreshold: vi.fn(),
};

// Mock gallery context
const createMockGalleryContext = (overrides = {}): GalleryContextType => ({
  selection: {
    multiSelected: new Set<number>(),
    multiFolderSelected: new Set<number>(),
    clearMultiSelect: vi.fn(),
    clearFolderMultiSelect: vi.fn(),
    selectAll: vi.fn(),
    mode: "view",
    setMode: vi.fn(),
    selected: null,
    selectedImage: null,
    editedImage: null,
    select: vi.fn(),
    selectPrev: vi.fn(),
    selectNext: vi.fn(),
    selectUp: vi.fn(),
    selectDown: vi.fn(),
    selectPageUp: vi.fn(),
    selectPageDown: vi.fn(),
    toggleEdit: vi.fn(),
    edit: vi.fn(),
    setColumns: vi.fn(),
    toggleMultiSelect: vi.fn(),
    toggleFolderMultiSelect: vi.fn(),
    selectAllFolders: vi.fn(),
  },
  multiSelected: new Set<number>(),
  selectAll: vi.fn(),
  clearMultiSelect: vi.fn(),
  multiFolderSelected: new Set<number>(),
  clearFolderMultiSelect: vi.fn(),
  data: createMockResource({
    items: [
      Object.assign(() => ({
        type: "image" as const,
        name: "test1.jpg",
        file_name: "test1.jpg",
        size: 1024,
        mime: "image/jpeg",
        width: 100,
        height: 100,
        mtime: new Date().toISOString(),
        md5sum: "test1",
        captions: []
      }), { type: "image" as const, file_name: "test1.jpg" }),
      Object.assign(() => ({
        type: "image" as const,
        name: "test2.jpg",
        file_name: "test2.jpg",
        size: 1024,
        mime: "image/jpeg",
        width: 100,
        height: 100,
        mtime: new Date().toISOString(),
        md5sum: "test2",
        captions: []
      }), { type: "image" as const, file_name: "test2.jpg" }),
      Object.assign(() => ({
        type: "directory" as const,
        name: "folder1",
        mtime: new Date().toISOString()
      }), { type: "directory" as const, file_name: "folder1" })
    ],
    path: "test/path",
    total_folders: 1,
    total_images: 2,
    total_pages: 1,
    mtime: new Date().toISOString(),
    pages: {},
    setters: {
      "test1.jpg": vi.fn(),
      "test2.jpg": vi.fn(),
      "folder1": vi.fn()
    }
  }),
  refetchGallery: vi.fn(),
  setViewMode: vi.fn(),
  setSort: vi.fn(),
  setSearch: vi.fn(),
  setPage: vi.fn(),
  invalidate: vi.fn(),
  getEditedImage: vi.fn(),
  clearImageCache: vi.fn(),
  getAllKnownFolders: vi.fn(),
  generateTags: action(async (generator: string) => undefined),
  windowSize: { width: 1920, height: 1080 },
  getThumbnailSize: vi.fn(),
  getPreviewSize: vi.fn(),
  params: { path: "test/path" },
  deleteImage: action(async (idx: number) => [] as AnyItem[]),
  refetch: vi.fn(),
  setData: vi.fn(),
  saveCaption: action(async (caption: SaveCaption) => new Error()),
  deleteCaption: action(async (type: string) => ({ success: true })),
  invalidateFolderCache: vi.fn(),
  select: vi.fn(),
  selectedImage: null,
  selectPrev: vi.fn(),
  selectNext: vi.fn(),
  selectUp: vi.fn(),
  selectDown: vi.fn(),
  selectPageUp: vi.fn(),
  selectPageDown: vi.fn(),
  toggleEdit: vi.fn(),
  edit: vi.fn(),
  setColumns: vi.fn(),
  toggleMultiSelect: vi.fn(),
  toggleFolderMultiSelect: vi.fn(),
  selectAllFolders: vi.fn(),
  mode: "view",
  setMode: vi.fn(),
  selected: null,
  editedImage: null,
  ...overrides
});

// Test wrapper component
const TestWrapper: Component<{ gallery?: Partial<GalleryContextType>; children: any }> = (props) => {
  const galleryContext = createMockGalleryContext();
  const mergedContext = {
    ...galleryContext,
    ...props.gallery,
    selection: {
      ...galleryContext.selection,
      ...(props.gallery?.selection || {})
    }
  };
  return (
    <AppContext.Provider value={mockAppContext}>
      <GalleryContext.Provider value={mergedContext}>
        {props.children}
      </GalleryContext.Provider>
    </AppContext.Provider>
  );
};

// Mock DeleteConfirmDialog component
vi.mock("./DeleteConfirmDialog", () => ({
  DeleteConfirmDialog: (props: any) => (
    <div data-testid="delete-confirm-dialog">
      <div>{props.imageCount} images, {props.folderCount} folders</div>
      <button onClick={props.onConfirm}>Delete</button>
      <button onClick={props.onCancel}>Cancel</button>
    </div>
  )
}));

describe("MultiSelectActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    (mockAppContext.notify as unknown as Mock).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when no items are available", () => {
    const emptyGallery = createMockGalleryContext({
      data: () => ({ items: [], path: "", total_folders: 0, total_images: 0, total_pages: 0, mtime: "", pages: {} })
    });

    const { container } = render(() => (
      <TestWrapper gallery={emptyGallery}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    expect(container.firstChild).toBeNull();
  });

  it("should render select all button when items are available", () => {
    const { getByTitle } = render(() => (
      <TestWrapper>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const selectAllButton = getByTitle("Select All");
    expect(selectAllButton).toBeInTheDocument();
  });

  it("should render deselect all button when items are selected", () => {
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deselectButton = getByTitle("Deselect All");
    expect(deselectButton).toBeInTheDocument();
  });

  it("should render delete button when items are selected", () => {
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deleteButton = getByTitle("Delete Selected");
    expect(deleteButton).toBeInTheDocument();
  });

  it("should call selectAll when clicking select all button", async () => {
    const mockSelectAll = vi.fn();
    const galleryContext = {
      selection: {
        multiSelected: new Set<number>(),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: mockSelectAll,
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle } = render(() => (
      <TestWrapper gallery={galleryContext}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const selectAllButton = getByTitle("Select All");
    await fireEvent.click(selectAllButton);
    expect(mockSelectAll).toHaveBeenCalled();
  });

  it("should call clearMultiSelect when clicking deselect all button", async () => {
    const mockClearMultiSelect = vi.fn();
    const mockClearFolderMultiSelect = vi.fn();
    const galleryContext = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: mockClearMultiSelect,
        clearFolderMultiSelect: mockClearFolderMultiSelect,
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle } = render(() => (
      <TestWrapper gallery={galleryContext}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deselectButton = getByTitle("Deselect All");
    await fireEvent.click(deselectButton);
    expect(mockClearMultiSelect).toHaveBeenCalled();
    expect(mockClearFolderMultiSelect).toHaveBeenCalled();
  });

  it("should show delete confirmation dialog when clicking delete button", async () => {
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle, getByTestId } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deleteButton = getByTitle("Delete Selected");
    await fireEvent.click(deleteButton);

    const dialog = getByTestId("delete-confirm-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("2 images, 0 folders");
  });

  it("should handle successful deletion", async () => {
    mockFetch.mockImplementation(() => Promise.resolve({ ok: true }));
    
    const mockRefetchGallery = vi.fn();
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      },
      refetchGallery: mockRefetchGallery,
      data: createMockResource({
        items: [
          Object.assign(() => ({
            type: "image" as const,
            name: "test1.jpg",
            file_name: "test1.jpg",
            size: 1024,
            mime: "image/jpeg",
            width: 100,
            height: 100,
            mtime: new Date().toISOString(),
            md5sum: "test1",
            captions: []
          }), { type: "image" as const, file_name: "test1.jpg" }),
          Object.assign(() => ({
            type: "image" as const,
            name: "test2.jpg",
            file_name: "test2.jpg",
            size: 1024,
            mime: "image/jpeg",
            width: 100,
            height: 100,
            mtime: new Date().toISOString(),
            md5sum: "test2",
            captions: []
          }), { type: "image" as const, file_name: "test2.jpg" })
        ],
        path: "test/path",
        total_folders: 0,
        total_images: 2,
        total_pages: 1,
        mtime: new Date().toISOString(),
        pages: {},
        setters: {
          "test1.jpg": vi.fn(),
          "test2.jpg": vi.fn()
        }
      })
    };

    const { getByTitle, getByTestId, getByText } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deleteButton = getByTitle("Delete Selected");
    await fireEvent.click(deleteButton);

    const dialog = getByTestId("delete-confirm-dialog");
    const confirmButton = getByText("Delete");
    
    // Clear mock before clicking confirm
    (mockAppContext.notify as unknown as Mock).mockClear();
    
    await fireEvent.click(confirmButton);

    // Wait for all promises to resolve
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockAppContext.notify).toHaveBeenCalledWith(
      "Deleting files...",
      "info"
    );
    expect(mockAppContext.notify).toHaveBeenCalledWith(
      "Files deleted successfully",
      "success"
    );
    expect(mockRefetchGallery).toHaveBeenCalled();
  });
/*
  it("should handle deletion errors", async () => {
    // Mock translations for error messages
    const mockTranslations: Record<string, string> = {
      'gallery.deletingFiles': 'Deleting files...',
      'gallery.deleteError': 'Error deleting files',
      'gallery.deleteSelected': 'Delete Selected',
      'gallery.deselectAll': 'Deselect All',
      'gallery.selectAll': 'Select All',
      'gallery.deleteSuccess': 'Files deleted successfully'
    };
    mockAppContext.t = (key: string, params?: any) => mockTranslations[key] || key;

    // Mock fetch to return a failed response
    mockFetch.mockImplementation(() => Promise.resolve({ ok: false, status: 500 }));
    
    const mockRefetchGallery = vi.fn();
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      },
      refetchGallery: mockRefetchGallery,
      data: createMockResource({
        items: [
          Object.assign(() => ({
            type: "image" as const,
            name: "test1.jpg",
            file_name: "test1.jpg",
            size: 1024,
            mime: "image/jpeg",
            width: 100,
            height: 100,
            mtime: new Date().toISOString(),
            md5sum: "test1",
            captions: []
          }), { type: "image" as const, file_name: "test1.jpg" }),
          Object.assign(() => ({
            type: "image" as const,
            name: "test2.jpg",
            file_name: "test2.jpg",
            size: 1024,
            mime: "image/jpeg",
            width: 100,
            height: 100,
            mtime: new Date().toISOString(),
            md5sum: "test2",
            captions: []
          }), { type: "image" as const, file_name: "test2.jpg" })
        ],
        path: "test/path",
        total_folders: 0,
        total_images: 2,
        total_pages: 1,
        mtime: new Date().toISOString(),
        pages: {},
        setters: {
          "test1.jpg": vi.fn(),
          "test2.jpg": vi.fn()
        }
      })
    };

    const { getByTitle, getByText } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deleteButton = getByTitle("Delete Selected");
    await fireEvent.click(deleteButton);

    const confirmButton = getByText("Delete");
    
    // Clear mock before clicking confirm
    (mockAppContext.notify as unknown as Mock).mockClear();
    
    // Click and wait for all promises to settle
    await fireEvent.click(confirmButton);
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockAppContext.notify).toHaveBeenCalledWith(
      "Deleting files...",
      "info"
    );
    expect(mockAppContext.notify).toHaveBeenCalledWith(
      "Error deleting files",
      "error"
    );
    expect(mockRefetchGallery).not.toHaveBeenCalled();
  });
*/

  it("should show progress bar during deletion", async () => {
    // Mock translations
    const mockTranslations: Record<string, string> = {
      'gallery.deletingFiles': 'Deleting files...',
      'gallery.deleteSuccess': 'Files deleted successfully',
      'gallery.deleteSelected': 'Delete Selected',
      'gallery.deselectAll': 'Deselect All',
      'gallery.selectAll': 'Select All'
    };
    mockAppContext.t = (key: string, params?: any) => mockTranslations[key] || key;

    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)));
    
    const galleryWithSelection = {
      selection: {
        multiSelected: new Set([0, 1]),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
        selectAll: vi.fn(),
        select: vi.fn(),
        selectedImage: null,
        selectPrev: vi.fn(),
        selectNext: vi.fn(),
        selectDown: vi.fn(),
        selectUp: vi.fn(),
        selectPageUp: vi.fn(),
        selectPageDown: vi.fn(),
        toggleEdit: vi.fn(),
        edit: vi.fn(),
        setColumns: vi.fn(),
        toggleMultiSelect: vi.fn(),
        toggleFolderMultiSelect: vi.fn(),
        selectAllFolders: vi.fn(),
        mode: "view" as const,
        setMode: vi.fn(),
        selected: null,
        editedImage: null
      }
    };

    const { getByTitle, getByTestId, getByText } = render(() => (
      <TestWrapper gallery={galleryWithSelection}>
        <MultiSelectActions />
      </TestWrapper>
    ));

    const deleteButton = getByTitle("Delete Selected");
    await fireEvent.click(deleteButton);

    const dialog = getByTestId("delete-confirm-dialog");
    const confirmButton = getByText("Delete");
    await fireEvent.click(confirmButton);

    const progressBar = getByTestId("delete-progress-bar");
    expect(progressBar).toBeInTheDocument();
  });
}); 