import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@solidjs/testing-library";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { Component } from "solid-js";
import { AppContext } from "~/contexts/contexts";
import type { Theme } from "~/contexts/theme";
import type { Locale } from "~/i18n";

// Mock the app context with translations
const mockAppContext: Parameters<typeof AppContext.Provider>[0]['value'] = {
  t: (key: string, params?: any) => {
    const translations: Record<string, string> = {
      'gallery.deleteConfirmation': 'Delete Confirmation',
      'gallery.confirmMultiDelete': `Delete ${params?.count} items (${params?.folders} folders, ${params?.images} images)?`,
      'common.cancel': 'Cancel',
      'common.delete': 'Delete'
    };
    return translations[key] || key;
  },
  prevRoute: undefined,
  location: {
    pathname: "/",
    search: "",
    hash: "",
    query: {},
    state: null,
    key: ""
  },
  theme: "light" as Theme,
  setTheme: vi.fn(),
  disableAnimations: false,
  setDisableAnimations: vi.fn(),
  disableNonsense: false,
  setDisableNonsense: vi.fn(),
  enableZoom: false,
  setEnableZoom: vi.fn(),
  enableMinimap: false,
  setEnableMinimap: vi.fn(),
  thumbnailSize: 200,
  setThumbnailSize: vi.fn(),
  instantDelete: false,
  setInstantDelete: vi.fn(),
  jtp2ModelPath: "",
  jtp2TagsPath: "",
  setJtp2ModelPath: vi.fn(),
  setJtp2TagsPath: vi.fn(),
  locale: "en" as Locale,
  setLocale: vi.fn(),
  preserveLatents: false,
  setPreserveLatents: vi.fn(),
  preserveTxt: false,
  setPreserveTxt: vi.fn(),
  notify: vi.fn(),
  createNotification: vi.fn(),
  alwaysShowCaptionEditor: false,
  setAlwaysShowCaptionEditor: vi.fn()
};

// Test wrapper component that provides the app context
const TestWrapper: Component<{ children: any }> = (props) => {
  return (
    <AppContext.Provider value={mockAppContext}>
      {props.children}
    </AppContext.Provider>
  );
};

describe("DeleteConfirmDialog", () => {
  const defaultProps = {
    imageCount: 2,
    folderCount: 1,
    onConfirm: vi.fn(),
    onCancel: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with correct title", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      expect(screen.getByText("Delete Confirmation")).toBeInTheDocument();
    });

    it("displays correct confirmation message with counts", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      expect(screen.getByText("Delete 3 items (1 folders, 2 images)?")).toBeInTheDocument();
    });

    it("renders cancel and delete buttons", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("applies correct classes to delete button", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      const deleteButton = screen.getByText("Delete");
      expect(deleteButton).toHaveClass("primary", "delete");
    });
  });

  describe("Interactions", () => {
    it("calls onCancel when clicking the cancel button", async () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      const cancelButton = screen.getByText("Cancel");
      await fireEvent.click(cancelButton);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when clicking the delete button", async () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      const deleteButton = screen.getByText("Delete");
      await fireEvent.click(deleteButton);
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when clicking the overlay", async () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      const overlay = screen.getByText("Delete Confirmation").parentElement!.parentElement!;
      await fireEvent.click(overlay);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("does not call onCancel when clicking the dialog content", async () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog {...defaultProps} />
        </TestWrapper>
      ));

      const dialog = screen.getByText("Delete Confirmation").parentElement!;
      await fireEvent.click(dialog);
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles zero counts correctly", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog
            {...defaultProps}
            imageCount={0}
            folderCount={0}
          />
        </TestWrapper>
      ));

      expect(screen.getByText("Delete 0 items (0 folders, 0 images)?")).toBeInTheDocument();
    });

    it("handles large numbers correctly", () => {
      render(() => (
        <TestWrapper>
          <DeleteConfirmDialog
            {...defaultProps}
            imageCount={1000}
            folderCount={500}
          />
        </TestWrapper>
      ));

      expect(screen.getByText("Delete 1500 items (500 folders, 1000 images)?")).toBeInTheDocument();
    });
  });
}); 