import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES } from "@api/types";
import { DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchAndFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  categoryFilter: PrepCategory | "";
  onCategoryChange: (val: PrepCategory | "") => void;
  difficultyFilter: Difficulty | "";
  onDifficultyChange: (val: Difficulty | "") => void;
  onClearAll: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const SearchAndFilters = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  difficultyFilter,
  onDifficultyChange,
  onClearAll,
  showFilters,
  onToggleFilters,
}: SearchAndFiltersProps) => {
  const hasFilters = !!(categoryFilter || difficultyFilter);
  const activeFilterCount = (categoryFilter ? 1 : 0) + (difficultyFilter ? 1 : 0);

  return (
    <div className="mb-5 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-questions" className="sr-only">Search questions</label>
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            id="search-questions"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, topic, or tag..."
            className="glass-card h-10 w-full rounded-xl pl-10 pr-9 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={onToggleFilters}
          className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all ${
            showFilters || hasFilters
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="glass-card animate-slide-up rounded-xl p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
            {PREP_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(categoryFilter === cat.value ? "" : cat.value)}
                className={`${CHIP_BASE} ${categoryFilter === cat.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => onDifficultyChange(difficultyFilter === d.value ? "" : d.value)}
                className={`${CHIP_BASE} ${
                  difficultyFilter === d.value ? DIFFICULTY_COLORS[d.value] : CHIP_INACTIVE
                }`}
              >
                {d.label}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={onClearAll}
                className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active filter pills (when panel collapsed) */}
      {!showFilters && hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground mr-0.5">Filtered by:</span>
          {categoryFilter && (
            <button
              onClick={() => onCategoryChange("")}
              className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              {PREP_CATEGORIES.find((c) => c.value === categoryFilter)?.label}
              <X className="h-3 w-3" />
            </button>
          )}
          {difficultyFilter && (
            <button
              onClick={() => onDifficultyChange("")}
              className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              {difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
