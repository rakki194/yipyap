import { render, cleanup } from "@solidjs/testing-library";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "solid-js";
import { Router, useLocation } from "@solidjs/router";
import { AppProvider } from "~/contexts/app";
import useConnectionStatus from "../../composables/useConnectionStatus";

// Mock router hooks
vi.mock("@solidjs/router", () => ({
  Router: (props: any) => props.children,
  useLocation: () => ({
    pathname: "/test",
    search: "",
    hash: "",
    state: null,
    query: {}
  })
}));

// Mock translations
vi.mock("~/i18n", () => ({
  getTranslationValue: (translations: any, key: string) => `translated:${key}`,
  translations: {
    en: () => Promise.resolve({
      notifications: {
        connectionLost: "Connection lost",
        connectionRestored: "Connection restored"
      }
    })
  }
}));

describe("useConnectionStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock window.__notificationContainer
    if (typeof window !== "undefined") {
      (window as any).__notificationContainer = {
        addNotification: vi.fn(),
      };
    }
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { 
      configurable: true,
      value: true,
      writable: true 
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("shows error notification when connection is lost", async () => {
    await createRoot(async (dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <AppProvider>
          <TestComponent />
        </AppProvider>
      ));

      // Wait for initial effects
      await Promise.resolve();
      vi.runAllTimers();

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));

      // Wait for effects to run
      await Promise.resolve();
      vi.runAllTimers();

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:notifications.connectionLost",
          type: "error",
          group: "connection-status",
          icon: "error"
        })
      );

      dispose();
    });
  });

  test("shows success notification when connection is restored", async () => {
    await createRoot(async (dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <AppProvider>
          <TestComponent />
        </AppProvider>
      ));

      // Wait for initial effects
      await Promise.resolve();
      vi.runAllTimers();

      // First go offline
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));

      // Wait for effects
      await Promise.resolve();
      vi.runAllTimers();

      // Clear the mock to only test the restoration notification
      vi.clearAllMocks();

      // Then restore connection
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));

      // Wait for effects
      await Promise.resolve();
      vi.runAllTimers();

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:notifications.connectionRestored",
          type: "success",
          group: "connection-status",
          icon: "success"
        })
      );

      dispose();
    });
  });

  test("does not show restored notification on initial online state", async () => {
    await createRoot(async (dispose) => {
      const TestComponent = () => {
        useConnectionStatus();
        return null;
      };

      render(() => (
        <AppProvider>
          <TestComponent />
        </AppProvider>
      ));

      // Wait for initial effects
      await Promise.resolve();
      vi.runAllTimers();

      // Should not have called addNotification for the initial online state
      expect((window as any).__notificationContainer.addNotification).not.toHaveBeenCalled();

      dispose();
    });
  });
}); 