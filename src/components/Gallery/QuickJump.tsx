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
    if (e.key === "Escape") {
      props.onClose();
    } else if (e.key === "Enter" && matches().length === 1) {
      handleSelect(matches()[0]);
    }
  };

  return (
    <div class="quick-jump-overlay" onClick={props.onClose}>
      <div class="quick-jump-modal card" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
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
                {(folder) => (
                  <li onClick={() => handleSelect(folder)}>
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
