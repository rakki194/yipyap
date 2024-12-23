import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { makeImage } from "../../components/reactive-utils";
import { createRoot, JSX } from "solid-js";

describe("Reactive Utils - makeImage", () => {
  // Mock console methods
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.error = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
    vi.restoreAllMocks();
  });

  describe("Image Creation", () => {
    it("should create an image with basic properties", () => {
      createRoot((dispose) => {
        const { img, isLoaded } = makeImage("test.jpg", "Test Alt");
        
        expect(img).toBeInstanceOf(HTMLImageElement);
        expect(img.src).toContain("test.jpg");
        expect(img.alt).toBe("Test Alt");
        expect(img.fetchPriority).toBe("low");
        expect(isLoaded()).toBe(false);
        
        dispose();
      });
    });

    it("should apply custom styles", () => {
      createRoot((dispose) => {
        const styles: JSX.CSSProperties = {
          width: "100px",
          height: "100px",
          "object-fit": "cover",
        };
        
        const { img } = makeImage("test.jpg", "Test Alt", undefined, styles);
        
        expect(img.style.width).toBe("100px");
        expect(img.style.height).toBe("100px");
        expect(getComputedStyle(img).objectFit).toBe("cover");
        
        dispose();
      });
    });

    it("should apply custom classes", () => {
      createRoot((dispose) => {
        const classes = ["test-class", "another-class"];
        const { img } = makeImage("test.jpg", "Test Alt", classes);
        
        classes.forEach(className => {
          expect(img.classList.contains(className)).toBe(true);
        });
        
        dispose();
      });
    });

    it("should set custom priority", () => {
      createRoot((dispose) => {
        const { img } = makeImage("test.jpg", undefined, undefined, undefined, "high");
        expect(img.fetchPriority).toBe("high");
        dispose();
      });
    });
  });

  describe("Loading Behavior", () => {
    it("should handle already loaded images", () => {
      createRoot((dispose) => {
        const { img, isLoaded } = makeImage("test.jpg");
        
        // Simulate image being already loaded
        Object.defineProperty(img, 'complete', { value: true });
        // Trigger load event
        img.dispatchEvent(new Event('load'));
        
        expect(isLoaded()).toBe(true);
        expect(img.classList.contains("loaded")).toBe(true);
        
        dispose();
      });
    });

    it("should handle async loading", () => {
      createRoot((dispose) => {
        const { img, isLoaded } = makeImage("test.jpg");
        
        expect(isLoaded()).toBe(false);
        
        // Simulate successful load
        img.dispatchEvent(new Event('load'));
        
        expect(isLoaded()).toBe(true);
        expect(img.classList.contains("loaded")).toBe(true);
        
        dispose();
      });
    });

    it("should handle loading errors", () => {
      createRoot((dispose) => {
        const { img, isLoaded } = makeImage("invalid.jpg");
        
        // Simulate load error
        img.dispatchEvent(new Event('error'));
        
        expect(isLoaded()).toBe(false);
        expect(console.error).toHaveBeenCalled();
        
        dispose();
      });
    });
  });

  describe("Cleanup and Priority", () => {
    it("should unload image correctly", () => {
      createRoot((dispose) => {
        const { img, unload } = makeImage("test.jpg");
        
        unload();
        
        // Check for empty relative URL
        expect(img.getAttribute('src')).toBe("");
        expect(img.onload).toBeNull();
        expect(img.onerror).toBeNull();
        
        if (import.meta.env.DEV) {
          expect(console.debug).toHaveBeenCalled();
        }
        
        dispose();
      });
    });

    it("should update priority", () => {
      createRoot((dispose) => {
        const { img, setPriority } = makeImage("test.jpg");
        
        expect(img.fetchPriority).toBe("low");
        
        setPriority("high");
        expect(img.fetchPriority).toBe("high");
        
        setPriority("low");
        expect(img.fetchPriority).toBe("low");
        
        dispose();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing alt text", () => {
      createRoot((dispose) => {
        const { img } = makeImage("test.jpg");
        expect(img.alt).toBe("");
        dispose();
      });
    });

    it("should handle empty classes array", () => {
      createRoot((dispose) => {
        const { img } = makeImage("test.jpg", undefined, []);
        expect(img.classList.length).toBe(0);
        dispose();
      });
    });

    it("should handle empty style object", () => {
      createRoot((dispose) => {
        const { img } = makeImage("test.jpg", undefined, undefined, {});
        expect(img.style.length).toBe(0);
        dispose();
      });
    });
  });
}); 