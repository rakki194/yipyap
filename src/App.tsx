// src/App.tsx
import { createSignal, createEffect } from 'solid-js';
import { Gallery } from './components/Gallery/Gallery';
import { ImageInfo, DirectoryItem } from './types'; // Assuming you have these types defined

const App = () => {
  const [items, setItems] = createSignal<(ImageInfo | DirectoryItem)[]>([]);
  const [currentPath, setCurrentPath] = createSignal('');
  const [parentPath, setParentPath] = createSignal('');
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid');
  const [currentSort, setCurrentSort] = createSignal<'name' | 'date' | 'size'>('name');
  const [currentSearch, setCurrentSearch] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);

  // Fetch data from the server (you can adjust the URL as needed)
  const fetchData = async () => {
    const response = await fetch(`/api/browse?path=${currentPath()}&page=${currentPage()}&sort=${currentSort()}&search=${currentSearch()}`);
    const data = await response.json();
    setItems(data.items);
    setTotalPages(data.totalPages);
  };

  createEffect(() => {
    fetchData();
  });

  return (
    <div>
      <Gallery
        currentPath={currentPath()}
        parentPath={parentPath()}
        items={items()}
        viewMode={viewMode()}
        currentSort={currentSort()}
        currentSearch={currentSearch()}
        currentPage={currentPage()}
        totalPages={totalPages()}
        onSearch={setCurrentSearch}
        onViewModeChange={setViewMode}
        onSortChange={setCurrentSort}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App;