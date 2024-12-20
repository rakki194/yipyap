import { render, cleanup } from "@solidjs/testing-library";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { AppProvider, useAppContext } from "../app";
import { createRoot } from "solid-js";
import { Router } from "@solidjs/router";

// Mock router hooks
vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual("@solidjs/router");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/test", search: "", hash: "", state: null, query: {} }),
    useNavigate: () => vi.fn()
  };
});

// Mock translations
vi.mock("~/i18n", () => ({
  getTranslationValue: (translations: any, key: string) => `translated:${key}`,
  translations: {
    en: () => Promise.resolve({})
  }
}));

describe("App Context Notifications", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset window.__notificationContainer before each test
    if (typeof window !== "undefined") {
      (window as any).__notificationContainer = {
        addNotification: vi.fn(),
        removeNotification: vi.fn(),
      };
    }
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("notify method creates and adds notification", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.notify("Test message", "info");
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:Test message",
          type: "info",
          icon: "info"
        })
      );

      dispose();
    });
  });

  test("notify method handles all notification types", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.notify("Info message", "info");
        app.notify("Success message", "success");
        app.notify("Warning message", "warning");
        app.notify("Error message", "error");
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      const addNotification = (window as any).__notificationContainer.addNotification;
      expect(addNotification).toHaveBeenCalledTimes(4);
      expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({
        message: "translated:Info message",
        type: "info",
        icon: "info"
      }));
      expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({
        message: "translated:Success message",
        type: "success",
        icon: "success"
      }));
      expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({
        message: "translated:Warning message",
        type: "warning",
        icon: "warning"
      }));
      expect(addNotification).toHaveBeenCalledWith(expect.objectContaining({
        message: "translated:Error message",
        type: "error",
        icon: "error"
      }));

      dispose();
    });
  });

  test("notify method handles groups and icons", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.notify("Loading...", "info", "progress", "spinner");
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:Loading...",
          type: "info",
          group: "progress",
          icon: "spinner"
        })
      );

      dispose();
    });
  });

  test("createNotification method creates notification object", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.createNotification({
          message: "Test message",
          type: "info",
          group: "test",
          icon: "info"
        });
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Test message",
          type: "info",
          group: "test",
          icon: "info"
        })
      );

      dispose();
    });
  });

  test("notify method uses translation key", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.notify("test.key", "info");
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:test.key",
          type: "info",
          icon: "info"
        })
      );

      dispose();
    });
  });

  test("notify method defaults to info type", () => {
    createRoot((dispose) => {
      const TestComponent = () => {
        const app = useAppContext();
        app.notify("Test message");
        return null;
      };

      render(() => (
        <Router>
          <AppProvider>
            <TestComponent />
          </AppProvider>
        </Router>
      ));

      expect((window as any).__notificationContainer.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "translated:Test message",
          type: "info",
          icon: "info"
        })
      );

      dispose();
    });
  });
});
