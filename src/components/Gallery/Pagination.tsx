// src/components/Gallery/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = (props: PaginationProps) => {
  const pages = () => {
    const pages = [];
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div class="pagination">
      <button 
        class="prev" 
        disabled={props.currentPage === 1}
        onClick={() => props.onPageChange(props.currentPage - 1)}
      >
        <i class="ri-arrow-left-line" />
      </button>
      
      {pages().map(page => (
        <button 
          class={page === props.currentPage ? 'active' : ''}
          onClick={() => props.onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button 
        class="next"
        disabled={props.currentPage === props.totalPages}
        onClick={() => props.onPageChange(props.currentPage + 1)}
      >
        <i class="ri-arrow-right-line" />
      </button>
    </div>
  );
};