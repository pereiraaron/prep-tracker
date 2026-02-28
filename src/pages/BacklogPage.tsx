import usePageTitle from "@hooks/usePageTitle";
import { useState, useEffect } from "react";
import Layout from "@components/Layout";
import useBacklog from "@hooks/useBacklog";
import { CATEGORY_LABEL } from "@api/types";
import type { PrepCategory } from "@api/types";
import { toast } from "@components/ui/sonner";
import {
  Star,
  Trash2,
  ExternalLink,
  CheckCircle,
  Plus,
  Archive,
  Loader2,
} from "lucide-react";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const BacklogPage = () => {
  usePageTitle("Backlog");
  const [solvingId, setSolvingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const {
    items: backlog,
    isLoading,
    creating,
    fetchBacklog,
    createBacklogItem,
    deleteBacklogItem,
    starBacklogItem,
    solveBacklogItem,
  } = useBacklog();

  useEffect(() => {
    fetchBacklog();
  }, [fetchBacklog]);

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    try {
      await createBacklogItem({ title });
      setNewTitle("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBacklogItem(id);
      toast.success("Removed from backlog");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleSolve = async (id: string, category: string) => {
    try {
      await solveBacklogItem(id, category as PrepCategory);
      toast.success("Marked as solved");
      setSolvingId(null);
    } catch {
      toast.error("Failed to mark as solved");
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stat-orange/10 text-stat-orange">
            <Archive className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Backlog</h1>
            <p className="text-sm text-muted-foreground">
              {backlog.length === 0
                ? "Save questions you want to tackle later"
                : `${backlog.length} question${backlog.length === 1 ? "" : "s"} saved for later`}
            </p>
          </div>
        </div>
      </div>

      {/* Add form */}
      <div className="glass-card mb-6 rounded-xl p-4">
        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a question to solve later..."
            className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-base md:text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
            disabled={creating}
          />
          <button
            onClick={handleAdd}
            disabled={creating || !newTitle.trim()}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-40"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {backlog.map((q) => (
            <div
              key={q.id}
              className="glass-card flex items-center gap-4 rounded-xl p-5 transition-all hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-bold">{q.title}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {q.difficulty && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${difficultyColors[q.difficulty] || ""}`}
                    >
                      {q.difficulty}
                    </span>
                  )}
                  {q.topic && (
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground">
                      {q.topic}
                    </span>
                  )}
                  {q.source && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {q.source}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {q.url && (
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => starBacklogItem(q.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-stat-orange transition-colors hover:bg-stat-orange/10"
                >
                  <Star
                    className={`h-4 w-4 ${q.starred ? "fill-stat-orange text-stat-orange" : ""}`}
                  />
                </button>

                {solvingId === q.id ? (
                  <select
                    autoFocus
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSolve(q.id, e.target.value);
                      }
                    }}
                    onBlur={() => setSolvingId(null)}
                    className="h-8 rounded-lg border border-border bg-card px-2 text-xs outline-none"
                  >
                    <option value="">Pick category...</option>
                    {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => setSolvingId(q.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:text-accent transition-colors hover:bg-accent/10"
                    title="Mark as solved"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(q.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {backlog.length === 0 && !isLoading && (
            <div className="py-16 text-center">
              <Archive className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="font-display font-medium">Backlog is empty</p>
              <p className="text-sm text-muted-foreground">
                Add questions you want to solve later
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default BacklogPage;
