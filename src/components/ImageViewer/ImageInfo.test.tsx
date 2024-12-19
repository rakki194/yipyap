import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { ImageInfo } from "./ImageInfo";
import { AppContext } from "~/contexts/app";

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
  default: () => '<svg data-testid="mock-icon" />',
}));

describe("ImageInfo Component", () => {
  const mockImageInfo = {
    file_name: "test.jpg",
    size: 1024 * 1024, // 1MB
    mtime: new Date("2024-01-01").getTime(),
    mime: "image/jpeg",
    width: 1920,
    height: 1080,
    download_path: "/test.jpg",
    preview_img: { img: { src: "", alt: "" }, isLoaded: () => true },
    thumbnail_img: { img: { src: "", alt: "" }, isLoaded: () => true },
  };

  it("renders image information correctly", () => {
    render(() => <ImageInfo imageInfo={mockImageInfo} />);

    // Check if size is displayed correctly (1 MB)
    expect(screen.getByText("1 MB")).toBeInTheDocument();

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
