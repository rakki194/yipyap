import { Component, createSignal, onCleanup, onMount, batch } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import { DirectoryItem } from "~/resources/browse";
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

  let inputRef!: HTMLInputElement;
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
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const database = gallery.data();
      if (!database) return;

      // Create the new folder item
      const newFolder = Object.assign(
        () => ({
          type: "directory" as const,
          name: folderName,
          mtime: new Date().toISOString(),
        }),
        {
          type: "directory" as const,
          file_name: folderName,
          next_page: undefined,
        }
      ) as DirectoryItem;

      // Add the new folder to the items list
      const items = [...database.items, newFolder];

      // Update the data like in deleteImage
      const data = {
        ...database,
        items,
        total_folders: database.total_folders + 1,
      };
      
      batch(() => {
        gallery.setData(data);
        gallery.clearImageCache();
        gallery.invalidateFolderCache();
      });

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
