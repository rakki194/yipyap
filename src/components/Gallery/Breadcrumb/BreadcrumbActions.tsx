import { Component, Show, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { useTransformations } from "~/contexts/transformations";
import { SettingsOverlay } from "../SettingsOverlay";
import { FileUpload } from "../FileUpload";
import { NewFolderDialog } from "../NewFolderDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { MultiSelectActions } from "../MultiSelectActions";
import getIcon from "~/icons";
import "./BreadcrumbActions.css";
import { Tooltip } from "~/components/Tooltip/Tooltip";
import { Toggle } from "~/components/Toggle/Toggle";

const BatchTransformDialog: Component<{
  onClose: () => void;
  onConfirm: (options: {
    transformations: string[],
    captionTypes: string[]
  }) => void;
}> = (props) => {
  const app = useAppContext();
  const gallery = useGallery();
  const { state } = useTransformations();
  const t = app.t;

  const selectedCount = () => gallery.multiSelected.size;

  // Track which transformations and caption types are selected
  const [selectedTransforms, setSelectedTransforms] = createSignal<Set<string>>(
    new Set(state.transformations.filter(t => t.enabled).map(t => t.id))
  );
  const [selectedTypes, setSelectedTypes] = createSignal<Set<string>>(
    new Set(["txt", "tags", "caption", "wd"])
  );

  const toggleTransform = (id: string) => {
    const current = selectedTransforms();
    const next = new Set(current);
    if (current.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedTransforms(next);
  };

  const toggleType = (type: string) => {
    const current = selectedTypes();
    const next = new Set(current);
    if (current.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setSelectedTypes(next);
  };

  const hasSelections = () => selectedTransforms().size > 0 && selectedTypes().size > 0;

  return (
    <div class="settings-overlay" onClick={props.onClose}>
      <div class="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t('gallery.batchTransformTitle')}</h2>

        <div class="dialog-body">
          <p>{t('gallery.batchTransformDescription')}</p>

          <div class="transform-info">
            <h3>{t('gallery.selectedFiles')}</h3>
            <p>{t('gallery.selectedFilesCount', { count: selectedCount() })}</p>

            <h3>{t('gallery.enabledTransformations')}</h3>
            <div class="transform-list">
              {state.transformations.filter(t => t.enabled).map(transform => (
                <label class="transform-item">
                  <span class="icon">{getIcon(transform.icon)}</span>
                  <Tooltip content={t(transform.description)} position="right">
                    <span class="transform-name">{t(transform.name)}</span>
                  </Tooltip>
                  <Toggle
                    checked={selectedTransforms().has(transform.id)}
                    onChange={() => toggleTransform(transform.id)}
                    title={t(transform.name)}
                  />
                </label>
              ))}
            </div>

            <h3>{t('gallery.captionTypes.title')}</h3>
            <div class="caption-types">
              {Object.entries(t('gallery.captionTypes')).map(([type, label]) => (
                <div class="caption-type">
                  <label>
                    <span>{label}</span>
                    <Toggle
                      checked={selectedTypes().has(type)}
                      onChange={() => toggleType(type)}
                      title={t(type)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" onClick={props.onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            class="primary"
            disabled={!hasSelections()}
            onClick={() => {
              props.onConfirm({
                transformations: Array.from(selectedTransforms()),
                captionTypes: Array.from(selectedTypes())
              });
              props.onClose();
            }}
          >
            {t('gallery.applyTransformations')}
          </button>
        </div>
      </div>
    </div>
  );
};

const BatchTransformButton: Component = () => {
  const app = useAppContext();
  const gallery = useGallery();
  const { state, applyTransformation } = useTransformations();
  const t = app.t;

  const [showDialog, setShowDialog] = createSignal(false);
  const hasEnabledTransformations = () => state.transformations.some(t => t.enabled);
  const hasSelection = () => gallery.multiSelected.size > 0;

  const handleBatchTransform = async (options: {
    transformations: string[],
    captionTypes: string[]
  }) => {
    if (!hasSelection() || !hasEnabledTransformations()) return;

    try {
      // Get all selected files
      const selectedFiles = Array.from(gallery.multiSelected);
      const data = gallery.data();
      if (!data) return;

      // Apply transformations to each file's captions and tags
      for (const idx of selectedFiles) {
        const item = data.items[idx];
        if (!item || item.type !== "image") continue;

        const image = item();
        if (!image) continue;

        // Transform captions
        if (image.captions) {
          for (const [type, caption] of image.captions) {
            // Skip if caption type is not selected
            if (!options.captionTypes.includes(type)) continue;

            // Apply each selected transformation in sequence
            let transformedCaption = caption;
            for (const transformId of options.transformations) {
              transformedCaption = applyTransformation(transformId, transformedCaption);
            }

            if (transformedCaption !== caption) {
              await fetch(`/api/caption/${data.path}/${image.name}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, caption: transformedCaption })
              });
            }
          }
        }
      }

      // Refresh gallery data
      gallery.refetchGallery();

      app.notify(t('notifications.batchTransformSuccess'), 'success');
    } catch (error) {
      console.error('Error applying batch transformations:', error);
      app.notify(t('notifications.batchTransformError'), 'error');
    }
  };

  return (
    <>
      <Show when={hasEnabledTransformations()}>
        <button
          type="button"
          class="icon"
          onClick={() => setShowDialog(true)}
          title={t('gallery.applyBatchTransform')}
          aria-label={t('gallery.applyBatchTransform')}
          disabled={!hasSelection()}
        >
          {getIcon("sparkle")}
        </button>
      </Show>

      <Show when={showDialog()}>
        <BatchTransformDialog
          onClose={() => setShowDialog(false)}
          onConfirm={handleBatchTransform}
        />
      </Show>
    </>
  );
};

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
      window.location.href = parentPath ? `/${parentPath}` : "/";

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
        <BatchTransformButton />
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
