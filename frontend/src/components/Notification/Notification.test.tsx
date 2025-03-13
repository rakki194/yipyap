import { render, fireEvent, cleanup } from "@solidjs/testing-library";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { Notification } from "./Notification";
import { createSignal } from "solid-js";
import getIcon from "~/icons";

// Mock the icon component
vi.mock("~/icons", () => ({
  default: () => null
}));

describe("Notification Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("renders with basic props", () => {
    const { getByText } = render(() => (
      <Notification message="Test message" type="info" />
    ));
    expect(getByText("Test message")).toBeDefined();
  });

  test("applies correct type class", () => {
    const { container } = render(() => (
      <Notification message="Test message" type="error" />
    ));
    expect(container.querySelector(".notification.error")).toBeDefined();
  });

  test("shows close button on hover", async () => {
    const { container } = render(() => (
      <Notification message="Test message" type="info" />
    ));
    const notification = container.querySelector(".notification")!;
    const closeButton = container.querySelector(".close-button");

    // Initially close button should not exist
    expect(closeButton).toBeNull();

    // Hover should show close button
    await fireEvent.mouseEnter(notification);
    expect(container.querySelector(".close-button")).toBeDefined();
  });

  test("always shows close button for error type", () => {
    const { container } = render(() => (
      <Notification message="Error message" type="error" />
    ));
    expect(container.querySelector(".close-button")).toBeDefined();
  });

  test("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(() => (
      <Notification message="Error message" type="error" onClose={onClose} />
    ));

    const closeButton = container.querySelector(".close-button")!;
    await fireEvent.click(closeButton);

    // Wait for animation timeout
    vi.advanceTimersByTime(300);
    expect(onClose).toHaveBeenCalled();
  });

  test("auto-dismisses non-error notifications after 3 seconds", () => {
    const onClose = vi.fn();
    render(() => (
      <Notification message="Test message" type="info" onClose={onClose} />
    ));

    // Wait for auto-dismiss timeout plus animation duration
    vi.advanceTimersByTime(3300);
    expect(onClose).toHaveBeenCalled();
  });

  test("does not auto-dismiss error notifications", () => {
    const onClose = vi.fn();
    render(() => (
      <Notification message="Error message" type="error" onClose={onClose} />
    ));

    vi.advanceTimersByTime(3300);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("does not auto-dismiss notifications with spinner icon", () => {
    const onClose = vi.fn();
    render(() => (
      <Notification message="Loading..." type="info" icon="spinner" onClose={onClose} />
    ));

    vi.advanceTimersByTime(3300);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("resets timer when message changes", () => {
    const onClose = vi.fn();
    const [message, setMessage] = createSignal("Initial message");
    render(() => (
      <Notification message={message()} type="info" onClose={onClose} />
    ));

    vi.advanceTimersByTime(2000); // Wait 2 seconds

    setMessage("Updated message");

    vi.advanceTimersByTime(2000); // Wait another 2 seconds
    expect(onClose).not.toHaveBeenCalled(); // Should not have called onClose yet

    vi.advanceTimersByTime(1300); // Wait final 1 second plus animation
    expect(onClose).toHaveBeenCalled(); // Now it should be called
  });

  test("displays custom icon when provided", () => {
    const { container } = render(() => (
      <Notification message="Test message" type="info" icon="spinner" />
    ));
    expect(container.querySelector(".spin-icon")).toBeDefined();
  });

  test("pauses auto-dismiss timer on hover", async () => {
    const onClose = vi.fn();
    const { container } = render(() => (
      <Notification message="Test message" type="info" onClose={onClose} />
    ));

    const notification = container.querySelector(".notification")!;

    // Hover immediately after render
    await fireEvent.mouseEnter(notification);

    // Advance timer past the normal dismiss time while hovered
    vi.advanceTimersByTime(3000);

    // Should not have been dismissed while hovered
    expect(onClose).not.toHaveBeenCalled();

    // Mouse leave and wait for the new timer
    await fireEvent.mouseLeave(notification);

    // Should be dismissed after the full timeout
    vi.advanceTimersByTime(3000);

    // Wait for animation
    vi.advanceTimersByTime(300);
    expect(onClose).toHaveBeenCalled();
  });
});
