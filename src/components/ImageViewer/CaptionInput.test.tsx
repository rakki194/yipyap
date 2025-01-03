import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, render } from "@solidjs/testing-library";
import { CaptionInput } from "./CaptionInput";
import { useBasicTestSetup } from "~/test/test-hooks";
import { renderWithContext, mockAppContext, createMockResource, mockBrowseData } from "~/test/test-utils";
import { GalleryContext } from "~/contexts/contexts";
import { TransformationsProvider } from "~/contexts/transformations";
import type { Component, JSX } from "solid-js";
import { action } from "@solidjs/router";

/**
 * Test suite for the CaptionInput component.
 * 
 * This component handles user input for image captions, supporting both tag-based
 * and text-based caption types. The tests cover:
 * - Component rendering in different states
 * - Tag management (adding, removing, editing)
 * - Caption tools (deletion, undo)
 * - Text caption mode
 * - Keyboard navigation
 * 
 * The suite uses mocked dependencies for:
 * - Icons and icon mapping
 * - Router actions
 * - Gallery context functions
 * - App context (translations)
 */

const mockAction = <T,>(fn: () => Promise<T>) => {
  const actionFn = action(fn);
  return vi.fn().mockImplementation(actionFn) as unknown as typeof actionFn;
};

const mockFns = {
  saveCaption: mockAction(async () => new Error("Mock error")),
  deleteCaption: mockAction(async () => new Error("Mock error")),
  saveWithHistory: mockAction(async () => new Error("Mock error")),
  undo: mockAction(async () => new Error("Mock error")),
};

// Mock the icons
vi.mock("~/icons", () => ({
  default: () => {
    const svg = document.createElement('svg');
    svg.setAttribute('data-testid', 'mock-icon');
    return svg;
  },
  captionIconsMap: {
    tags: "tag",
    wd: "tag",
    e621: "tag",
    caption: "text",
    txt: "text",
  },
}));

// Mock the router actions
vi.mock("@solidjs/router", () => ({
  useAction: (fn: Function) => fn,
  useSubmission: () => ({ pending: false }),
  action: (fn: Function) => fn,
}));

// Mock useAppContext
vi.mock("~/contexts/app", () => ({
  useAppContext: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "tools.undo": "Undo",
        "tools.removeCommas": "Remove commas",
        "tools.replaceNewlinesWithCommas": "Replace newlines with commas",
        "tools.replaceUnderscoresWithSpaces": "Replace underscores with spaces",
        "gallery.addTag": "Add a tag...",
        "gallery.addCaption": "Add caption",
        "Remove tag": "Remove tag",
        "Add tag": "Add tag",
        "Delete tags caption": "Delete tags caption",
        "Undo last change": "Undo last change",
      };
      return translations[key] || key;
    },
    theme: "light",
  }),
}));

// Create a mock GalleryProvider component
const GalleryProvider: Component<{ children: JSX.Element }> = (props) => {
  const galleryValue = {
    saveCaption: mockFns.saveCaption,
    deleteCaption: mockFns.deleteCaption,
    saveWithHistory: mockFns.saveWithHistory,
    undo: mockFns.undo,
    editedImage: null,
    selection: {
      editedImage: null,
      selectedImage: null,
      select: () => false,
      selectPrev: () => false,
      selectNext: () => false,
      selectDown: () => false,
      selectUp: () => false,
      selectPageUp: () => false,
      selectPageDown: () => false,
      toggleEdit: () => false,
      edit: () => false,
      mode: 'view' as const,
      multiSelected: new Set<number>(),
      multiFolderSelected: new Set<number>(),
      toggleMultiSelect: () => false,
      selectAll: () => false,
      clearMultiSelect: () => {},
      toggleFolderMultiSelect: () => false,
      selectAllFolders: () => false,
      clearFolderMultiSelect: () => {},
      setMode: () => true,
      selected: null,
      setColumns: () => {},
    },
    data: createMockResource(mockBrowseData),
    setViewMode: () => {},
    setSort: () => {},
    setSearch: () => {},
    setPage: async () => {},
    state: {
      viewMode: "grid" as const,
      sort: "name" as const,
      search: "",
      page: 1,
      path: "",
    },
    params: { path: "", id: "" },
    windowSize: { width: 0, height: 0 },
    getThumbnailSize: () => ({ width: 0, height: 0 }),
    getPreviewSize: () => ({ width: 0, height: 0 }),
    getImageInfo: () => null,
    getImagePath: () => "",
    getImageUrl: () => "",
    getImageThumbnailUrl: () => "",
    getImagePreviewUrl: () => "",
    getThumbnailComputedSize: () => ({ width: 0, height: 0 }),
    refetch: () => null,
    invalidate: () => {},
    clearImageCache: () => {},
    getAllKnownFolders: async () => [],
    generateTags: mockAction(async () => undefined),
    deleteImage: mockAction(async () => new Error("Mock error")),
    captionHistory: () => [],
    getEditedImage: () => undefined,
    refetchGallery: () => {},
    setData: () => undefined,
    invalidateFolderCache: () => {},
    select: () => false,
    selectedImage: null,
    selectPrev: () => false,
    selectNext: () => false,
    selectDown: () => false,
    selectUp: () => false,
    selectPageUp: () => false,
    selectPageDown: () => false,
    toggleEdit: () => false,
    edit: () => false,
    mode: 'view' as const,
    multiSelected: new Set<number>(),
    multiFolderSelected: new Set<number>(),
    toggleMultiSelect: () => false,
    selectAll: () => false,
    clearMultiSelect: () => {},
    toggleFolderMultiSelect: () => false,
    selectAllFolders: () => false,
    clearFolderMultiSelect: () => {},
    setMode: () => true,
    selected: null,
    setColumns: () => {},
  };

  return (
    <GalleryContext.Provider value={galleryValue}>
      <TransformationsProvider>
        {props.children}
      </TransformationsProvider>
    </GalleryContext.Provider>
  );
};

function renderWithGalleryContext(ui: () => JSX.Element, context = mockAppContext) {
  return render(() => (
    <GalleryProvider>
      {ui()}
    </GalleryProvider>
  ));
}

describe("CaptionInput Component", () => {
  useBasicTestSetup();

  const defaultProps = {
    caption: ["tags", "tag1, tag2"] as [string, string],
    onClick: vi.fn(),
    canUndo: true,
    state: "expanded" as const,
  };

  /**
   * Tests for basic rendering functionality
   * Verifies correct component rendering with different props and states
   */
  describe("Rendering", () => {
    it("renders with basic props", () => {
      renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      expect(screen.getByText("tag1")).toBeInTheDocument();
      expect(screen.getByText("tag2")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Add a tag...")).toBeInTheDocument();
    });

    it("renders correct icon based on caption type", () => {
      renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      // Find the caption type icon specifically (first icon in the list)
      const icons = screen.getAllByTestId("mock-icon");
      expect(icons[0]).toBeInTheDocument();
    });

    it("renders in expanded state", () => {
      const { container } = renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      expect(container.querySelector(".expanded")).toBeInTheDocument();
    });
  });

  /**
   * Tests for caption tool operations
   * Covers caption deletion and undo functionality
   */
  describe("Caption Tools", () => {
    it("handles caption deletion", async () => {
      renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      const deleteButton = screen.getByTitle(/Delete .* caption/);
      fireEvent.click(deleteButton);

      await Promise.resolve();

      expect(mockFns.deleteCaption).toHaveBeenCalledWith("tags");
    });
  });

  /**
   * Tests for text caption mode
   * Verifies functionality specific to text-based captions
   * including textarea rendering and edit operations
   */
  describe("Text Caption Mode", () => {
    it("renders textarea for text captions", () => {
      const textProps = {
        ...defaultProps,
        caption: ["txt", "Initial text"] as [string, string],
      };

      renderWithGalleryContext(() => <CaptionInput {...textProps} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue(textProps.caption[1]);
    });
  });

  /**
   * Tests for keyboard navigation features
   * Verifies proper keyboard interaction between tags
   * and navigation through the caption input interface
   */
  describe("Keyboard Navigation", () => {
    it("supports keyboard navigation between tags", async () => {
      renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      // Enter edit mode for first tag
      fireEvent.click(screen.getByText("tag1"));
      const input = screen.getByDisplayValue("tag1");

      // Navigate right
      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });
      
      await Promise.resolve();
      expect(screen.getByDisplayValue("tag2")).toHaveFocus();
    });

    it("handles new tag input navigation", async () => {
      renderWithGalleryContext(() => <CaptionInput {...defaultProps} />);

      const input = screen.getByPlaceholderText("Add a tag...");
      fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });

      await Promise.resolve();
      expect(screen.getByDisplayValue("tag2")).toHaveFocus();
    });
  });
}); 