import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ColumnHeaderProps {
  currentPage: number;
  itemsPerPage: number;
  total: number;
  sort?: string;
  onSort?: (field: string) => void;
  dateField?: string;
}

const SortableColumn = ({
  label,
  field,
  sort,
  onSort,
  className = "",
}: {
  label: string;
  field: string;
  sort?: string;
  onSort?: (field: string) => void;
  className?: string;
}) => {
  const isActive = sort === field || sort === `-${field}`;
  const isAsc = sort === field;

  return (
    <button
      onClick={() => onSort?.(field)}
      className={`flex items-center justify-center gap-1 hover:text-foreground transition-colors ${
        isActive ? "text-foreground" : ""
      } ${className}`}
    >
      {label}
      {isActive ? (
        isAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-2.5 w-2.5 opacity-40" />
      )}
    </button>
  );
};

const ColumnHeader = ({ currentPage, itemsPerPage, total, sort, onSort, dateField = "solvedAt" }: ColumnHeaderProps) => (
  <div className="mb-1 flex items-center justify-between px-4 text-[11px] font-medium text-muted-foreground/60">
    <span>
      Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} of {total}
    </span>
    <div className="hidden md:flex items-center gap-4">
      <SortableColumn label="Difficulty" field="difficulty" sort={sort} onSort={onSort} className="w-16" />
      <span className="w-40 text-center">Category</span>
      <span className="w-28 text-center">Source</span>
      <SortableColumn label="Date" field={dateField} sort={sort} onSort={onSort} className="w-24" />
      <span className="w-24" />
    </div>
  </div>
);

export default ColumnHeader;
