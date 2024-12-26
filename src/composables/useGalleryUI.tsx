/**
 * A composable that manages UI state for the Gallery component, providing signals and handlers
 * for various UI elements like dialogs, overlays, and interactive states.
 * 
 * @example
 * ```tsx
 * function GalleryComponent() {
 *   const {
 *     showQuickJump,
 *     setShowQuickJump,
 *     showSettings,
 *     openSettings
 *   } = useGalleryUI();
 * 
 *   return (
 *     <>
 *       <QuickJumpDialog show={showQuickJump()} onClose={() => setShowQuickJump(false)} />
 *       <button onClick={() => openSettings()}>Open Settings</button>
 *     </>
 *   );
 * }
 * ```
 * 
 * @returns {Object} An object containing:
 * - `showQuickJump` - Signal for quick jump dialog visibility
 * - `setShowQuickJump` - Setter for quick jump dialog visibility
 * - `showDeleteConfirm` - Signal for delete confirmation dialog visibility
 * - `setShowDeleteConfirm` - Setter for delete confirmation dialog visibility
 * - `isDragging` - Signal indicating if a drag operation is in progress
 * - `setIsDragging` - Setter for drag state
 * - `showSettings` - Signal for settings dialog visibility
 * - `setShowSettings` - Setter for settings dialog visibility
 * - `showNewFolderDialog` - Signal for new folder dialog visibility
 * - `setShowNewFolderDialog` - Setter for new folder dialog visibility
 * - `progressInfo` - Signal containing progress information for operations
 * - `setProgressInfo` - Setter for progress information
 * - `openSettings` - Handler that closes quick jump and opens settings
 * - `openNewFolder` - Handler that closes quick jump and opens new folder dialog
 */
import { createSignal } from "solid-js";
import { ProgressInfo } from "../components/Gallery/types";

export function useGalleryUI() {
  const [showQuickJump, setShowQuickJump] = createSignal(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = createSignal(false);
  const [progressInfo, setProgressInfo] = createSignal<ProgressInfo | null>(null);

  const openSettings = () => {
    setShowQuickJump(false);
    setTimeout(() => setShowSettings(true), 0);
  };

  const openNewFolder = () => {
    setShowQuickJump(false);
    setTimeout(() => setShowNewFolderDialog(true), 0);
  };

  return {
    showQuickJump,
    setShowQuickJump,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDragging,
    setIsDragging,
    showSettings,
    setShowSettings,
    showNewFolderDialog,
    setShowNewFolderDialog,
    progressInfo,
    setProgressInfo,
    openSettings,
    openNewFolder
  };
}
