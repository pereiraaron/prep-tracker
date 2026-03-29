import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
import { useQuestionsList } from "@queries/useQuestions";
import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES } from "@api/types";
import { DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";
import { Shuffle, ArrowRight, RotateCcw, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const RevisionPage = () => {
  usePageTitle("Revision Mode");
  const [categoryFilter, setCategoryFilter] = useState<PrepCategory | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [seed, setSeed] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuestionsList({
    status: "solved",
    category: categoryFilter || undefined,
    difficulty: difficultyFilter || undefined,
    limit: 100,
  });

  const allQuestions = data?.data ?? [];

  // Shuffle deterministically based on seed
  const shuffled = [...allQuestions].sort(() => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x) - 0.5;
  });

  const questions = shuffled.slice(0, 5);

  const handleShuffle = () => setSeed((s) => s + 1);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const hasFilters = !!(categoryFilter || difficultyFilter);

  return (
    <Layout>
      <PageHeader
        icon={Shuffle}
        iconColor="bg-stat-purple/10 text-stat-purple"
        title="Revision Mode"
        subtitle="Review solved questions to keep them fresh"
        actions={
          <button
            onClick={handleShuffle}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Filter className="h-3.5 w-3.5" />
          {showFilters ? "Hide filters" : "Filter by category or difficulty"}
          {hasFilters && (
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {[categoryFilter, difficultyFilter].filter(Boolean).length}
            </span>
          )}
        </button>
        {showFilters && (
          <div className="mt-3 glass-card rounded-xl p-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter("")}
                  className={`${CHIP_BASE} ${!categoryFilter ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                >
                  All
                </button>
                {PREP_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategoryFilter(categoryFilter === c.value ? "" : c.value)}
                    className={`${CHIP_BASE} ${categoryFilter === c.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">Difficulty</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficultyFilter("")}
                  className={`${CHIP_BASE} ${!difficultyFilter ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                >
                  All
                </button>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficultyFilter(difficultyFilter === d.value ? "" : d.value)}
                    className={`${CHIP_BASE} ${difficultyFilter === d.value ? DIFFICULTY_COLORS[d.value] : CHIP_INACTIVE}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setCategoryFilter(""); setDifficultyFilter(""); }}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-3 w-40 rounded bg-muted/60 animate-pulse mb-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card flex items-center gap-4 rounded-xl p-4 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-9 w-9 shrink-0 rounded-lg bg-muted/60" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-3/5 rounded bg-muted/60" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-14 rounded-md bg-muted/60" />
                  <div className="h-4 w-16 rounded-md bg-muted/60" />
                  <div className="h-3 w-12 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-4 w-4 shrink-0 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      ) : allQuestions.length === 0 ? (
        <div className="glass-card rounded-xl py-16 text-center">
          <Shuffle className="mx-auto mb-3 h-7 w-7 text-muted-foreground/30" />
          <p className="font-display font-medium text-sm">No solved questions to review</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasFilters ? "Try adjusting your filters" : "Solve some questions first, then come back to review"}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground">
            Showing {questions.length} of {allQuestions.length} solved question{allQuestions.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <Link
                key={q.id}
                to={`/questions/${q.id}`}
                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:shadow-sm hover:bg-card/80 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stat-purple/10 text-stat-purple font-display text-sm font-bold">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {q.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {q.difficulty && <DifficultyBadge value={q.difficulty} />}
                    {q.category && <CategoryBadge value={q.category} />}
                    {q.solvedAt && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(q.solvedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary active:scale-[0.98] transition-all"
            >
              <Shuffle className="h-4 w-4" />
              Show different questions
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default RevisionPage;
