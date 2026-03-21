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
import StatsSidebar from "@components/StatsSidebar";
import SearchAndFilters from "@components/questions/SearchAndFilters";
import QuestionRow from "@components/questions/QuestionRow";
import ColumnHeader from "@components/questions/ColumnHeader";
import { useQuestionsList, useQuestionsInfinite, useDeleteQuestion, useStarQuestion } from "@queries/useQuestions";
import type { PrepCategory, Difficulty } from "@api/types";
import { BookOpen, Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@components/ui/sonner";

const ITEMS_PER_PAGE = 15;

const QuestionsPage = () => {
  usePageTitle("Questions");
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PrepCategory | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("-solvedAt");

  const debouncedSearch = useDebouncedValue(search, 300);

  const handleSort = (field: string) => {
    setSort((prev) => (prev === `-${field}` ? field : `-${field}`));
    setCurrentPage(1);
  };

  const filterParams = {
    search: debouncedSearch || undefined,
    status: "solved" as const,
    category: categoryFilter || undefined,
    difficulty: difficultyFilter || undefined,
    sort,
  };

  // Only run the query for the current mode
  const paginatedQuery = useQuestionsList({
    ...filterParams,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  }, !isMobile);

  const infiniteQuery = useQuestionsInfinite({
    ...filterParams,
    limit: ITEMS_PER_PAGE,
    enabled: isMobile,
  });

  // Derive data based on mode
  const questions = isMobile
    ? infiniteQuery.data?.pages.flatMap((p) => p.data) ?? []
    : paginatedQuery.data?.data ?? [];

  const isLoading = isMobile ? infiniteQuery.isLoading : paginatedQuery.isLoading;
  const pagination = paginatedQuery.data?.pagination ?? null;
  const totalPages = pagination?.totalPages ?? 1;

  // Total count — use whichever query has data
  const total = isMobile
    ? infiniteQuery.data?.pages[0]?.pagination.total ?? 0
    : pagination?.total ?? 0;

  const deleteMutation = useDeleteQuestion();
  const starMutation = useStarQuestion();

  const resetPage = () => setCurrentPage(1);
  const handleSearch = (val: string) => { setSearch(val); resetPage(); };
  const handleCategoryFilter = (val: PrepCategory | "") => { setCategoryFilter(val); resetPage(); };
  const handleDifficultyFilter = (val: Difficulty | "") => { setDifficultyFilter(val); resetPage(); };
  const clearAll = () => { setSearch(""); setCategoryFilter(""); setDifficultyFilter(""); resetPage(); };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const hasFilters = !!(search || categoryFilter || difficultyFilter);

  return (
    <Layout>
      <PageHeader
        icon={BookOpen}
        title="Questions"
        subtitle={total > 0 ? "Your solved questions library" : "Your solved questions will appear here"}
        count={total}
        actions={
          <Link
            to="/question/new"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Question</span>
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
          ) : questions.length === 0 ? (
            hasFilters ? (
              <EmptyState
                icon={Search}
                title="No matching questions"
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
                icon={BookOpen}
                iconBg="bg-primary/5"
                title="No questions yet"
                description="Log your first solved question to start building your library"
                action={
                  <PrimaryButton to="/question/new">
                    <Plus className="h-4 w-4" />
                    Log your first question
                  </PrimaryButton>
                }
              />
            )
          ) : (
            <>
              {/* Desktop: column header with count */}
              {!isMobile && (
                <ColumnHeader currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} total={total} sort={sort} onSort={handleSort} />
              )}

              {/* Mobile: simple count */}
              {isMobile && (
                <div className="mb-1 px-3 text-[11px] font-medium text-muted-foreground/60">
                  {total} question{total === 1 ? "" : "s"}
                </div>
              )}

              <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                {questions.map((q, i) => (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    index={i}
                    onStar={(id) => starMutation.mutate(id)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Mobile: infinite scroll trigger */}
              {isMobile && (
                <InfiniteScrollTrigger
                  onTrigger={() => infiniteQuery.fetchNextPage()}
                  hasMore={infiniteQuery.hasNextPage ?? false}
                  isLoading={infiniteQuery.isFetchingNextPage}
                />
              )}

              {/* Desktop: pagination */}
              {!isMobile && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </div>

        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-8">
          <StatsSidebar />
        </aside>
      </div>
    </Layout>
  );
};

export default QuestionsPage;
