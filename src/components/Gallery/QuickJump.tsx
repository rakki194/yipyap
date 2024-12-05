import { Component, createSignal, For, Show, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";
import "./QuickJump.css";

interface FolderMatch {
  name: string;
  path: string;
  fullPath: string;
}

export const QuickJump: Component<{
  onClose: () => void;
}> = (props) => {
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

  return (
    <div class="quick-jump-overlay" onClick={props.onClose}>
      <div class="quick-jump-modal card" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={search()}
          onInput={handleSearchInput}
          onKeyDown={handleKeyDown}
          placeholder="Jump to folder..."
          autofocus
        />
        <Show
          when={!folders.loading}
          fallback={<div class="loading">Loading folders...</div>}
        >
          <Show when={matches().length > 0}>
            <ul class="quick-jump-results">
              <For each={matches()}>
                {(folder, index) => (
                  <li
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
        </Show>
      </div>
    </div>
  );
};
