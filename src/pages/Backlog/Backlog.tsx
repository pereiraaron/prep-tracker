import { useCallback, useEffect, useState } from "react";
import { LuPlus, LuFilter, LuArchive } from "react-icons/lu";
import { questionsApi } from "@api/questions";
import type { Question, QuestionStatus } from "@api/questions";
import type { Difficulty, PrepCategory } from "@api/types";
import PageContainer from "@components/PageContainer";
import Card from "@components/Card";
import { ErrorState } from "@components/EmptyState";
import BacklogFilters from "./components/BacklogFilters";
import QuestionCard from "./components/QuestionCard";

const Backlog = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const fetchBacklog = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await questionsApi.getBacklog({
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(source ? { source } : {}),
        ...(status ? { status: status as QuestionStatus } : {}),
        ...(category ? { topic: category } : {}),
      });
      setQuestions(data.data);
      setTotalCount(data.pagination.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, status, source]);

  useEffect(() => {
    fetchBacklog();
  }, [fetchBacklog]);

  const handleQuickAdd = async () => {
    if (!newTitle.trim()) return;
    try {
      await questionsApi.createBacklog({ title: newTitle.trim() });
      setNewTitle("");
      fetchBacklog();
    } catch {
      // input stays for retry
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await questionsApi.delete(id);
      fetchBacklog();
    } catch {
      // Question stays in list
    }
  };

  const handleStar = async (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
    );
    try {
      await questionsApi.star(id);
    } catch {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
      );
    }
  };

  const handleSolve = async (id: string, cat: PrepCategory) => {
    try {
      await questionsApi.update(id, { category: cat });
      await questionsApi.solve(id);
      fetchBacklog();
    } catch {
      // Question stays in backlog
    }
  };

  const clearFilters = () => {
    setCategory("");
    setDifficulty("");
    setStatus("");
    setSource("");
  };

  const hasFilters = !!(category || difficulty || status || source);

  return (
    <PageContainer>
      {/* Header with icon */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <LuArchive size={20} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold">Backlog</h1>
            {!loading && (
              <p className="text-sm text-(--muted-foreground)">
                {totalCount} question{totalCount !== 1 ? "s" : ""} saved for later
              </p>
            )}
          </div>
        </div>

        <button
          aria-label="Toggle filters"
          className={`p-1.5 rounded-lg transition-colors md:hidden ${
            hasFilters
              ? "bg-(--color-primary) text-primary-foreground"
              : "border border-(--border) hover:bg-(--secondary)"
          }`}
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          <LuFilter size={18} />
        </button>
      </div>

      {/* Inline add form */}
      <Card className="mb-4 p-4!">
        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleQuickAdd(); }}
            placeholder="Add a question to solve later..."
            className="flex-1 text-sm border-none outline-none bg-transparent"
          />
          <button
            className="btn-primary text-sm"
            onClick={handleQuickAdd}
            disabled={!newTitle.trim()}
          >
            <LuPlus /> Add
          </button>
        </div>
      </Card>

      {/* Filters */}
      <BacklogFilters
        category={category}
        difficulty={difficulty}
        status={status}
        source={source}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        showMobile={showMobileFilters}
      />

      {/* Loading */}
      {loading && questions.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && <ErrorState onRetry={fetchBacklog} />}

      {/* Empty state */}
      {!loading && !error && questions.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-(--muted-foreground) text-lg">
            {hasFilters ? "No questions match the filters" : "Backlog is empty"}
          </p>
          {hasFilters && (
            <button className="btn-outline text-sm" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Question list */}
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onDelete={() => handleDelete(q.id)}
            onStar={() => handleStar(q.id)}
            onSolve={(cat) => handleSolve(q.id, cat)}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Backlog;
