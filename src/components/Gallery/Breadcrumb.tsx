import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon from "~/icons";
import { useAppContext } from "~/contexts/app";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import { DeleteConfirmDialog } from "~/components/Gallery/DeleteConfirmDialog";
import "./Breadcrumb.css";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const Breadcrumb = () => {
  const { data } = useGallery();
  const app = useAppContext();
  const t = app.t;
  const gallery = useGallery();

  const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    let totalSize = 0;
    let oversizedFiles = [];

    // Check file sizes and add to form data
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        continue;
      }
      totalSize += file.size;
      formData.append("files", file);
    }

    if (oversizedFiles.length > 0) {
      app.notify(
        t("gallery.filesExceedLimit", { files: oversizedFiles.join(", ") }),
        "error",
        "file-upload"
      );
      return;
    }

    if (totalSize === 0) {
      app.notify(
        t("gallery.noFilesToUpload"),
        "error",
        "file-upload"
      );
      return;
    }

    app.notify(
      t("gallery.processingFiles"),
      "info",
      "file-upload",
      "spinner"
    );

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/upload/${gallery.data()?.path}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        app.createNotification({
          message: t("gallery.uploadProgressPercent", { progress }),
          type: "info",
          group: "file-upload",
          icon: "spinner",
          progress
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        app.notify(
          t("gallery.uploadComplete"),
          "success",
          "file-upload"
        );
        gallery.invalidate();
        gallery.refetch();
      } else {
        app.notify(
          t("gallery.uploadFailed", { error: xhr.statusText }),
          "error",
          "file-upload"
        );
      }
    };

    xhr.onerror = () => {
      app.notify(
        t("gallery.uploadFailed", { error: "Network error" }),
        "error",
        "file-upload"
      );
    };

    xhr.send(formData);
  };

  const [showSettings, setShowSettings] = createSignal(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = createSignal(false);
  const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);
  const [newFolderName, setNewFolderName] = createSignal("");
  const [isCreatingFolder, setIsCreatingFolder] = createSignal(false);

  const handleCreateFolder = async () => {
    const folderName = newFolderName().trim();
    if (!folderName) return;

    try {
      setIsCreatingFolder(true);
      const currentPath = data()?.path || "";
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
      await gallery.refetch();

      // Close dialog and reset input
      setShowNewFolderDialog(false);
      setNewFolderName("");

      // Show success notification
      app.notify(
        t('notifications.folderCreated'),
        "success"
      );

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

  const handleDeleteCurrentFolder = async () => {
    const currentPath = data()?.path;
    if (!currentPath) return;

    try {
      const params = new URLSearchParams();
      params.append("confirm", "true");
      
      const response = await fetch(`/api/browse/${currentPath}?${params.toString()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Navigate to parent folder
      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      window.location.href = parentPath ? `/gallery/${parentPath}` : "/gallery";

      app.notify(
        t('notifications.folderDeleted'),
        "success"
      );
    } catch (error) {
      console.error("Error deleting folder:", error);
      app.notify(
        t('notifications.folderDeleteError'),
        "error"
      );
    }
  };

  const Crumbs = () => {
    const segments = () => data()?.path.split("/").filter(Boolean) || [];
    const crumbs = () =>
      segments().reduce<{ children: string; href: string }[]>(
        (acc, segment) => {
          const last = acc[acc.length - 1];
          acc.push({
            children: segment,
            href: last ? `${last.href}/${segment}` : `/gallery/${segment}`,
          });
          return acc;
        },
        []
      );
    
    return (
      <>
        <For each={crumbs()}>
          {(crumb) => {
            const path = crumb.href;
            return (
              <>
                {t('common.pathSeparator')}
                <A href={crumb.href}>{crumb.children}</A>
              </>
            );
          }}
        </For>
      </>
    );
  };

  const isInSubfolder = () => {
    const segments = data()?.path.split("/").filter(Boolean) || [];
    return segments.length > 0;
  };

  return (
    <>
      <Show when={app.theme === "strawberry"}>
        <div class="strawberry-decoration" />
      </Show>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <div class="breadcrumb-links">
            <A href="/" aria-label={t('common.returnToFrontPage')}>
              <span class="accent-hover icon" title={t('common.home')}>
                {getIcon("yipyap")}
              </span>
            </A>
            <A href="/gallery">
              <span class="accent icon">{getIcon("dimensions")}</span>
            </A>
            <Crumbs />
          </div>
          <small>
            <Suspense
              fallback={<span class="spin-icon icon">{getIcon("spinner")}</span>}
            >
              <Show when={data()} keyed>
                {(data) => (
                  <>
                    <span class="icon">{getIcon("folder")}</span>{" "}
                    {data.total_folders}{" "}
                    <span class="icon">{getIcon("dimensions")}</span>{" "}
                    {data.total_images}
                  </>
                )}
              </Show>
            </Suspense>
          </small>
          <div class="breadcrumb-actions">
            <button
              type="button"
              class="icon"
              onClick={() => setShowNewFolderDialog(true)}
              title={t('gallery.createFolder')}
              aria-label={t('gallery.createFolder')}
            >
              {getIcon("folderAdd")}
            </button>
            <button
              type="button"
              class="icon"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              title={t('gallery.uploadFiles')}
              aria-label={t('gallery.uploadFiles')}
            >
              {getIcon("upload")}
            </button>
            <input
              type="file"
              id="file-upload-input"
              style={{ display: 'none' }}
              multiple
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  uploadFiles(files);
                  // Reset the input so the same file can be uploaded again
                  e.currentTarget.value = '';
                }
              }}
            />
            <Show when={isInSubfolder()}>
              <button
                type="button"
                class="icon delete-button"
                onClick={() => setShowDeleteDialog(true)}
                title={t('gallery.deleteCurrentFolder')}
                aria-label={t('gallery.deleteCurrentFolder')}
              >
                {getIcon("trash")}
              </button>
            </Show>
            <MultiSelectActions />
            <ThemeToggle />
            <button
              type="button"
              class="icon"
              onClick={() => setShowSettings(!showSettings())}
              title={t('settings.title')}
              aria-label={t('common.openSettings')}
            >
              {getIcon("settings")}
            </button>
          </div>
        </div>
        <Show when={showSettings()}>
          <div class="settings-overlay" onClick={() => setShowSettings(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <Settings onClose={() => setShowSettings(false)} />
            </div>
          </div>
        </Show>
      </nav>
      <Show when={showNewFolderDialog()}>
        <div class="modal-overlay" onClick={() => setShowNewFolderDialog(false)}>
          <div class="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              class="icon modal-close-button"
              onClick={() => setShowNewFolderDialog(false)}
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
      </Show>
      <Show when={showDeleteDialog()}>
        <DeleteConfirmDialog
          imageCount={0}
          folderCount={1}
          onConfirm={() => {
            setShowDeleteDialog(false);
            handleDeleteCurrentFolder();
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </Show>
    </>
  );
};

function ThemeToggle() {
  const app = useAppContext();
  const t = app.t;
  const [hovered, setHovered] = createSignal(false);
  const nextTheme = createMemo(() => getNextTheme(app.theme));
  return (
    <button
      type="button"
      class="icon accent-hover-inverted"
      onClick={() => app.setTheme(nextTheme())}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={t('common.toggleTheme')}
      aria-label={t('common.toggleTheme')}
    >
      {getIcon(themeIconMap[hovered() ? nextTheme() : app.theme]!)}
    </button>
  );
}

const MultiSelectActions = () => {
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
              
              // Clear selection and refresh
              selection.clearMultiSelect();
              gallery.invalidate();
              await gallery.refetch();
              
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
