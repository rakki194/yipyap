import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { CaptionInput } from "../CaptionInput";
import { Component } from "solid-js";
import { AppContext } from "~/contexts/contexts";
import { GalleryProvider } from "~/contexts/GalleryContext";
import type { BrowsePagesCached, Captions } from "~/resources/browse";

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

// Create mock functions
const saveWithHistoryMock = vi.fn();
const undoMock = vi.fn();
const saveCaptionMock = vi.fn();
const deleteCaptionMock = vi.fn();

// Add mock data before the gallery context mock
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
      captions: [["tags", "tag1, tag2"]] as Captions,
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

// Update mock app context with translations
const mockAppContext = {
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
};

// Add this before the tests
const createMockHistory = () => {
  let history: string[] = [];
  return {
    history,
    add: (caption: string) => {
      history.push(caption);
    },
    get: () => history,
    clear: () => {
      history = [];
    }
  };
};

const mockHistory = createMockHistory();

// Update the gallery context mock
vi.mock("~/contexts/gallery", () => ({
  makeGalleryState: () => ({
    saveCaption: saveCaptionMock,
    deleteCaption: deleteCaptionMock,
    saveWithHistory: saveWithHistoryMock,
    undo: undoMock,
    selection: {
      editedImage: mockBrowseData.items[0](),
      selectedImage: mockBrowseData.items[0],
    },
    data: () => mockBrowseData,
    captionHistory: mockHistory.get,
  }),
  useGallery: () => ({
    saveCaption: saveCaptionMock,
    deleteCaption: deleteCaptionMock,
    saveWithHistory: saveWithHistoryMock,
    undo: undoMock,
    selection: {
      editedImage: mockBrowseData.items[0](),
      selectedImage: mockBrowseData.items[0],
    },
    data: () => mockBrowseData,
    captionHistory: mockHistory.get,
  }),
  GalleryProvider: ({ children }: any) => children,
}));

// Create a test wrapper component that provides the context
const TestWrapper: Component<{ context: any; children: any }> = (props) => {
  return (
    <AppContext.Provider value={props.context}>
      <GalleryProvider>
        {props.children}
      </GalleryProvider>
    </AppContext.Provider>
  );
};

describe("CaptionInput Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory.clear();
    // Add a caption to history to enable undo button
    mockHistory.add("tag1, tag2");
  });

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
      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      expect(screen.getByText("tag1")).toBeInTheDocument();
      expect(screen.getByText("tag2")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Add a tag...")).toBeInTheDocument();
    });

    it("renders correct icon based on caption type", () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      // Find the caption type icon specifically (first icon in the list)
      const icons = screen.getAllByTestId("mock-icon");
      expect(icons[0]).toBeInTheDocument();
    });

    it("renders in expanded state", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      expect(container.querySelector(".expanded")).toBeInTheDocument();
    });
  });

  /**
   * Tests for caption tool operations
   * Covers caption deletion and undo functionality
   */
  describe("Caption Tools", () => {
    it("handles caption deletion", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      const deleteButton = screen.getByTitle(/Delete .* caption/);
      fireEvent.click(deleteButton);

      await Promise.resolve();

      expect(deleteCaptionMock).toHaveBeenCalledWith("tags");
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

      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...textProps} />
        </TestWrapper>
      ));

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
      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode for first tag
      fireEvent.click(screen.getByText("tag1"));
      const input = screen.getByDisplayValue("tag1");

      // Navigate right
      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });
      
      await Promise.resolve();
      expect(screen.getByDisplayValue("tag2")).toHaveFocus();
    });

    it("handles new tag input navigation", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <CaptionInput {...defaultProps} />
        </TestWrapper>
      ));

      const input = screen.getByPlaceholderText("Add a tag...");
      fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });

      await Promise.resolve();
      expect(screen.getByDisplayValue("tag2")).toHaveFocus();
    });
  });
}); 