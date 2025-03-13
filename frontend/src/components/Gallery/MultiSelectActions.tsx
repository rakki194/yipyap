import { Component, Show, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { MoveDialog } from "./MoveDialog";
import getIcon from "~/icons";
import "./MultiSelectActions.css";

export const MultiSelectActions: Component = () => {
  const gallery = useGallery();
  const app = useAppContext();
  const selection = gallery.selection;
  const [deleteProgress, setDeleteProgress] = createSignal<{ current: number, total: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
  const [showMoveDialog, setShowMoveDialog] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [isMoving, setIsMoving] = createSignal(false);

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
    setShowMoveDialog(false);
    setShowDeleteConfirm(true);
  };

  const handleMoveClick = () => {
    setShowDeleteConfirm(false);
    setShowMoveDialog(true);
  };

  const handleMove = async (targetPath: string) => {
    if (!hasSelection()) return;
    setIsMoving(true);

    try {
      const data = gallery.data();
      if (!data) return;

      const items = [...selection.multiSelected].map(idx => {
        const item = data.items[idx];
        if (!item || item.type !== "image") return null;
        const image = item();
        return image?.name || null;
      }).filter(Boolean);

      const folders = [...selection.multiFolderSelected].map(idx => {
        const item = data.items[idx];
        if (!item || item.type !== "directory") return null;
        const folder = item();
        return folder?.name || null;
      }).filter(Boolean);

      const response = await fetch(`/api/move/${data.path}?target=${encodeURIComponent(targetPath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [...items, ...folders] })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Clear selection and refresh gallery
      selection.clearMultiSelect();
      selection.clearFolderMultiSelect();
      gallery.refetchGallery();

      app.notify(app.t('gallery.moveSuccess'), 'success');
    } catch (error) {
      console.error('Error moving items:', error);
      app.notify(app.t('gallery.moveError'), 'error');
    } finally {
      setIsMoving(false);
    }
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

            <button
              type="button"
              class="icon"
              onClick={handleMoveClick}
              title={app.t('gallery.moveSelected', { count: selectedCount() })}
              disabled={isMoving()}
            >
              {isMoving() ? getIcon("spinner") : getIcon("move")}
            </button>
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

      <Show when={showMoveDialog()}>
        <MoveDialog
          imageCount={selection.multiSelected.size}
          folderCount={selection.multiFolderSelected.size}
          onMove={handleMove}
          onClose={() => setShowMoveDialog(false)}
        />
      </Show>
    </>
  );
}; 