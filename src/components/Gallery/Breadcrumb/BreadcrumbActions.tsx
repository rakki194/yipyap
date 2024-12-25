import { Component, Show, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { SettingsOverlay } from "../SettingsOverlay";
import { FileUpload } from "../FileUpload";
import { NewFolderDialog } from "../NewFolderDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { MultiSelectActions } from "../MultiSelectActions";
import getIcon from "~/icons";
import "./BreadcrumbActions.css";

export const BreadcrumbActions: Component = () => {
  const app = useAppContext();
  const gallery = useGallery();
  const t = app.t;
  const { data } = gallery;

  const [showSettings, setShowSettings] = createSignal(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = createSignal(false);
  const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);

  const isInSubfolder = () => {
    const segments = data()?.path.split("/").filter(Boolean) || [];
    return segments.length > 0;
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

      // Invalidate folder cache
      gallery.invalidateFolderCache();

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

  return (
    <>
      <div class="breadcrumb-actions">
        <MultiSelectActions />
        <button
          type="button"
          class="icon"
          onClick={() => setShowNewFolderDialog(true)}
          title={t('gallery.createFolder')}
          aria-label={t('gallery.createFolder')}
        >
          {getIcon("folderAdd")}
        </button>
        <FileUpload />
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

      <Show when={showSettings()}>
        <SettingsOverlay onClose={() => setShowSettings(false)} />
      </Show>

      <Show when={showNewFolderDialog()}>
        <NewFolderDialog onClose={() => setShowNewFolderDialog(false)} />
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

const ThemeToggle: Component = () => {
  const app = useAppContext();
  const t = app.t;
  const [hovered, setHovered] = createSignal(false);
  const nextTheme = () => getNextTheme(app.theme);

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
}; 