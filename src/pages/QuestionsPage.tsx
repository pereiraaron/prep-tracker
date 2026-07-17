import usePageTitle from "@hooks/usePageTitle";
import useIsMobile from "@hooks/useIsMobile";
import useIsLg from "@hooks/useIsLg";
import useDebouncedValue from "@hooks/useDebouncedValue";
import useQuestionsFilter from "@hooks/useQuestionsFilter";
import { useEffect } from "react";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import EmptyState from "@components/EmptyState";
import { QuestionsListSkeleton } from "@components/Skeleton";
import Pagination from "@components/Pagination";
import PrimaryButton from "@components/PrimaryButton";
import VirtualList from "@components/VirtualList";
import StatsSidebar from "@components/StatsSidebar";
import SearchAndFilters from "@components/questions/SearchAndFilters";
import QuestionRow from "@components/questions/QuestionRow";
import ColumnHeader from "@components/questions/ColumnHeader";
import { Button } from "@components/ui/button";
import { useQuestionsList, useQuestionsInfinite, useDeleteQuestion, useStarQuestion } from "@queries/useQuestions";
import { useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@api/questions";
import { queryKeys } from "@lib/queryKeys";
import type { PrepCategory, Difficulty } from "@api/types";
import { BookOpen, Plus, Search, X } from "lucide-react";
import { toast } from "@components/ui/sonner";

const ITEMS_PER_PAGE = 15;

const QuestionsPage = () => {
  usePageTitle("Questions");
  const isMobile = useIsMobile();
  const isLg = useIsLg();
  const queryClient = useQueryClient();
  const {
    search, setSearch,
    categoryFilter, setCategoryFilter,
    difficultyFilter, setDifficultyFilter,
    currentPage, setCurrentPage,
    showFilters, setShowFilters,
    sort, setSort,
    clearAll,
  } = useQuestionsFilter();

  const debouncedSearch = useDebouncedValue(search, 300);

  const handleSort = (field: string) => {
    setSort(sort === `-${field}` ? field : `-${field}`);
  };

  const filterParams = {
    search: debouncedSearch || undefined,
    status: "solved" as const,
    category: categoryFilter || undefined,
    difficulty: difficultyFilter || undefined,
    sort,
  };

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

  const questions = isMobile
    ? infiniteQuery.data?.pages.flatMap((p) => p.data) ?? []
    : paginatedQuery.data?.data ?? [];

  const isLoading = isMobile ? infiniteQuery.isLoading : paginatedQuery.isLoading;
  const isFetching = isMobile ? infiniteQuery.isFetching : paginatedQuery.isFetching;
  const isTransitioning = isFetching && !isLoading;
  const pagination = paginatedQuery.data?.pagination ?? null;
  const totalPages = pagination?.totalPages ?? 1;

  const total = isMobile
    ? infiniteQuery.data?.pages[0]?.pagination.total ?? 0
    : pagination?.total ?? 0;

  useEffect(() => {
    if (isMobile || currentPage >= totalPages) return;
    const nextParams = { ...filterParams, page: currentPage + 1, limit: ITEMS_PER_PAGE };
    queryClient.prefetchQuery({
      queryKey: queryKeys.questions.list(nextParams),
      queryFn: () =>
        debouncedSearch
          ? questionsApi.search(debouncedSearch, {
              status: "solved",
              difficulty: filterParams.difficulty,
              category: filterParams.category,
              page: currentPage + 1,
              limit: ITEMS_PER_PAGE,
            })
          : questionsApi.getAll({ ...filterParams, page: currentPage + 1, limit: ITEMS_PER_PAGE }),
      staleTime: 30_000,
    });
  }, [isMobile, currentPage, totalPages, debouncedSearch, categoryFilter, difficultyFilter, sort, queryClient]);

  const deleteMutation = useDeleteQuestion();
  const starMutation = useStarQuestion();

  const handleSearch = (val: string) => setSearch(val);
  const handleCategoryFilter = (val: PrepCategory | "") => setCategoryFilter(val);
  const handleDifficultyFilter = (val: Difficulty | "") => setDifficultyFilter(val);

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
        iconColor="bg-stat-green/10 text-stat-green"
        countColor="bg-stat-green/10 text-stat-green"
        title="Questions"
        subtitle={total > 0 ? "Your solved questions library" : "Your solved questions will appear here"}
        count={total}
        actions={
          <PrimaryButton to="/question/new" size="sm" className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Question</span>
          </PrimaryButton>
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
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <X className="h-3 w-3" />
                    Clear all filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={BookOpen}
                iconBg="from-stat-green/15 via-stat-green/8 to-transparent"
                title="No questions yet"
                description="Log your first solved question to start building your library"
                tip="Start with an Easy DSA problem you've done recently — it only takes a minute."
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
              <div className={`glass-card rounded-xl overflow-hidden transition-opacity duration-200 ${isTransitioning ? "opacity-40 pointer-events-none" : ""}`}>
                {!isMobile && (
                  <ColumnHeader
                    sticky
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    total={total}
                    sort={sort}
                    onSort={handleSort}
                  />
                )}

                {isMobile && (
                  <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground/60 border-b border-border">
                    {total} question{total === 1 ? "" : "s"}
                  </div>
                )}

                {isMobile ? (
                  <VirtualList
                    items={questions}
                    getKey={(q) => q.id}
                    estimateSize={72}
                    onNearEnd={() => infiniteQuery.fetchNextPage()}
                    hasMore={infiniteQuery.hasNextPage ?? false}
                    isLoadingMore={infiniteQuery.isFetchingNextPage}
                    renderItem={(q, i) => (
                      <QuestionRow
                        question={q}
                        index={i}
                        onStar={(id) => starMutation.mutate(id)}
                        onDelete={handleDelete}
                      />
                    )}
                  />
                ) : (
                  <div className="divide-y divide-border">
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
                )}
              </div>

              {!isMobile && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </div>

        {isLg && (
          <aside className="w-72 xl:w-80 shrink-0 sticky top-8">
            <StatsSidebar />
          </aside>
        )}
      </div>
    </Layout>
  );
};

export default QuestionsPage;
