interface ColumnHeaderProps {
  currentPage: number;
  itemsPerPage: number;
  total: number;
}

const ColumnHeader = ({ currentPage, itemsPerPage, total }: ColumnHeaderProps) => (
  <div className="mb-1 flex items-center justify-between px-4 text-[11px] font-medium text-muted-foreground/60">
    <span>
      Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} of {total}
    </span>
    <div className="hidden md:flex items-center gap-12">
      <span className="w-20 text-right">Source</span>
      <span className="w-16 text-right">Date</span>
      <span className="w-24" />
    </div>
  </div>
);

export default ColumnHeader;
