// src/components/Gallery/Controls.tsx
import { createSignal, createEffect } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';

interface ControlsProps {
  currentPath: string;
  currentSearch: string;
  viewMode: 'grid' | 'list';
  currentSort: 'name' | 'date' | 'size';
  onSearch: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sort: 'name' | 'date' | 'size') => void;
}

export const Controls = (props: ControlsProps) => {
  const [searchValue, setSearchValue] = createSignal(props.currentSearch);
  
  const debouncedSearch = debounce((value: string) => {
    props.onSearch(value);
  }, 500);

  createEffect(() => {
    if (searchValue() !== props.currentSearch) {
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
          value={props.viewMode}
          onChange={(e) => props.onViewModeChange(e.currentTarget.value as 'grid' | 'list')}
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <select 
          name="sort-by"
          value={props.currentSort}
          onChange={(e) => props.onSortChange(e.currentTarget.value as 'name' | 'date' | 'size')}
        >
          <option value="name">Name</option>
          <option value="date">Modified</option>
          <option value="size">Size</option>
        </select>
      </div>
    </div>
  );
};