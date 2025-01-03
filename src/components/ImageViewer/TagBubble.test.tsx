import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { TagBubble } from "./TagBubble";
import { Component, createRoot } from "solid-js";
import { AppContext } from "~/contexts/contexts";

// Mock the icons
vi.mock("~/icons", () => ({
  default: () => "<svg data-testid='mock-icon' />",
}));

// Create a test wrapper component that provides the context
const TestWrapper: Component<{ context: any; children: any }> = (props) => {
  return (
    <AppContext.Provider value={props.context}>
      {props.children}
    </AppContext.Provider>
  );
};

// Mock app context
const mockAppContext = {
  theme: "light",
  t: (key: string) => key, // Simple translation mock
  // ... other required context properties
};

describe("TagBubble Component", () => {
  const defaultProps = {
    tag: "test-tag",
    index: 0,
    onRemove: vi.fn(),
    onEdit: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with basic props", () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      expect(screen.getByText("test-tag")).toBeInTheDocument();
      expect(screen.getByTitle("Remove tag")).toBeInTheDocument();
    });

    it("applies correct theme-based colors", () => {
      const { container } = render(() => (
        <TestWrapper context={{ ...mockAppContext, theme: "dark" }}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      const tagBubble = container.querySelector(".tag-bubble") as HTMLElement;
      expect(tagBubble).toHaveStyle({
        backgroundColor: expect.stringContaining("oklch"),
      });
    });
  });

  describe("Editing Behavior", () => {
    it("enters edit mode on click", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      const tagText = screen.getByText("test-tag");
      fireEvent.click(tagText);

      const input = screen.getByDisplayValue("test-tag");
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it("submits edited tag on Enter", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");

      // Edit and submit
      fireEvent.change(input, { target: { value: "new-tag" } });
      fireEvent.keyPress(input, { key: "Enter", code: "Enter" });

      expect(defaultProps.onEdit).toHaveBeenCalledWith("new-tag");
    });

    it("cancels editing on Escape", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");

      // Cancel edit
      fireEvent.keyPress(input, { key: "Escape", code: "Escape" });
      expect(screen.getByText("test-tag")).toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("handles arrow key navigation", () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");

      // Test left navigation
      fireEvent.keyDown(input, { key: "ArrowLeft", shiftKey: true });
      expect(defaultProps.onNavigate).toHaveBeenCalledWith("left");

      // Test right navigation
      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });
      expect(defaultProps.onNavigate).toHaveBeenCalledWith("right");
    });

    it("handles double-tap navigation", () => {
      vi.useFakeTimers();
      
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");

      // Double-tap left
      fireEvent.keyDown(input, { key: "ArrowLeft", shiftKey: true });
      fireEvent.keyDown(input, { key: "ArrowLeft", shiftKey: true });
      expect(defaultProps.onNavigate).toHaveBeenCalledWith("start");

      // Double-tap right
      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });
      fireEvent.keyDown(input, { key: "ArrowRight", shiftKey: true });
      expect(defaultProps.onNavigate).toHaveBeenCalledWith("end");

      vi.useRealTimers();
    });

    it("handles delete shortcut", () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");

      // Test delete
      fireEvent.keyDown(input, { key: "Delete", shiftKey: true });
      expect(defaultProps.onRemove).toHaveBeenCalled();
    });
  });

  describe("Theme-specific Styling", () => {
    const themes = ["dark", "light", "gray", "banana", "strawberry", "peanut"] as const;

    themes.forEach(theme => {
      it(`applies correct styles for ${theme} theme`, () => {
        const { container } = render(() => (
          <TestWrapper context={{ ...mockAppContext, theme }}>
            <TagBubble {...defaultProps} />
          </TestWrapper>
        ));

        const tagBubble = container.querySelector(".tag-bubble") as HTMLElement;
        expect(tagBubble).toHaveStyle({
          transition: "transform 0.2s ease",
        });
      });
    });
  });

  describe("Color Generation", () => {
    it("generates consistent colors for the same tag", () => {
      const { container } = render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      const tagBubble = container.querySelector(".tag-bubble") as HTMLElement;
      const firstColor = tagBubble?.style.backgroundColor;

      // Re-render with same props
      const { container: newContainer } = render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      const newTagBubble = newContainer.querySelector(".tag-bubble") as HTMLElement;
      const secondColor = newTagBubble?.style.backgroundColor;
      expect(firstColor).toBe(secondColor);
    });

    it("clears color cache when editing tag", async () => {
      render(() => (
        <TestWrapper context={mockAppContext}>
          <TagBubble {...defaultProps} />
        </TestWrapper>
      ));

      // Enter edit mode and change tag
      fireEvent.click(screen.getByText("test-tag"));
      const input = screen.getByDisplayValue("test-tag");
      fireEvent.change(input, { target: { value: "new-tag" } });
      fireEvent.keyPress(input, { key: "Enter", code: "Enter" });

      expect(defaultProps.onEdit).toHaveBeenCalledWith("new-tag");
    });
  });
}); 