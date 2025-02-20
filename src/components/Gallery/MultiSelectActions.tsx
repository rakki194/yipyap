import { Component, Show, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import getIcon from "~/icons";
import "./MultiSelectActions.css";

export const MultiSelectActions: Component = () => {
  const gallery = useGallery();
  const app = useAppContext();
  const selection = gallery.selection;
  const [deleteProgress, setDeleteProgress] = createSignal<{ current: number, total: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  type DeleteResult = Response | { error: true };

  const selectedCount = () => {
    const imageCount = selection.multiSelected.size;
    const folderCount = selection.multiFolderSelected.size;
    return imageCount + folderCount;
  };

  const hasSelection = () => selectedCount() > 0;
  const hasFolderSelection = () => selection.multiFolderSelected.size > 0;

  const handleDelete = async () => {
    if (!hasSelection()) return;
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <Show when={hasSelection() || gallery.data()?.items.some(item => item.type === "image" || item.type === "directory")}>
        <div class="multi-select-actions">
          <Show when={hasSelection()}>
            <div class="delete-button-container">
              <Show
                when={!isDeleting()}
                fallback={
                  <div class="spinner-container">
                    {getIcon("spinner")}
                  </div>
                }
              >
                <button
                  type="button"
                  class="icon delete-button"
                  onClick={handleDelete}
                  title={app.t('gallery.deleteSelected', { count: selectedCount() })}
                >
                  {getIcon("delete")}
                </button>
              </Show>
              <Show when={deleteProgress()}>
                <div
                  class="delete-progress-bar"
                  data-testid="delete-progress-bar"
                >
                  <div
                    class="delete-progress-fill"
                    data-testid="delete-progress-fill"
                    style={{
                      width: `${(deleteProgress()!.current / deleteProgress()!.total) * 100}%`
                    }}
                  />
                </div>
              </Show>
            </div>
          </Show>
          <button
            type="button"
            class="icon"
            onClick={() => {
              if (hasSelection()) {
                selection.clearMultiSelect();
                selection.clearFolderMultiSelect();
              } else {
                selection.selectAll();
              }
            }}
            title={hasSelection() ? app.t('gallery.deselectAll') : app.t('gallery.selectAll')}
          >
            {getIcon(hasSelection() ? "dismiss" : "checkAll")}
          </button>
        </div>
      </Show>

      <Show when={showDeleteConfirm()}>
        <DeleteConfirmDialog
          imageCount={selection.multiSelected.size}
          folderCount={selection.multiFolderSelected.size}
          isDeleting={isDeleting()}
          onConfirm={async () => {
            const data = gallery.data();
            if (!data) return;

            try {
              setIsDeleting(true);
              // Show initial deletion notification
              app.notify(
                app.t('gallery.deletingFiles'),
                "info"
              );

              // Handle image deletions
              const selectedImages = Array.from(selection.multiSelected);
              if (selectedImages.length > 0) {
                setDeleteProgress({ current: 0, total: selectedImages.length });
                let completed = 0;
                let hasError = false;

                for (const idx of selectedImages) {
                  const item = data.items[idx];
                  if (item?.type !== 'image') continue;

                  const imagePath = data.path
                    ? `${data.path}/${item.file_name}`
                    : item.file_name;

                  const params = new URLSearchParams();
                  params.append("confirm", "true");

                  if (app.preserveLatents) {
                    params.append("preserve_latents", "true");
                  }
                  if (app.preserveTxt) {
                    params.append("preserve_txt", "true");
                  }

                  try {
                    const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
                      method: "DELETE",
                    });

                    if (!response.ok) {
                      hasError = true;
                      break;
                    }

                    completed++;
                    setDeleteProgress(prev => prev ? {
                      ...prev,
                      current: completed
                    } : null);
                  } catch (error) {
                    hasError = true;
                    break;
                  }
                }

                if (hasError) {
                  app.notify(
                    app.t('gallery.deleteError'),
                    "error"
                  );
                  return;
                }

                // Show success notification if no errors
                app.notify(
                  app.t('gallery.deleteSuccess'),
                  "success"
                );

                // Clear selection after all operations
                gallery.selection.clearMultiSelect();
                gallery.selection.clearFolderMultiSelect();

                // Force a refetch
                gallery.refetchGallery();
              }
            } catch (error) {
              console.error('Error in bulk delete operation:', error);
              app.notify(
                app.t('gallery.deleteError'),
                "error"
              );
            } finally {
              setIsDeleting(false);
              setDeleteProgress(null);
              setShowDeleteConfirm(false);
            }
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </Show>
    </>
  );
}; 