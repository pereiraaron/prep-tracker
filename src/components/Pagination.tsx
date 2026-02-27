import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="btn-outline text-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LuChevronLeft />
        Previous
      </button>
      <span className="text-sm text-(--muted-foreground) px-2">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn-outline text-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <LuChevronRight />
      </button>
    </div>
  )
}

export default Pagination
