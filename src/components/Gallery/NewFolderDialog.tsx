import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { createGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import getIcon from "~/icons";
import "./NewFolderDialog.css";

interface NewFolderDialogProps {
  onClose: () => void;
}

export const NewFolderDialog: Component<NewFolderDialogProps> = (props) => {
  const app = useAppContext();
  const gallery = useGallery();
  const { registerCloseHandler, setKeyboardState } = createGlobalEscapeManager();
  const t = app.t;

  const [newFolderName, setNewFolderName] = createSignal("");
  const [isCreatingFolder, setIsCreatingFolder] = createSignal(false);

  onMount(() => {
    setKeyboardState("modalOpen", true);
    const unregister = registerCloseHandler("modalOpen", props.onClose);

    onCleanup(() => {
      setKeyboardState("modalOpen", false);
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
            type="text"
            value={newFolderName()}
            onInput={(e) => setNewFolderName(e.currentTarget.value)}
            placeholder={t('gallery.folderNamePlaceholder')}
            disabled={isCreatingFolder()}
            autofocus
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