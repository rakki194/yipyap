import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { Tooltip } from "~/components/Tooltip/Tooltip";

/**
 * Test suite for the Tooltip component.
 * 
 * These tests cover:
 * - Rendering and visibility
 * - Timing and animations
 * - Hover and focus interactions
 * - Accessibility features
 * - Cleanup behavior
 * 
 * Test Environment Setup:
 * - Uses fake timers for delay testing
 * - Mocks CSS transitions
 * - Ensures proper cleanup between tests
 */
describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // Helper function to wait for multiple microtask cycles and run timers
  const flushMicrotasks = async () => {
    await Promise.resolve(); // Initial microtask
    vi.advanceTimersByTime(1500); // Advance timer
    await Promise.resolve(); // Timer callback microtask
    await Promise.resolve(); // Effect microtask
    await Promise.resolve(); // Batch update microtask
  };

  // Helper function to wait for a single microtask cycle
  const flushSingleMicrotask = async () => {
    await Promise.resolve();
  };

  describe("Rendering", () => {
    it("should render children correctly", () => {
      const { getByText } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));
      
      expect(getByText("Hover me")).toBeInTheDocument();
    });

    it("should render tooltip content when visible", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      fireEvent.mouseEnter(trigger);
      
      await flushMicrotasks(); // This will run the timer and wait for updates
      
      const tooltip = getByTestId("tooltip");
      expect(tooltip).toHaveTextContent("Test tooltip");
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("Timing and Animations", () => {
    it("should show tooltip after 1.5s delay", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      fireEvent.mouseEnter(trigger);
      
      // Check immediately after hover
      const tooltip = getByTestId("tooltip");
      await Promise.resolve(); // Just wait one cycle for initial state
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
      
      // Run timers and check state
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
    });

    it("should hide tooltip immediately on mouse leave", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      const tooltip = getByTestId("tooltip");
      
      // Show tooltip
      fireEvent.mouseEnter(trigger);
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
      
      // Hide tooltip
      fireEvent.mouseLeave(trigger);
      await Promise.resolve(); // Just one cycle needed for hide
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });

    it("should cancel show timer on mouse leave", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      const tooltip = getByTestId("tooltip");
      
      // Start show timer
      fireEvent.mouseEnter(trigger);
      await Promise.resolve(); // Wait for initial state
      
      // Leave before show
      fireEvent.mouseLeave(trigger);
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Focus Interactions", () => {
    it("should show tooltip on focus", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Focus me</button>
        </Tooltip>
      ));

      const trigger = getByText("Focus me");
      const tooltip = getByTestId("tooltip");
      
      trigger.focus();
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
    });

    it("should hide tooltip on blur", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Focus me</button>
        </Tooltip>
      ));

      const trigger = getByText("Focus me");
      const tooltip = getByTestId("tooltip");
      
      // Show tooltip
      trigger.focus();
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
      
      // Hide tooltip
      trigger.blur();
      await Promise.resolve(); // Just one cycle needed for hide
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA attributes", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      fireEvent.mouseEnter(trigger);
      await flushMicrotasks();

      const tooltip = getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("role", "tooltip");
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
    });

    it("should be keyboard accessible", async () => {
      const { getByText, getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Focus me</button>
        </Tooltip>
      ));

      const trigger = getByText("Focus me");
      const tooltip = getByTestId("tooltip");
      
      // Tab to focus
      trigger.focus();
      await flushMicrotasks();
      expect(tooltip).toHaveAttribute("aria-hidden", "false");
      
      // Tab away
      trigger.blur();
      await Promise.resolve(); // Just one cycle needed for hide
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Cleanup", () => {
    it("should cleanup timers on unmount", () => {
      const { getByText, unmount } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const trigger = getByText("Hover me");
      fireEvent.mouseEnter(trigger);
      
      // Unmount before tooltip shows
      unmount();
      
      // Advance time - should not throw
      vi.advanceTimersByTime(2000);
    });

    it("should handle rapid mount/unmount", () => {
      const { unmount } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      // Rapid mount/unmount should not throw
      unmount();
      render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));
      unmount();
    });
  });

  describe("Style and Positioning", () => {
    it("should apply custom class", () => {
      const { getByText } = render(() => (
        <Tooltip content="Test tooltip" class="custom-tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const wrapper = getByText("Hover me").parentElement;
      expect(wrapper).toHaveClass("tooltip-wrapper", "custom-tooltip");
    });

    it("should maintain visibility:hidden when not shown", () => {
      const { getByTestId } = render(() => (
        <Tooltip content="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      ));

      const tooltip = getByTestId("tooltip");
      expect(tooltip).toHaveStyle({ visibility: "hidden" });
    });
  });
}); 