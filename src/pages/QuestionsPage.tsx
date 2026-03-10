import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import { useQuestionsList, useDeleteQuestion, useStarQuestion } from "@queries/useQuestions";
import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES } from "@api/types";
import { DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";
import { DifficultyBadge, CategoryBadge, TopicBadge, SourceBadge, TagBadge, CompanyTagBadge } from "@components/Badge";
import {
  Search,
  Plus,
  Star,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@components/ui/sonner";

const ITEMS_PER_PAGE = 10;


const QuestionsPage = () => {
  usePageTitle("Questions");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PrepCategory | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
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

  const hasFilters = !!(categoryFilter || difficultyFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-lg md:text-xl font-bold">Questions</h1>
          <p className="text-sm text-muted-foreground truncate">
            {total > 0 ? `${total} solved question${total === 1 ? "" : "s"}` : "Your solved questions will appear here"}
          </p>
        </div>
        <Link
          to="/question/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Question</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search questions..."
            className="glass-card h-11 w-full rounded-xl pl-10 pr-4 text-base md:text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-4 md:mb-5 space-y-2 md:space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Category</span>
          {PREP_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryFilter(categoryFilter === cat.value ? "" : cat.value)}
              className={`${CHIP_BASE} ${categoryFilter === cat.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Difficulty</span>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => handleDifficultyFilter(difficultyFilter === d.value ? "" : d.value)}
              className={`${CHIP_BASE} ${
                difficultyFilter === d.value
                  ? DIFFICULTY_COLORS[d.value]
                  : CHIP_INACTIVE
              }`}
            >
              {d.label}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={() => {
                setCategoryFilter("");
                setDifficultyFilter("");
                setCurrentPage(1);
              }}
              className="ml-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
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

      {/* Question List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {questions.map((q) => (
            <Link
              key={q.id}
              to={`/questions/${q.id}`}
              className="glass-card group flex items-start gap-4 rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="min-w-0 flex-1 space-y-2">
                {/* Title row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-sm font-bold group-hover:text-primary transition-colors">
                    {q.title}
                  </h3>
                  {q.difficulty && <DifficultyBadge value={q.difficulty} />}
                  {q.category && <CategoryBadge value={q.category} />}
                </div>

                {/* Tags row */}
                {(q.topic || q.tags.length > 0 || q.companyTags.length > 0 || q.source) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {q.topic && <TopicBadge value={q.topic} />}
                    {q.source && <SourceBadge value={q.source} />}
                    {q.tags.map((tag) => <TagBadge key={tag} value={tag} />)}
                    {q.companyTags.map((tag) => <CompanyTagBadge key={tag} value={tag} />)}
                  </div>
                )}

                {/* Date */}
                {q.solvedAt && (
                  <p className="text-[10px] text-muted-foreground/60">
                    Solved {formatDate(q.solvedAt)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-0.5">
                {q.url && (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(q.url, "_blank");
                    }}
                    className="rounded-lg p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    starMutation.mutate(q.id);
                  }}
                  className={`rounded-lg p-2 transition-colors ${q.starred ? "text-stat-orange" : "text-muted-foreground hover:text-stat-orange"}`}
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

          {/* Empty state */}
          {questions.length === 0 && (
            <div className="glass-card flex flex-col items-center rounded-xl py-16 px-6 text-center">
              {search || hasFilters ? (
                <>
                  <Search className="mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="font-display font-semibold">No matching questions</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </>
              ) : (
                <>
                  <BookOpen className="mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="font-display font-semibold">No questions yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Log your first solved question to get started</p>
                  <Link
                    to="/question/new"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    New Question
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5 pb-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-all hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
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
            className="flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-all hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
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
