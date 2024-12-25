import {
  Component,
  createSignal,
  For,
  Show,
  createResource,
  onMount,
  onCleanup,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";
import "./QuickJump.css";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";
import { getNextTheme, themeIconMap } from "~/contexts/theme";

interface FolderMatch {
  name: string;
  path: string;
  fullPath: string;
}

interface ActionMatch {
  id: string;
  name: string;
  icon: string;
  action: () => void;
  shortcut?: string;
}

export const QuickJump: Component<{
  onClose: () => void;
  onShowSettings: () => void;
  onShowNewFolder: () => void;
}> = (props) => {
  const { t } = useAppContext();
  const app = useAppContext();
  let inputRef: HTMLInputElement | undefined;
  const [search, setSearch] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const navigate = useNavigate();
  const gallery = useGallery();

  const [folders] = createResource(gallery.getAllKnownFolders);

  const handleDeleteCurrentFolder = async () => {
    const currentPath = gallery.data()?.path;
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

      const parentPath = currentPath.split("/").slice(0, -1).join("/");
      window.location.href = parentPath ? `/gallery/${parentPath}` : "/gallery";
      props.onClose();

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

  const uploadFiles = async (files: FileList) => {
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const formData = new FormData();
    let totalSize = 0;
    let oversizedFiles = [];

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

    props.onClose();

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

  const isInSubfolder = () => {
    const segments = gallery.data()?.path.split("/").filter(Boolean) || [];
    return segments.length > 0;
  };

  const getActions = (): ActionMatch[] => {
    const actions: ActionMatch[] = [
      {
        id: 'new-folder',
        name: t('gallery.createFolder'),
        icon: 'folderAdd',
        action: () => {
          props.onShowNewFolder();
        }
      },
      {
        id: 'upload',
        name: t('gallery.uploadFiles'),
        icon: 'upload',
        action: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
              uploadFiles(files);
            }
          };
          input.click();
        }
      },
      {
        id: 'select-all',
        name: gallery.selection.multiSelected.size > 0 ? t('gallery.deselectAll') : t('gallery.selectAll'),
        icon: gallery.selection.multiSelected.size > 0 ? 'dismiss' : 'checkAll',
        action: () => {
          if (gallery.selection.multiSelected.size > 0) {
            gallery.selection.clearMultiSelect();
          } else {
            gallery.selection.selectAll();
          }
          props.onClose();
        }
      },
      {
        id: 'theme',
        name: t('common.toggleTheme'),
        icon: themeIconMap[app.theme] || 'moon',
        action: () => {
          app.setTheme(getNextTheme(app.theme));
          props.onClose();
        }
      },
      {
        id: 'settings',
        name: t('settings.title'),
        icon: 'settings',
        action: () => {
          props.onShowSettings();
        }
      }
    ];

    // Add delete folder action only if in subfolder
    if (isInSubfolder()) {
      actions.push({
        id: 'delete-folder',
        name: t('gallery.deleteCurrentFolder'),
        icon: 'trash',
        action: () => {
          handleDeleteCurrentFolder();
        }
      });
    }

    return actions;
  };

  const matches = () => {
    const searchTerm = search().toLowerCase();
    if (!searchTerm) {
      // When no search term, show all actions first, then most recent folders
      return {
        actions: getActions(),
        folders: (folders() || []).slice(0, 3)
      };
    }

    const matchingActions = getActions().filter(
      action => action.name.toLowerCase().includes(searchTerm)
    );

    const matchingFolders = (folders() || [])
      .filter((folder) => folder.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        // Sort exact matches first
        const aExact = a.name.toLowerCase() === searchTerm;
        const bExact = b.name.toLowerCase() === searchTerm;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Then sort by path length (shorter paths first)
        const aDepth = a.path.split("/").length;
        const bDepth = b.path.split("/").length;
        if (aDepth !== bDepth) return aDepth - bDepth;

        // Finally sort alphabetically
        return a.fullPath.localeCompare(b.fullPath);
      })
      .slice(0, 5); // Limit to 5 suggestions

    return {
      actions: matchingActions,
      folders: matchingFolders
    };
  };

  const handleSelect = (item: FolderMatch | ActionMatch) => {
    if ('fullPath' in item) {
      navigate(`/gallery/${item.fullPath}`);
      props.onClose();
    } else {
      item.action();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const currentMatches = matches();
    const totalItems = currentMatches.actions.length + currentMatches.folders.length;

    if (e.key === "Escape") {
      props.onClose();
    } else if (e.key === "Enter" && totalItems > 0) {
      const idx = selectedIndex();
      if (idx < currentMatches.actions.length) {
        currentMatches.actions[idx].action();
      } else {
        handleSelect(currentMatches.folders[idx - currentMatches.actions.length]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < totalItems - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Reset selected index when search changes
  const handleSearchInput = (
    e: InputEvent & { currentTarget: HTMLInputElement }
  ) => {
    setSearch(e.currentTarget.value);
    setSelectedIndex(0);
  };

  onMount(() => {
    inputRef?.focus();
  });

  return (
    <div 
      class="quick-jump-overlay" 
      data-testid="quick-jump-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div 
        class="quick-jump-modal" 
        data-testid="quick-jump-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="quick-jump-header">
          <h2>{t('gallery.quickJump')}</h2>
          <button
            type="button"
            class="icon close-button"
            onClick={props.onClose}
            title={t('common.close')}
            aria-label={t('common.close')}
          >
            {getIcon("dismiss")}
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={search()}
          onInput={handleSearchInput}
          onKeyDown={handleKeyDown}
          placeholder={t('common.search')}
          autofocus
          aria-label={t('common.search')}
        />
        <Show when={folders.loading}>
          <div class="loading" role="status">{t('gallery.loadingFolders')}</div>
        </Show>
        <Show when={!folders.loading && matches().actions.length === 0 && matches().folders.length === 0}>
          <div class="no-results" role="status">{t('gallery.noResults')}</div>
        </Show>
        <Show when={matches().actions.length > 0 || matches().folders.length > 0}>
          <ul class="quick-jump-results" role="listbox">
            <For each={matches().actions}>
              {(action, index) => (
                <li
                  role="option"
                  aria-selected={index() === selectedIndex()}
                  onClick={() => action.action()}
                  classList={{
                    selected: index() === selectedIndex(),
                    action: true
                  }}
                >
                  <span class="action-icon">{getIcon(action.icon)}</span>
                  <span class="action-name">{action.name}</span>
                </li>
              )}
            </For>
            <For each={matches().folders}>
              {(folder, index) => (
                <li
                  role="option"
                  aria-selected={index() + matches().actions.length === selectedIndex()}
                  onClick={() => handleSelect(folder)}
                  classList={{
                    selected: index() + matches().actions.length === selectedIndex(),
                  }}
                >
                  <span class="folder-icon">{getIcon("folder")}</span>
                  <span class="folder-name">{folder.name}</span>
                  <span class="folder-path">{folder.path || "/"}</span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
};
