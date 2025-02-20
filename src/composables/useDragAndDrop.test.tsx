import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "solid-js";
import { useDragAndDrop } from "./useDragAndDrop";
import { GalleryContext, AppContext } from "~/contexts/contexts";
import type { GalleryContextType } from "~/contexts/gallery";
import type { AppContext as AppContextType } from "~/contexts/app";

// Mock useFileUpload hook
vi.mock("./useFileUpload", () => ({
  useFileUpload: () => ({
    uploadFiles: vi.fn(),
  }),
}));

// Mock DataTransfer implementation
class MockDataTransfer implements DataTransfer {
  private data: { [key: string]: string } = {};
  public items: DataTransferItemList;
  public files: FileList;
  public types: string[] = [];
  public dropEffect: "none" | "copy" | "link" | "move" = "none";
  public effectAllowed: "none" | "copy" | "link" | "move" | "copyLink" | "copyMove" | "linkMove" | "all" | "uninitialized" = "none";

  constructor() {
    const items: Partial<DataTransferItemList> = {
      add: (data: string | File) => {
        if (data instanceof File) {
          this.types.push("Files");
          const fileList = {
            0: data,
            length: 1,
            item: (index: number) => fileList[0],
            [Symbol.iterator]: function* () {
              yield this[0];
            },
          };
          this.files = fileList as unknown as FileList;
        }
        return null;
      },
      clear: () => { },
      length: 0,
    };
    this.items = items as DataTransferItemList;
    const emptyFileList = {
      length: 0,
      item: () => null,
      [Symbol.iterator]: function* () { },
    };
    this.files = emptyFileList as unknown as FileList;
  }

  setData(format: string, data: string): void {
    this.data[format] = data;
    this.types.push(format);
  }

  getData(format: string): string {
    return this.data[format] || "";
  }

  clearData(format?: string): void {
    if (format) {
      delete this.data[format];
      this.types = this.types.filter(t => t !== format);
    } else {
      this.data = {};
      this.types = [];
    }
  }

  setDragImage(image: Element, x: number, y: number): void {
    // Mock implementation - no-op
  }
}

// Helper function to create drag events since jsdom's DragEvent constructor is not fully implemented
function createDragEvent(type: string, data?: { dataTransfer?: DataTransfer }) {
  const event = new Event(type, { bubbles: true });
  const dragEvent = event as unknown as DragEvent;

  // Create getters/setters for event properties
  Object.defineProperties(dragEvent, {
    dataTransfer: {
      value: data?.dataTransfer || new MockDataTransfer(),
      writable: true,
    },
    preventDefault: {
      value: vi.fn(),
      writable: true,
    },
    stopPropagation: {
      value: vi.fn(),
      writable: true,
    },
    target: {
      value: document.createElement('div'),
      writable: true,
    },
    currentTarget: {
      value: document.createElement('div'),
      writable: true,
    },
  });

  return dragEvent;
}

describe("useDragAndDrop", () => {
  let mockGalleryContext: GalleryContextType;
  let mockAppContext: AppContextType;
  let dragAndDrop: ReturnType<typeof useDragAndDrop>;
  let onDragStateChange: (isDragging: boolean) => void;
  let dispose: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
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
        multiSelected: {
          size: 0,
          has: vi.fn(),
          add: vi.fn(),
          delete: vi.fn(),
          clear: vi.fn(),
        },
        multiFolderSelected: {
          size: 0,
          has: vi.fn(),
          add: vi.fn(),
          delete: vi.fn(),
          clear: vi.fn(),
        },
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
    createRoot((_dispose) => {
      dispose = _dispose;
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
    });
  });

  afterEach(() => {
    dispose();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe("Drag State Management", () => {
    it("should handle dragenter events", async () => {
      const dataTransfer = new MockDataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));
      const dragEvent = createDragEvent("dragenter", { dataTransfer });

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      document.dispatchEvent(dragEvent);
      expect(onDragStateChange).toHaveBeenCalledWith(true);
    });

    it("should handle dragleave events", async () => {
      const dataTransfer = new MockDataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      // Simulate enter then leave
      document.dispatchEvent(createDragEvent("dragenter", { dataTransfer }));
      document.dispatchEvent(createDragEvent("dragleave", { dataTransfer }));
      expect(onDragStateChange).toHaveBeenLastCalledWith(false);
    });

    it("should handle dragover events", async () => {
      const dataTransfer = new MockDataTransfer();
      dataTransfer.items.add(new File([""], "test.jpg", { type: "image/jpeg" }));
      const dragEvent = createDragEvent("dragover", { dataTransfer });

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      document.dispatchEvent(dragEvent);
      expect(dragEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe("Drop Handling", () => {
    it("should handle external file drops", async () => {
      const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
      const dataTransfer = new MockDataTransfer();
      dataTransfer.items.add(file);
      const dropEvent = createDragEvent("drop", { dataTransfer });

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      document.dispatchEvent(dropEvent);
      vi.advanceTimersByTime(0);
      expect(onDragStateChange).toHaveBeenCalledWith(false);
    });

    it("should handle gallery item drops", async () => {
      const itemData = {
        type: "image" as const,
        name: "test.jpg",
        path: "test/path",
        idx: 0,
      };

      // Create target directory element
      const targetDir = document.createElement("div");
      targetDir.className = "item directory";
      targetDir.setAttribute("data-path", "test/target");
      targetDir.setAttribute("data-name", "target-folder");
      document.body.appendChild(targetDir);

      const dataTransfer = new MockDataTransfer();
      const dropEvent = createDragEvent("drop", { dataTransfer });
      dropEvent.dataTransfer!.setData("application/x-yipyap-item", JSON.stringify(itemData));

      // Set target element
      Object.defineProperty(dropEvent, 'target', { value: targetDir });
      Object.defineProperty(dropEvent, 'currentTarget', { value: targetDir });

      // Create a deferred Promise for the response
      let resolveJsonFn!: (value: any) => void;
      const jsonPromise = new Promise(resolve => {
        resolveJsonFn = resolve;
      });

      // Mock fetch to return our controlled Promise
      const mockResponse = {
        ok: true,
        json: () => jsonPromise
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      // Dispatch event
      document.dispatchEvent(dropEvent);

      // Wait for fetch to be called
      await vi.runAllTimersAsync();
      await Promise.resolve();

      // Resolve the json Promise
      resolveJsonFn({ moved: ["test.jpg"], failed: [] });

      // Wait for the Promise chain to complete
      await vi.runAllTimersAsync();
      await Promise.resolve();
      await vi.runAllTimersAsync(); // Run timers one more time for cleanup operations

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/move/test/path?target=${encodeURIComponent("test/target/target-folder")}`,
        expect.any(Object)
      );
      expect(mockGalleryContext.refetchGallery).toHaveBeenCalled();
      expect(mockGalleryContext.selection.multiSelected.clear).toHaveBeenCalled();
      expect(mockGalleryContext.selection.multiFolderSelected.clear).toHaveBeenCalled();

      // Clean up
      document.body.removeChild(targetDir);
    });

    it("should handle failed moves", async () => {
      const itemData = {
        type: "image" as const,
        name: "test.jpg",
        path: "test/path",
        idx: 0,
      };

      // Create target directory element
      const targetDir = document.createElement("div");
      targetDir.className = "item directory";
      targetDir.setAttribute("data-path", "test/target");
      targetDir.setAttribute("data-name", "target-folder");
      document.body.appendChild(targetDir);

      const dataTransfer = new MockDataTransfer();
      const dropEvent = createDragEvent("drop", { dataTransfer });
      dropEvent.dataTransfer!.setData("application/x-yipyap-item", JSON.stringify(itemData));

      // Set target element
      Object.defineProperty(dropEvent, 'target', { value: targetDir });
      Object.defineProperty(dropEvent, 'currentTarget', { value: targetDir });

      // Create a deferred Promise for the response
      let resolveJsonFn!: (value: any) => void;
      const jsonPromise = new Promise(resolve => {
        resolveJsonFn = resolve;
      });

      // Mock fetch to return our controlled Promise
      const mockResponse = {
        ok: true,
        json: () => jsonPromise
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      // Dispatch event
      document.dispatchEvent(dropEvent);

      // Wait for fetch to be called
      await vi.runAllTimersAsync();
      await Promise.resolve();

      // Resolve the json Promise with failed move data
      resolveJsonFn({
        moved: [],
        failed: ["test.jpg"],
        failed_reasons: { "test.jpg": "target_exists" }
      });

      // Wait for the Promise chain to complete
      await vi.runAllTimersAsync();
      await Promise.resolve();
      await vi.runAllTimersAsync(); // Run timers one more time for cleanup operations

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/move/test/path?target=${encodeURIComponent("test/target/target-folder")}`,
        expect.any(Object)
      );
      expect(mockAppContext.notify).toHaveBeenCalledWith(
        "gallery.moveFailedExists",
        "error"
      );

      // Clean up
      document.body.removeChild(targetDir);
    });
  });

  describe("Drag Start Handling", () => {
    it("should handle single item drag start", async () => {
      const dragItem = document.createElement("div");
      dragItem.className = "item";
      dragItem.setAttribute("data-idx", "0");
      dragItem.setAttribute("data-name", "test.jpg");
      document.body.appendChild(dragItem);

      const dataTransfer = new MockDataTransfer();
      const dragEvent = createDragEvent("dragstart", { dataTransfer });
      Object.defineProperty(dragEvent, 'target', { value: dragItem });
      Object.defineProperty(dragEvent, 'currentTarget', { value: dragItem });

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      dragItem.dispatchEvent(dragEvent);
      expect(dragItem.classList.contains("being-dragged")).toBe(true);
      document.body.removeChild(dragItem);
    });

    it("should handle multi-selected items drag start", async () => {
      // Setup multi-selection
      const hasMock = mockGalleryContext.selection.multiSelected.has as ReturnType<typeof vi.fn>;
      hasMock.mockReturnValue(true);
      Object.defineProperty(mockGalleryContext.selection.multiSelected, 'size', { value: 2 });

      const dragItem = document.createElement("div");
      dragItem.className = "item";
      dragItem.setAttribute("data-idx", "0");
      dragItem.setAttribute("data-name", "test.jpg");
      document.body.appendChild(dragItem);

      const dataTransfer = new MockDataTransfer();
      const dragEvent = createDragEvent("dragstart", { dataTransfer });
      Object.defineProperty(dragEvent, 'target', { value: dragItem });
      Object.defineProperty(dragEvent, 'currentTarget', { value: dragItem });

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      dragItem.dispatchEvent(dragEvent);
      expect(dragEvent.dataTransfer!.types).toContain("application/x-yipyap-items");
      document.body.removeChild(dragItem);
    });
  });

  describe("Drag End Handling", () => {
    it("should clean up drag-related classes", async () => {
      const dragItem = document.createElement("div");
      dragItem.className = "item being-dragged";
      document.body.appendChild(dragItem);

      const dragEvent = createDragEvent("dragend");

      // Wait for event handlers to be registered
      vi.advanceTimersByTime(0);

      document.dispatchEvent(dragEvent);
      expect(dragItem.classList.contains("being-dragged")).toBe(false);
      document.body.removeChild(dragItem);
    });
  });
}); 