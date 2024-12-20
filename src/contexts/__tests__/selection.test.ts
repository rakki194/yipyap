import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "solid-js";
import { useSelection } from "../selection";
import type { BrowsePagesCached, DirectoryItem, ImageItem } from "~/resources/browse";
import type { Resource } from "solid-js";

/**
 * Test suite for the Selection Manager (useSelection hook)
 * 
 * This suite tests the functionality of the selection management system used in the gallery view.
 * The selection manager handles both single and multi-selection of images and directories,
 * as well as grid navigation and edit mode functionality.
 * 
 * Key areas tested:
 * - Single item selection and validation
 * - Grid-based navigation (up/down/page movement)
 * - Multi-selection operations (toggle, select all, clear)
 * - Edit mode transitions and restrictions
 * - Boundary conditions and edge cases
 * 
 * Test setup:
 * - Uses mock data consisting of 3 images and 3 directories (including parent "..")
 * - Mocks scroll functionality for page navigation tests
 * - Simulates a 2-column grid layout for navigation tests
 * 
 * @vitest-environment jsdom
 */
describe("Selection Manager", () => {
  // Mock data setup
  const createMockItems = () => {
    const items = [
      Object.assign(
        () => ({
          type: "directory" as const,
          name: "..",
          mtime: new Date().toISOString(),
        }),
        {
          type: "directory" as const,
          file_name: "..",
        }
      ),
      Object.assign(
        () => ({
          type: "directory" as const,
          name: "folder1",
          mtime: new Date().toISOString(),
        }),
        {
          type: "directory" as const,
          file_name: "folder1",
        }
      ),
      Object.assign(
        () => ({
          type: "image" as const,
          name: "image1",
          size: 1024,
          mime: "image/jpeg",
          width: 100,
          height: 100,
          mtime: new Date().toISOString(),
          md5sum: "abc123",
          captions: [],
        }),
        {
          type: "image" as const,
          file_name: "image1",
        }
      ),
      Object.assign(
        () => ({
          type: "directory" as const,
          name: "folder2",
          mtime: new Date().toISOString(),
        }),
        {
          type: "directory" as const,
          file_name: "folder2",
        }
      ),
      Object.assign(
        () => ({
          type: "image" as const,
          name: "image2",
          size: 1024,
          mime: "image/jpeg",
          width: 100,
          height: 100,
          mtime: new Date().toISOString(),
          md5sum: "def456",
          captions: [],
        }),
        {
          type: "image" as const,
          file_name: "image2",
        }
      ),
      Object.assign(
        () => ({
          type: "image" as const,
          name: "image3",
          size: 1024,
          mime: "image/jpeg",
          width: 100,
          height: 100,
          mtime: new Date().toISOString(),
          md5sum: "ghi789",
          captions: [],
        }),
        {
          type: "image" as const,
          file_name: "image3",
        }
      ),
    ] as (DirectoryItem | ImageItem)[];
    return items;
  };

  const mockBrowseData: BrowsePagesCached = {
    items: createMockItems(),
    pages: { 1: new Map<string, DirectoryItem | ImageItem>() },
    path: "/test",
    mtime: new Date().toISOString(),
    total_pages: 1,
    total_folders: 2,
    total_images: 3,
    setters: {}
  };

  const mockResource = (() => mockBrowseData) as Resource<BrowsePagesCached>;
  mockResource.loading = false;
  mockResource.error = undefined;
  mockResource.latest = mockBrowseData;
  mockResource.state = "ready";

  // Mock scroll functionality
  const mockScrollIntoView = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    document.querySelector = vi.fn().mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    });
  });

  it("initializes with default state", () => {
    createRoot((dispose) => {
      const selection = useSelection(mockResource);
      
      expect(selection.selected).toBe(null);
      expect(selection.mode).toBe("view");
      expect(selection.multiSelected.size).toBe(0);
      expect(selection.multiFolderSelected.size).toBe(0);
      
      dispose();
    });
  });

  describe("Single Selection", () => {
    it("selects an image by index", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        const success = selection.select(2); // Select first image
        
        expect(success).toBe(true);
        expect(selection.selected).toBe(2);
        expect(selection.selectedImage).not.toBe(null);
        
        dispose();
      });
    });

    it("handles invalid selection indices", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        const success = selection.select(999); // Invalid index
        
        expect(success).toBe(true);
        expect(selection.selected).toBe(mockBrowseData.items.length - 1); // Should select last item
        
        dispose();
      });
    });

    it("maintains view mode when selecting directories", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.setMode("edit");
        selection.select(1); // Select a directory
        
        expect(selection.mode).toBe("view");
        expect(selection.selected).toBe(1);
        
        dispose();
      });
    });
  });

  describe("Grid Navigation", () => {
    it("navigates grid using up/down", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        selection.setColumns(2);
        selection.select(2); // Start at first image
        
        const downSuccess = selection.selectDown();
        expect(downSuccess).toBe(true);
        expect(selection.selected).toBe(4); // Should move down 2 columns
        
        const upSuccess = selection.selectUp();
        expect(upSuccess).toBe(true);
        expect(selection.selected).toBe(2); // Should move back up
        
        dispose();
      });
    });

    it("handles grid boundaries", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        selection.setColumns(2);
        
        // Try moving up from null selection
        const upSuccess = selection.selectUp();
        expect(upSuccess).toBe(true);
        expect(selection.selected).toBe(mockBrowseData.items.length - 1); // Should select last item
        
        // Try moving down from last item
        selection.select(mockBrowseData.items.length - 1);
        const downSuccess = selection.selectDown();
        expect(downSuccess).toBe(false); // Should fail as we're at the bottom
        
        dispose();
      });
    });
  });

  describe("Multi-Selection", () => {
    it("toggles multi-selection for images", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.toggleMultiSelect(2); // Toggle first image
        expect(selection.multiSelected.has(2)).toBe(true);
        
        selection.toggleMultiSelect(2); // Toggle again to remove
        expect(selection.multiSelected.has(2)).toBe(false);
        
        dispose();
      });
    });

    it("handles select all functionality", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.selectAll();
        
        // Should select all images but not directories
        expect(selection.multiSelected.size).toBe(3); // 3 images
        expect(selection.multiFolderSelected.size).toBe(2); // 2 folders (excluding ..)
        
        dispose();
      });
    });

    it("clears multi-selection", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.selectAll();
        selection.clearMultiSelect();
        
        expect(selection.multiSelected.size).toBe(0);
        expect(selection.multiFolderSelected.size).toBe(0);
        
        dispose();
      });
    });
  });

  describe("Edit Mode", () => {
    it("toggles edit mode for images", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.select(2); // Select an image
        const success = selection.toggleEdit();
        
        expect(success).toBe(true);
        expect(selection.mode).toBe("edit");
        expect(selection.editedImage).not.toBe(null);
        
        dispose();
      });
    });

    it("prevents edit mode for directories", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        
        selection.select(1); // Select a directory
        const success = selection.setMode("edit");
        
        expect(success).toBe(false);
        expect(selection.mode).toBe("view");
        expect(selection.editedImage).toBe(null);
        
        dispose();
      });
    });
  });

  describe("Page Navigation", () => {
    beforeEach(() => {
      vi.stubGlobal('innerHeight', 500);
    });

    it("navigates pages up and down", () => {
      createRoot((dispose) => {
        const selection = useSelection(mockResource);
        selection.setColumns(2);
        selection.select(2);

        const downSuccess = selection.selectPageDown();
        expect(downSuccess).toBe(true);
        expect(mockScrollIntoView).toHaveBeenCalled();

        const upSuccess = selection.selectPageUp();
        expect(upSuccess).toBe(true);
        expect(mockScrollIntoView).toHaveBeenCalled();

        dispose();
      });
    });
  });
}); 