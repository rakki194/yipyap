import { render, cleanup } from "@solidjs/testing-library";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "solid-js";
import { Router } from "@solidjs/router";
import { AppProvider } from "~/contexts/app";
import useConnectionStatus from "../useConnectionStatus";

describe("useConnectionStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock window.__notificationContainer
    if (typeof window !== "undefined") {
      (window as any).__notificationContainer = {
        addNotification: vi.fn(),
      };
    }
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("shows error notification when connection is lost", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      window.dispatchEvent(new Event('offline'));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:notifications.connectionLost",
          type: "error",
          group: "connection-status"
        })
      );

      dispose();
    });
  });

  test("shows success notification when connection is restored", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      // First go offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      window.dispatchEvent(new Event('offline'));

      // Clear the mock to only test the restoration notification
      vi.clearAllMocks();

      // Then restore connection
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
      window.dispatchEvent(new Event('online'));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:notifications.connectionRestored",
          type: "success",
          group: "connection-status"
        })
      );

      dispose();
    });
  });

  test("does not show restored notification on initial online state", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      // Should not have called addNotification for the initial online state
      expect((window as any).__notificationContainer.addNotification).not.toHaveBeenCalled();

      dispose();
    });
  });
}); 