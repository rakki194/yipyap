// src/components/Gallery/Controls.tsx
import { createSignal, createEffect } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { useGallery } from "~/contexts/GalleryContext";

export const Controls = () => {
  const { state, actions } = useGallery();
  const [searchValue, setSearchValue] = createSignal(state.search);

  const debouncedSearch = debounce((value: string) => {
    actions.setSearch(value);
  }, 500);

  createEffect(() => {
    if (searchValue() !== state.search) {
      debouncedSearch(searchValue());
    }
  });

  return (
    <div class="controls">
      <div class="filters">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={searchValue()}
          onInput={(e) => setSearchValue(e.currentTarget.value)}
        />
        <select
          name="view-mode"
          value={state.viewMode}
          onChange={(e) =>
            actions.setViewMode(e.currentTarget.value as "grid" | "list")
          }
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <select
          name="sort-by"
          value={state.sort}
          onChange={(e) =>
            actions.setSort(e.currentTarget.value as "name" | "date" | "size")
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
