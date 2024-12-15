import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon from "~/icons";
import { useAppContext } from "~/contexts/app";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import "./Breadcrumb.css";


export const Breadcrumb = () => {
  const { data } = useGallery();
  const app = useAppContext();
  const t = app.t;

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
  const selectedCount = () => selection.multiSelected.size + selection.multiFolderSelected.size;
  const hasSelection = () => selectedCount() > 0;
  const hasFolderSelection = () => selection.multiFolderSelected.size > 0;
  
  const handleDelete = async () => {
    if (!hasSelection()) return;
    
    try {
      const message = app.t('gallery.confirmMultiDelete').replace('{{count}}', selectedCount().toString());
      if (confirm(message)) {
        const data = gallery.data();
        if (!data) return;
        
        // Handle folder deletions
        const selectedFolders = Array.from(selection.multiFolderSelected);
        if (selectedFolders.length > 0) {
          setDeleteProgress({ current: 0, total: selectedFolders.length });
          let completed = 0;
          
          const folderResults = await Promise.allSettled(
            selectedFolders.map(async (idx) => {
              try {
                const item = data.items[idx];
                if (item?.type !== 'directory') return;
                
                const folderPath = data.path
                  ? `${data.path}/${item.file_name}`
                  : item.file_name;
                  
                const response = await fetch(`/api/browse/${folderPath}`, {
                  method: 'DELETE',
                });
                
                completed++;
                setDeleteProgress(prev => prev ? { 
                  ...prev, 
                  current: completed
                } : null);
                
                return response;
              } catch (error) {
                console.error(`Error deleting folder at index ${idx}:`, error);
                throw error;
              }
            })
          );

          // Handle folder deletion errors
          const failedFolders = folderResults.filter(r => r.status === 'rejected').length;
          if (failedFolders > 0) {
            alert(app.t('gallery.someDeletesFailed').replace('{{count}}', failedFolders.toString()));
          }
        }

        // Handle image deletions only if no folders are selected
        if (!hasFolderSelection()) {
          const selectedImages = Array.from(selection.multiSelected);
          setDeleteProgress({ current: 0, total: selectedImages.length });
          let completed = 0;
          
          const results = await Promise.allSettled(
            selectedImages.map(async (idx) => {
              try {
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
              } catch (error) {
                console.error(`Error deleting image at index ${idx}:`, error);
                throw error;
              }
            })
          );
          
          // Handle image deletion errors
          const failedCount = results.filter(r => r.status === 'rejected').length;
          if (failedCount > 0) {
            alert(app.t('gallery.someDeletesFailed').replace('{{count}}', failedCount.toString()));
          }
        }
        
        // Clear progress and selection after all operations
        setDeleteProgress(null);
        selection.clearMultiSelect();
        
        // Force a refetch by invalidating the current data
        gallery.invalidate();
        await gallery.refetch();
      }
    } catch (error) {
      console.error('Error in bulk delete operation:', error);
      alert(app.t('gallery.deleteError'));
    } finally {
      setDeleteProgress(null);
    }
  };

  return (
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
              title={app.t('gallery.deleteSelected').replace('{{count}}', selectedCount().toString())}
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
  );
};
