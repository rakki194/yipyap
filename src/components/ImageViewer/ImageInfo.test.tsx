/**
 * Test suite for the ImageInfo component.
 * 
 * This test file verifies the correct rendering and functionality of the ImageInfo component,
 * which displays metadata about an image in the gallery viewer.
 * 
 * Test Coverage:
 * - Rendering of image metadata (size, date, type, dimensions)
 * - Correct formatting of values (e.g., file size in MB)
 * - Presence of all required icons
 * - Integration with the translation system
 * 
 * Mocks:
 * - App Context: Mocked to provide simplified translations
 * - Icons: Mocked to return a simple SVG with test ID
 * - ImageInfo: Mocked with sample image data including:
 *   - Basic metadata (name, size, date)
 *   - Image properties (dimensions, aspect ratio)
 *   - File paths (download, preview, thumbnail)
 *   - Image objects with loading states
 * 
 * @jest-environment jsdom
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { ImageInfo } from "./ImageInfo";

// Mock the app context
vi.mock("~/contexts/app", () => ({
  useAppContext: () => ({
    t: (key: string) => {
      // Simple translation mock that returns the key
      const translations: Record<string, string> = {
        "common.size": "Size",
        "common.date": "Date",
        "common.type": "Type",
        "imageViewer.dimensions": "Dimensions",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the icons
vi.mock("~/icons", () => ({
  default: () => <svg data-testid="mock-icon" />,
}));

describe("ImageInfo Component", () => {
  const mockImageInfo = {
    idx: 0,
    name: "test",
    file_name: "test.jpg",
    size: 1024 * 1024, // 1MB
    mtime: new Date("2024-01-01").toISOString(),
    mime: "image/jpeg",
    width: 1920,
    height: 1080,
    aspect_ratio: (1920 / 1080).toString(),
    download_path: "/test.jpg",
    preview_path: "/preview/test.jpg",
    thumbnail_path: "/thumbnail/test.jpg",
    preview_img: {
      img: new Image(),
      isLoaded: () => true,
      unload: () => { },
      setPriority: () => { }
    },
    thumbnail_img: {
      img: new Image(),
      isLoaded: () => true,
      unload: () => { },
      setPriority: () => { }
    },
    type: "image" as const,
    captions: [],
  };

  it("renders image information correctly", () => {
    render(() => <ImageInfo imageInfo={mockImageInfo} />);

    // Check if size is displayed correctly (1 MB)
    expect(screen.getByText("1.0 MB")).toBeInTheDocument();

    // Check if date is displayed
    expect(
      screen.getByText(new Date(mockImageInfo.mtime).toLocaleString())
    ).toBeInTheDocument();

    // Check if mime type is displayed
    expect(screen.getByText(mockImageInfo.mime)).toBeInTheDocument();

    // Check if dimensions are displayed correctly
    expect(
      screen.getByText(`${mockImageInfo.width}×${mockImageInfo.height}`)
    ).toBeInTheDocument();

    // Check if all icons are rendered
    const icons = screen.getAllByTestId("mock-icon");
    expect(icons).toHaveLength(4); // We expect 4 icons in total
  });
});
