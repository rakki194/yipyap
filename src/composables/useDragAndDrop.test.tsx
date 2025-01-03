import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "solid-js";
import { useDragAndDrop } from "./useDragAndDrop";
import { GalleryContext, AppContext } from "~/contexts/contexts";
import type { GalleryContextType } from "~/contexts/gallery";
import type { AppContext as AppContextType } from "~/contexts/app";

// Helper function to create drag events since jsdom's DragEvent constructor is not fully implemented
function createDragEvent(type: string, data?: { dataTransfer?: DataTransfer }) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, {
    dataTransfer: data?.dataTransfer || new DataTransfer()
  });
  return event as DragEvent;
}

describe("useDragAndDrop", () => {
  let mockGalleryContext: GalleryContextType;
  let mockAppContext: AppContextType;
  let dragAndDrop: ReturnType<typeof useDragAndDrop>;
  let onDragStateChange: (isDragging: boolean) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock onDragStateChange callback
    onDragStateChange = vi.fn();

    // Mock gallery context
    mockGalleryContext = {
      data: () => ({
        items: [
          {
            type: "image" as const,
            file_name: "test.jpg",
            size: 1024,
            mime: "image/jpeg",
            md5sum: "test-hash",
            width: 1920,
            height: 1080,
            mtime: new Date().toISOString(),
          },
          {
            type: "directory" as const,
            file_name: "test-folder",
            size: 0,
            mtime: new Date().toISOString(),
          }
        ],
        path: "test/path",
        total_folders: 1,
        total_images: 1,
        total_pages: 1,
        mtime: new Date().toISOString(),
        pages: {},
        setters: {},
      }),
      selection: {
        multiSelected: new Set<number>(),
        multiFolderSelected: new Set<number>(),
        clearMultiSelect: vi.fn(),
        clearFolderMultiSelect: vi.fn(),
      },
      refetchGallery: vi.fn(),
    } as unknown as GalleryContextType;

    // Mock app context
    mockAppContext = {
      preserveLatents: true,
      preserveTxt: true,
      notify: vi.fn(),
      t: (key: string, params?: Record<string, any>) => key,
    } as unknown as AppContextType;

    // Create root and initialize the composable
    createRoot((dispose) => {
      GalleryContext.Provider({
        value: mockGalleryContext,
        get children() {
          return AppContext.Provider({
            value: mockAppContext,
            get children() {
              dragAndDrop = useDragAndDrop({ onDragStateChange });
              return null;
            },
          });
        },
      });
      dispose();
    });
  });

  describe("Drag State Management", () => {
    it("should handle dragenter events", () => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));
      const dragEvent = createDragEvent("dragenter", { dataTransfer });

      document.dispatchEvent(dragEvent);
      expect(onDragStateChange).toHaveBeenCalledWith(true);
    });

    it("should handle dragleave events", () => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));

      // Simulate enter then leave
      document.dispatchEvent(createDragEvent("dragenter", { dataTransfer }));
      document.dispatchEvent(createDragEvent("dragleave", { dataTransfer }));
      expect(onDragStateChange).toHaveBeenLastCalledWith(false);
    });

    it("should handle dragover events", () => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));
      const dragEvent = createDragEvent("dragover", { dataTransfer });

      document.dispatchEvent(dragEvent);
      expect(dragEvent.defaultPrevented).toBe(true);
    });
  });

  describe("Drop Handling", () => {
    it("should handle external file drops", async () => {
      const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const dropEvent = createDragEvent("drop", { dataTransfer });

      await document.dispatchEvent(dropEvent);
      expect(onDragStateChange).toHaveBeenCalledWith(false);
    });

    it("should handle gallery item drops", async () => {
      const itemData = {
        type: "image" as const,
        name: "test.jpg",
        path: "test/path",
        idx: 0,
      };

      const dataTransfer = new DataTransfer();
      const dropEvent = createDragEvent("drop", { dataTransfer });
      dropEvent.dataTransfer!.setData("application/x-yipyap-item", JSON.stringify(itemData));

      // Mock fetch for move operation
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ moved: ["test.jpg"], failed: [] }),
      });

      await document.dispatchEvent(dropEvent);
      expect(mockGalleryContext.refetchGallery).toHaveBeenCalled();
      expect(mockGalleryContext.selection.clearMultiSelect).toHaveBeenCalled();
      expect(mockGalleryContext.selection.clearFolderMultiSelect).toHaveBeenCalled();
    });

    it("should handle failed moves", async () => {
      const itemData = {
        type: "image" as const,
        name: "test.jpg",
        path: "test/path",
        idx: 0,
      };

      const dataTransfer = new DataTransfer();
      const dropEvent = createDragEvent("drop", { dataTransfer });
      dropEvent.dataTransfer!.setData("application/x-yipyap-item", JSON.stringify(itemData));

      // Mock fetch for failed move operation
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          moved: [],
          failed: ["test.jpg"],
          failed_reasons: { "test.jpg": "target_exists" },
        }),
      });

      await document.dispatchEvent(dropEvent);
      expect(mockAppContext.notify).toHaveBeenCalledWith(
        "gallery.moveFailedExists",
        "error"
      );
    });
  });

  describe("Drag Start Handling", () => {
    it("should handle single item drag start", () => {
      const dragItem = document.createElement("div");
      dragItem.className = "item";
      dragItem.setAttribute("data-idx", "0");
      dragItem.setAttribute("data-name", "test.jpg");

      const dataTransfer = new DataTransfer();
      const dragEvent = createDragEvent("dragstart", { dataTransfer });

      dragItem.dispatchEvent(dragEvent);
      expect(dragItem.classList.contains("being-dragged")).toBe(true);
    });

    it("should handle multi-selected items drag start", () => {
      // Setup multi-selection
      mockGalleryContext.selection.multiSelected.add(0);
      mockGalleryContext.selection.multiSelected.add(1);

      const dragItem = document.createElement("div");
      dragItem.className = "item";
      dragItem.setAttribute("data-idx", "0");
      dragItem.setAttribute("data-name", "test.jpg");

      const dataTransfer = new DataTransfer();
      const dragEvent = createDragEvent("dragstart", { dataTransfer });

      dragItem.dispatchEvent(dragEvent);
      expect(dragEvent.dataTransfer!.types).toContain("application/x-yipyap-items");
    });
  });

  describe("Drag End Handling", () => {
    it("should clean up drag-related classes", () => {
      const dragItem = document.createElement("div");
      dragItem.className = "item being-dragged";
      document.body.appendChild(dragItem);

      const dragEvent = createDragEvent("dragend");
      document.dispatchEvent(dragEvent);

      expect(dragItem.classList.contains("being-dragged")).toBe(false);
      document.body.removeChild(dragItem);
    });
  });
}); 