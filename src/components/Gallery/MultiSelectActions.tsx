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
              <button
                type="button"
                class="icon delete-button"
                onClick={handleDelete}
                title={app.t('gallery.deleteSelected', { count: selectedCount() })}
              >
                {getIcon("delete")}
              </button>
              <Show when={deleteProgress()}>
                <div class="delete-progress-bar">
                  <div 
                    class="delete-progress-fill" 
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
          onConfirm={async () => {
            const data = gallery.data();
            if (!data) return;
            
            try {
              // Show initial deletion notification
              app.notify(
                app.t('gallery.deletingFiles'),
                "info"
              );

              let failedFolders = 0;
              let failedCount = 0;

              // Handle folder deletions
              const selectedFolders = Array.from(selection.multiFolderSelected);
              if (selectedFolders.length > 0) {
                setDeleteProgress({ current: 0, total: selectedFolders.length });
                let completed = 0;
                
                const folderResults = await Promise.allSettled(
                  selectedFolders.map(async (idx) => {
                    const item = data.items[idx];
                    if (item?.type !== 'directory') return;
                    
                    const folderPath = data.path
                      ? `${data.path}/${item.file_name}`
                      : item.file_name;
                      
                    const params = new URLSearchParams();
                    params.append("confirm", "true");
                    
                    const response = await fetch(`/api/browse/${folderPath}?${params.toString()}`, {
                      method: 'DELETE',
                    });
                    
                    completed++;
                    setDeleteProgress(prev => prev ? { 
                      ...prev, 
                      current: completed
                    } : null);
                    
                    return response;
                  })
                );

                failedFolders = folderResults.filter(r => r.status === 'rejected').length;
                if (failedFolders > 0) {
                  app.notify(
                    app.t('gallery.folderDeleteError'),
                    "error"
                  );
                }
              }

              // Handle image deletions
              if (!hasFolderSelection()) {
                const selectedImages = Array.from(selection.multiSelected);
                setDeleteProgress({ current: 0, total: selectedImages.length });
                let completed = 0;
                
                const results = await Promise.allSettled(
                  selectedImages.map(async (idx) => {
                    const item = data.items[idx];
                    if (item?.type !== 'image') return;
                    
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

                    const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
                      method: "DELETE",
                    });
                    
                    completed++;
                    setDeleteProgress(prev => prev ? { 
                      ...prev, 
                      current: completed
                    } : null);
                    
                    return response;
                  })
                );

                failedCount = results.filter(r => r.status === 'rejected').length;
                if (failedCount > 0) {
                  app.notify(
                    app.t('gallery.someDeletesFailed', { count: failedCount }),
                    "error"
                  );
                }
              }
              
              // Show success notification if no errors
              if (!failedFolders && !failedCount) {
                app.notify(
                  app.t('gallery.deleteSuccess'),
                  "success"
                );
              }
              
              // Clear selection after all operations
              gallery.selection.clearMultiSelect();
              gallery.selection.clearFolderMultiSelect();
              
              // Force a refetch
              gallery.refetchGallery();
              
              setShowDeleteConfirm(false);
              
            } catch (error) {
              console.error('Error in bulk delete operation:', error);
              app.notify(
                app.t('gallery.deleteError'),
                "error"
              );
            } finally {
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