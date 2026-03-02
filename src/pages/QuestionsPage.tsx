import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import { useQuestionsList, useDeleteQuestion, useStarQuestion } from "@queries/useQuestions";
import type { PrepCategory, Difficulty } from "@api/types";
import { CATEGORY_LABEL } from "@api/types";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Star,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@components/ui/sonner";

const ITEMS_PER_PAGE = 10;

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const categoryColors: Record<string, string> = {
  dsa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  system_design: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  machine_coding: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  language_framework: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  behavioral: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  conceptual: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  theory: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  quiz: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const QuestionsPage = () => {
  usePageTitle("Questions");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PrepCategory | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuestionsList({
    search: search || undefined,
    status: "solved",
    category: categoryFilter || undefined,
    difficulty: difficultyFilter || undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const questions = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const deleteMutation = useDeleteQuestion();
  const starMutation = useStarQuestion();

  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleCategoryFilter = (val: PrepCategory | "") => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };
  const handleDifficultyFilter = (val: Difficulty | "") => {
    setDifficultyFilter(val);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold">Questions</h1>
          <p className="text-sm text-muted-foreground truncate">
            {total > 0 ? `${total} solved question${total === 1 ? "" : "s"}` : "Your solved questions will appear here"}
          </p>
        </div>
        <Link
          to="/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Question</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search questions..."
              className="glass-card h-11 w-full rounded-xl pl-10 pr-4 text-base md:text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-all ${showFilters ? "bg-primary/10 text-primary border-primary/30" : "bg-card hover:bg-secondary"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value as PrepCategory | "")}
              className="h-11 rounded-lg border border-border bg-card px-3 text-base md:text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => handleDifficultyFilter(e.target.value as Difficulty | "")}
              className="h-11 rounded-lg border border-border bg-card px-3 text-base md:text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {(categoryFilter || difficultyFilter) && (
              <button
                onClick={() => {
                  setCategoryFilter("");
                  setDifficultyFilter("");
                }}
                className="h-9 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results info */}
      {total > 0 && (
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total}
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              to={`/questions/${q.id}`}
              className="glass-card group flex items-start justify-between gap-4 rounded-xl p-5 transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
                    {q.title}
                  </h3>
                  {q.difficulty && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${difficultyColors[q.difficulty] || ""}`}
                    >
                      {q.difficulty}
                    </span>
                  )}
                  {q.category && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${categoryColors[q.category] || ""}`}
                    >
                      {CATEGORY_LABEL[q.category] || q.category}
                    </span>
                  )}
                  {q.source && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {q.source}
                    </span>
                  )}
                </div>

                {(q.topic || q.tags.length > 0 || q.companyTags.length > 0) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {q.topic && (
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground">
                        {q.topic}
                      </span>
                    )}
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-primary/5 border border-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary/80"
                      >
                        {tag}
                      </span>
                    ))}
                    {q.companyTags.length > 0 && <span className="mx-1 h-3 w-px bg-border" />}
                    {q.companyTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-stat-blue/5 border border-stat-blue/10 px-2 py-0.5 text-[10px] font-medium text-stat-blue/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {q.url && (
                  <span className="rounded-lg p-2 text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    starMutation.mutate(q.id);
                  }}
                  className={`rounded-lg p-2 transition-colors ${q.starred ? "text-stat-orange" : "text-muted-foreground"}`}
                >
                  <Star className={`h-4 w-4 ${q.starred ? "fill-stat-orange" : ""}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(q.id);
                  }}
                  className="rounded-lg p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Link>
          ))}
          {questions.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              {search || categoryFilter || difficultyFilter ? (
                <>
                  <p className="font-display font-medium">No matching questions</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </>
              ) : (
                <>
                  <p className="font-display font-medium">No questions yet</p>
                  <p className="text-sm text-muted-foreground">Log your first solved question to get started</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-all hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-card hover:bg-secondary"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-all hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </Layout>
  );
};

export default QuestionsPage;
