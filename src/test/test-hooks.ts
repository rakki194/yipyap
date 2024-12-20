import { beforeEach, vi } from "vitest";
import { cleanup } from "@solidjs/testing-library";
import { mockFns, mockBrowseData } from "./test-utils";

export function useBasicTestSetup() {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    Object.values(mockFns).forEach(mock => mock.mockClear());
  });
}

export function useResourceTestSetup() {
  useBasicTestSetup();
  
  beforeEach(() => {
    // Setup any resource-specific mocks
    vi.mock("~/contexts/gallery", () => ({
      makeGalleryState: () => ({
        saveCaption: mockFns.saveCaption,
        deleteCaption: mockFns.deleteCaption,
        saveWithHistory: mockFns.saveWithHistory,
        undo: mockFns.undo,
        selection: {
          editedImage: mockBrowseData.items[0](),
          selectedImage: mockBrowseData.items[0],
        },
        data: () => mockBrowseData,
      }),
      useGallery: () => ({
        saveCaption: mockFns.saveCaption,
        deleteCaption: mockFns.deleteCaption,
        saveWithHistory: mockFns.saveWithHistory,
        undo: mockFns.undo,
        selection: {
          editedImage: mockBrowseData.items[0](),
          selectedImage: mockBrowseData.items[0],
        },
        data: () => mockBrowseData,
      }),
      GalleryProvider: ({ children }: any) => children,
    }));
  });
}

export function createMockHistory() {
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
} 