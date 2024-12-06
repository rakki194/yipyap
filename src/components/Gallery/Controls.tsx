// src/components/Gallery/Controls.tsx

import { createSignal, createEffect } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import "./Controls.css";

export const Controls = () => {
  const gallery = useGallery();
  const [searchValue, setSearchValue] = createSignal(gallery.state.search);

  const debouncedSearch = debounce((value: string) => {
    gallery.setSearch(value);
  }, 500);

  createEffect(() => {
    if (searchValue() !== gallery.state.search) {
      debouncedSearch(searchValue());
    }
  });

  return (
    <div class="controls">
      <div class="filters">
        <div class="search-wrapper">
          <span class="icon">{getIcon("search")}</span>
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={searchValue()}
            onInput={(e) => setSearchValue(e.currentTarget.value)}
          />
        </div>
        <select
          name="view-mode"
          value={gallery.state.viewMode}
          onChange={(e) =>
            gallery.setViewMode(e.currentTarget.value as "grid" | "list")
          }
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <select
          name="sort-by"
          value={gallery.state.sort}
          onChange={(e) =>
            gallery.setSort(e.currentTarget.value as "name" | "date" | "size")
          }
        >
          <option value="name">Name</option>
          <option value="date">Modified</option>
          <option value="size">Size</option>
        </select>
      </div>
    </div>
  );
};
