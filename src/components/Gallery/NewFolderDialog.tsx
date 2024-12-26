import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import getIcon from "~/icons";
import "./NewFolderDialog.css";

interface NewFolderDialogProps {
  onClose: () => void;
}

export const NewFolderDialog: Component<NewFolderDialogProps> = (props) => {
  const app = useAppContext();
  const gallery = useGallery();
  const escape = useGlobalEscapeManager();
  const t = app.t;

  let inputRef: HTMLInputElement;
  const [newFolderName, setNewFolderName] = createSignal("");
  const [isCreatingFolder, setIsCreatingFolder] = createSignal(false);

  onMount(() => {
    escape.setOverlayState("modal", true);
    const unregister = escape.registerHandler("modal", props.onClose);
    
    // Use a small timeout to ensure modal is mounted and other focus is cleared
    setTimeout(() => {
      inputRef?.focus();
    }, 0);

    onCleanup(() => {
      escape.setOverlayState("modal", false);
      unregister();
    });
  });

  const handleCreateFolder = async () => {
    const folderName = newFolderName().trim();
    if (!folderName) return;

    try {
      setIsCreatingFolder(true);
      const currentPath = gallery.data()?.path || "";
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;

      const response = await fetch(`/api/folder/${folderPath}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Clear any existing selection to avoid index mismatches
      gallery.selection.clearMultiSelect();
      gallery.selection.clearFolderMultiSelect();
      gallery.select(null);

      // Force a complete refresh of the gallery data
      gallery.invalidate();
      gallery.invalidateFolderCache();
      await gallery.refetch();
      
      // Ensure we're on the first page to see the new folder
      gallery.setPage(0);

      // Show success notification
      app.notify(
        t('notifications.folderCreated'),
        "success"
      );

      props.onClose();

    } catch (error) {
      console.error("Error creating folder:", error);
      app.notify(
        t('notifications.folderCreateError'),
        "error"
      );
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <div class="modal-overlay" onClick={props.onClose}>
      <div class="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          class="icon modal-close-button"
          onClick={props.onClose}
          title={t('common.close')}
          aria-label={t('common.close')}
        >
          {getIcon("dismiss")}
        </button>
        <h2>{t('gallery.createFolder')}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateFolder();
          }}
        >
          <input
            ref={inputRef!}
            type="text"
            value={newFolderName()}
            onInput={(e) => setNewFolderName(e.currentTarget.value)}
            placeholder={t('gallery.folderNamePlaceholder')}
            disabled={isCreatingFolder()}
          />
          <div class="modal-actions">
            <button
              type="submit"
              class="primary"
              disabled={!newFolderName().trim() || isCreatingFolder()}
            >
              {isCreatingFolder() ? t('common.creating') : t('common.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 