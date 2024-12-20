import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon from "~/icons";
import { useAppContext } from "~/contexts/app";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import { DeleteConfirmDialog } from "~/components/Gallery/DeleteConfirmDialog";
import "./Breadcrumb.css";


export const Breadcrumb = () => {
  const { data } = useGallery();
  const app = useAppContext();
  const t = app.t;
  const gallery = useGallery();

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
    );
  };

  const [showSettings, setShowSettings] = createSignal(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = createSignal(false);
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
      app.createNotification({
        message: t('notifications.folderCreated'),
        type: "success"
      });

    } catch (error) {
      console.error("Error creating folder:", error);
      app.createNotification({
        message: t('notifications.folderCreateError'),
        type: "error"
      });
    } finally {
      setIsCreatingFolder(false);
    }
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

                const failedFolders = folderResults.filter(r => r.status === 'rejected').length;
                if (failedFolders > 0) {
                  app.createNotification({
                    message: app.t('gallery.folderDeleteError'),
                    type: "error"
                  });
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

                const failedCount = results.filter(r => r.status === 'rejected').length;
                if (failedCount > 0) {
                  app.createNotification({
                    message: app.t('gallery.someDeletesFailed', { count: failedCount }),
                    type: "error"
                  });
                }
              }
              
              // Clear selection and refresh
              selection.clearMultiSelect();
              gallery.invalidate();
              await gallery.refetch();
              
            } catch (error) {
              console.error('Error in bulk delete operation:', error);
              app.createNotification({
                message: app.t('gallery.deleteError'),
                type: "error"
              });
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
