import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // On mobile, show limited page numbers to avoid overflow
  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-1 pb-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="flex h-9 md:h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>
      {getVisiblePages().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground/50">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 md:h-8 md:min-w-8 rounded-lg text-xs font-medium transition-all active:scale-[0.95] ${
              page === currentPage
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="flex h-9 md:h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default Pagination;
