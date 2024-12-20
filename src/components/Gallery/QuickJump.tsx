import {
  Component,
  createSignal,
  For,
  Show,
  createResource,
  onMount,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";
import "./QuickJump.css";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";

interface FolderMatch {
  name: string;
  path: string;
  fullPath: string;
}

export const QuickJump: Component<{
  onClose: () => void;
}> = (props) => {
  const { t } = useAppContext();
  let inputRef: HTMLInputElement | undefined;
  const [search, setSearch] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const navigate = useNavigate();
  const gallery = useGallery();

  const [folders] = createResource(gallery.getAllKnownFolders);

  const matches = () => {
    const searchTerm = search().toLowerCase();
    if (!searchTerm) return [];

    const knownFolders = folders() || [];

    return knownFolders
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
  };

  const handleSelect = (folder: FolderMatch) => {
    navigate(`/gallery/${folder.fullPath}`);
    props.onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const currentMatches = matches();

    if (e.key === "Escape") {
      props.onClose();
    } else if (e.key === "Enter" && currentMatches.length > 0) {
      // Select the highlighted item instead of always the first one
      handleSelect(currentMatches[selectedIndex()]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < currentMatches.length - 1 ? prev + 1 : prev
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
          onInput={(e) => setSearch(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('common.search')}
          autofocus
          aria-label={t('common.search')}
        />
        <Show when={folders.loading}>
          <div class="loading" role="status">{t('gallery.loadingFolders')}</div>
        </Show>
        <Show when={!folders.loading && (!matches() || matches()?.length === 0)}>
          <div class="no-results" role="status">{t('gallery.noResults')}</div>
        </Show>
        <Show when={matches().length > 0}>
          <ul class="quick-jump-results" role="listbox">
            <For each={matches()}>
              {(folder, index) => (
                <li
                  role="option"
                  aria-selected={index() === selectedIndex()}
                  onClick={() => handleSelect(folder)}
                  classList={{
                    selected: index() === selectedIndex(),
                  }}
                >
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
