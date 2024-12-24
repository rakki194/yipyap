import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@solidjs/testing-library";
import { useBasicTestSetup } from "~/test/test-hooks";
import { UploadOverlay } from "~/components/UploadOverlay/UploadOverlay";
import { createSignal } from "solid-js";

describe("UploadOverlay", () => {
  useBasicTestSetup();

  beforeEach(() => {
    cleanup();
  });

  it("should not render when isVisible is false", () => {
    const { container } = render(() => <UploadOverlay isVisible={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("should render when isVisible is true", () => {
    const { getByTestId, getByText } = render(() => <UploadOverlay isVisible={true} />);
    expect(getByTestId("upload-overlay")).toBeInTheDocument();
    expect(getByTestId("upload-content")).toBeInTheDocument();
    expect(getByTestId("upload-icon")).toBeInTheDocument();
    expect(getByTestId("upload-text")).toBeInTheDocument();
    expect(getByText("Drop files here to upload")).toBeInTheDocument();
  });

  it("should have proper structure", () => {
    const { getByTestId } = render(() => <UploadOverlay isVisible={true} />);
    const overlay = getByTestId("upload-overlay");
    const content = getByTestId("upload-content");
    const icon = getByTestId("upload-icon");
    const text = getByTestId("upload-text");

    expect(overlay).toContainElement(content);
    expect(content).toContainElement(icon);
    expect(content).toContainElement(text);
    expect(icon).toContainElement(overlay.querySelector('svg'));
  });

  it("should be accessible", () => {
    const { getByTestId } = render(() => <UploadOverlay isVisible={true} />);
    const overlay = getByTestId("upload-overlay");
    const icon = overlay.querySelector('svg');
    
    expect(overlay).toHaveAttribute('role', 'dialog');
    expect(overlay).toHaveAttribute('aria-label', 'Drop files to upload');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  describe("visibility changes", () => {
    it("should handle visibility changes correctly", () => {
      const [isVisible, setIsVisible] = createSignal(false);
      const TestWrapper = () => <UploadOverlay isVisible={isVisible()} />;
      
      const { container, queryByTestId } = render(TestWrapper);
      expect(container.innerHTML).toBe("");
      expect(queryByTestId("upload-overlay")).not.toBeInTheDocument();
      
      setIsVisible(true);
      expect(queryByTestId("upload-overlay")).toBeInTheDocument();
      
      setIsVisible(false);
      expect(queryByTestId("upload-overlay")).not.toBeInTheDocument();
    });
  });
}); 