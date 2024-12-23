import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { ImageView } from "../../components/ImageViewer/ImageView";
import { Component } from "solid-js";
import { AppContext } from "~/contexts/contexts";

// Mock the app context
const TestWrapper: Component<{ context: any; children: any }> = (props) => {
  return (
    <AppContext.Provider value={props.context}>
      {props.children}
    </AppContext.Provider>
  );
};

// Create mock image info
const createMockImageInfo = () => ({
  idx: 0,
  name: "test.jpg",
  file_name: "test.jpg",
  size: 1024,
  mtime: new Date().toISOString(),
  mime: "image/jpeg",
  width: 1920,
  height: 1080,
  aspect_ratio: "1.78",
  download_path: "/test.jpg",
  preview_path: "/preview/test.jpg",
  thumbnail_path: "/thumbnail/test.jpg",
  preview_img: {
    img: new Image(),
    isLoaded: () => true,
    unload: vi.fn(),
    setPriority: vi.fn(),
  },
  thumbnail_img: {
    img: new Image(),
    isLoaded: () => true,
    unload: vi.fn(),
    setPriority: vi.fn(),
  },
  type: "image" as const,
  captions: [],
});

describe("ImageView Component", () => {
  const mockAppContext = {
    enableZoom: true,
    enableMinimap: true,
    t: (key: string) => key,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders both preview and thumbnail images", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      expect(container.querySelector(".preview")).toBeInTheDocument();
      expect(container.querySelector(".thumbnail")).toBeInTheDocument();
    });

    it("shows loading state when preview is not loaded", () => {
      const mockInfo = createMockImageInfo();
      mockInfo.preview_img.isLoaded = () => false;

      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={mockInfo} />
        </TestWrapper>
      ));

      expect(container.querySelector(".thumbnail")).toHaveStyle({ opacity: "1" });
    });
  });

  describe("Zoom Functionality", () => {
    it("zooms in on wheel event", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      fireEvent.wheel(imageContainer, { deltaY: -100 });

      // Check if zoom indicator shows increased zoom level
      expect(container.querySelector(".zoom-indicator")?.textContent)
        .toMatch(/^[1-9][0-9]{2}%$/);
    });

    it("resets zoom on double click", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      
      // First zoom in
      fireEvent.wheel(imageContainer, { deltaY: -100 });
      // Then double click to reset
      fireEvent.dblClick(imageContainer);

      expect(container.querySelector(".zoom-indicator")?.textContent).toBe("100%");
    });

    it("disables zoom when enableZoom is false", () => {
      const { container } = render(() => (
        <TestWrapper context={{ ...mockAppContext, enableZoom: false }}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      fireEvent.wheel(imageContainer, { deltaY: -100 });

      // Zoom level should remain at 100%
      expect(container.querySelector(".zoom-indicator")?.textContent).toBe("100%");
    });
  });

  describe("Pan Functionality", () => {
    it("enables panning when zoomed in", async () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      
      // Zoom in first
      fireEvent.wheel(imageContainer, { deltaY: -100 });
      
      // Start panning
      fireEvent.mouseDown(imageContainer, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(imageContainer, { clientX: 50, clientY: 50 });

      expect(imageContainer).toHaveStyle({ cursor: "grabbing" });
    });

    it("updates cursor style during pan interactions", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      
      // Zoom in
      fireEvent.wheel(imageContainer, { deltaY: -100 });
      
      // Check initial cursor
      expect(imageContainer).toHaveStyle({ cursor: "grab" });
      
      // Start dragging
      fireEvent.mouseDown(imageContainer);
      expect(imageContainer).toHaveStyle({ cursor: "grabbing" });
      
      // End dragging
      fireEvent.mouseUp(imageContainer);
      expect(imageContainer).toHaveStyle({ cursor: "grab" });
    });
  });

  describe("Minimap Functionality", () => {
    it("shows minimap only when zoomed in", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      // Initially no minimap
      expect(container.querySelector(".minimap")).not.toBeInTheDocument();

      // Zoom in
      const imageContainer = container.querySelector(".image-container")!;
      fireEvent.wheel(imageContainer, { deltaY: -100 });

      // Minimap should appear
      expect(container.querySelector(".minimap")).toBeInTheDocument();
    });

    it("hides minimap when enableMinimap is false", () => {
      const { container } = render(() => (
        <TestWrapper context={{ ...mockAppContext, enableMinimap: false }}>
          <ImageView imageInfo={createMockImageInfo()} />
        </TestWrapper>
      ));

      const imageContainer = container.querySelector(".image-container")!;
      fireEvent.wheel(imageContainer, { deltaY: -100 });

      expect(container.querySelector(".minimap")).not.toBeInTheDocument();
    });
  });
}); 