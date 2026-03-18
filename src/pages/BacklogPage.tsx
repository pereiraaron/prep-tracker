import usePageTitle from "@hooks/usePageTitle";
import useIsMobile from "@hooks/useIsMobile";
import useDebouncedValue from "@hooks/useDebouncedValue";
import { useState } from "react";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import EmptyState from "@components/EmptyState";
import { QuestionsListSkeleton } from "@components/Skeleton";
import Pagination from "@components/Pagination";
import PrimaryButton from "@components/PrimaryButton";
import InfiniteScrollTrigger from "@components/InfiniteScrollTrigger";
import BacklogStatsSidebar from "@components/backlog/BacklogStatsSidebar";
import SearchAndFilters from "@components/questions/SearchAndFilters";
import ColumnHeader from "@components/questions/ColumnHeader";
import BacklogRow from "@components/backlog/BacklogRow";
import SolveDialog from "@components/backlog/SolveDialog";
import {
  useBacklogList,
  useBacklogInfinite,
  useDeleteBacklogItem,
  useStarBacklogItem,
  useSolveBacklogItem,
} from "@queries/useBacklog";
import type { Question } from "@api/questions";
import type { PrepCategory, Difficulty } from "@api/types";
import { Archive, Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@components/ui/sonner";

const ITEMS_PER_PAGE = 15;

const BacklogPage = () => {
  usePageTitle("Backlog");
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PrepCategory | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [solvingItem, setSolvingItem] = useState<Question | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const filterParams = {
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
    difficulty: difficultyFilter || undefined,
  };

  const paginatedQuery = useBacklogList({
    ...filterParams,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  }, !isMobile);

  const infiniteQuery = useBacklogInfinite({
    ...filterParams,
    limit: ITEMS_PER_PAGE,
    enabled: isMobile,
  });

  const backlog = isMobile
    ? infiniteQuery.data?.pages.flatMap((p) => p.data) ?? []
    : paginatedQuery.data?.data ?? [];

  const isLoading = isMobile ? infiniteQuery.isLoading : paginatedQuery.isLoading;
  const pagination = paginatedQuery.data?.pagination ?? null;
  const totalPages = pagination?.totalPages ?? 1;

  const total = isMobile
    ? infiniteQuery.data?.pages[0]?.pagination.total ?? 0
    : pagination?.total ?? 0;

  const deleteMutation = useDeleteBacklogItem();
  const starMutation = useStarBacklogItem();
  const solveMutation = useSolveBacklogItem();

  const resetPage = () => setCurrentPage(1);
  const handleSearch = (val: string) => { setSearch(val); resetPage(); };
  const handleCategoryFilter = (val: PrepCategory | "") => { setCategoryFilter(val); resetPage(); };
  const handleDifficultyFilter = (val: Difficulty | "") => { setDifficultyFilter(val); resetPage(); };
  const clearAll = () => { setSearch(""); setCategoryFilter(""); setDifficultyFilter(""); resetPage(); };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Remove this from your backlog?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Removed from backlog");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleSolve = async (solution: string) => {
    if (!solvingItem) return;
    try {
      await solveMutation.mutateAsync({ id: solvingItem.id, solution });
      toast.success("Marked as solved");
      setSolvingItem(null);
    } catch {
      toast.error("Failed to mark as solved");
    }
  };

  const hasFilters = !!(search || categoryFilter || difficultyFilter);

  return (
    <Layout>
      <PageHeader
        icon={Archive}
        iconColor="bg-stat-orange/10 text-stat-orange"
        title="Backlog"
        subtitle={total > 0 ? "Questions saved for later" : "Save questions you want to tackle later"}
        count={total}
        countColor="bg-stat-orange/10 text-stat-orange"
        actions={
          <Link
            to="/question/new?mode=backlog"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Item</span>
          </Link>
        }
      />

      <div className="flex gap-6 items-start">
        <div className="min-w-0 flex-1">
          <SearchAndFilters
            search={search}
            onSearchChange={handleSearch}
            categoryFilter={categoryFilter}
            onCategoryChange={handleCategoryFilter}
            difficultyFilter={difficultyFilter}
            onDifficultyChange={handleDifficultyFilter}
            onClearAll={clearAll}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {isLoading ? (
            <QuestionsListSkeleton />
          ) : backlog.length === 0 ? (
            hasFilters ? (
              <EmptyState
                icon={Search}
                title="No matching items"
                description="Try adjusting your search or filters"
                action={
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear all filters
                  </button>
                }
              />
            ) : (
              <EmptyState
                icon={Archive}
                iconBg="bg-stat-orange/5"
                title="Backlog is empty"
                description="Add questions you want to solve later"
                action={
                  <PrimaryButton to="/question/new?mode=backlog">
                    <Plus className="h-4 w-4" />
                    Add your first item
                  </PrimaryButton>
                }
              />
            )
          ) : (
            <>
              {!isMobile && (
                <ColumnHeader currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} total={total} />
              )}

              {isMobile && (
                <div className="mb-1 px-3 text-[11px] font-medium text-muted-foreground/60">
                  {total} item{total === 1 ? "" : "s"}
                </div>
              )}

              <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                {backlog.map((q, i) => (
                  <BacklogRow
                    key={q.id}
                    item={q}
                    index={i}
                    onStar={(id) => starMutation.mutate(id)}
                    onDelete={handleDelete}
                    onSolve={(id) => {
                      const item = backlog.find((b) => b.id === id);
                      if (item) setSolvingItem(item);
                    }}
                  />
                ))}
              </div>

              {isMobile && (
                <InfiniteScrollTrigger
                  onTrigger={() => infiniteQuery.fetchNextPage()}
                  hasMore={infiniteQuery.hasNextPage ?? false}
                  isLoading={infiniteQuery.isFetchingNextPage}
                />
              )}

              {!isMobile && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </div>

        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-8">
          <BacklogStatsSidebar />
        </aside>
      </div>

      <SolveDialog
        open={!!solvingItem}
        onOpenChange={(open) => { if (!open) setSolvingItem(null); }}
        onSolve={handleSolve}
        isPending={solveMutation.isPending}
        questionTitle={solvingItem?.title ?? ""}
      />
    </Layout>
  );
};

export default BacklogPage;
