import type { Question } from "@api/questions";
import { questionsApi } from "@api/questions";
import { SOURCE_LABEL } from "@api/types";
import { capitalize, CATEGORY_BORDER_COLORS } from "@lib/styles";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
import IconButton from "@components/IconButton";
import { queryKeys } from "@lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Star, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface QuestionRowProps {
  question: Question;
  index: number;
  onStar: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const QuestionRow = ({ question: q, index, onStar, onDelete }: QuestionRowProps) => {
  const queryClient = useQueryClient();
  const borderColor = q.category ? CATEGORY_BORDER_COLORS[q.category] || "border-l-border" : "border-l-border";
  const sourceLabel = q.source ? SOURCE_LABEL[q.source] || q.source : null;

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPrefetch = () => {
    hoverTimer.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.questions.detail(q.id),
        queryFn: () => questionsApi.getById(q.id),
        staleTime: 30_000,
      });
    }, 500);
  };

  const cancelPrefetch = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  return (
    <Link
      to={`/questions/${q.id}`}
      onMouseEnter={startPrefetch}
      onMouseLeave={cancelPrefetch}
      onFocus={startPrefetch}
      onBlur={cancelPrefetch}
      className={`group flex items-center gap-3 border-l-[3px] ${borderColor} px-3 sm:px-4 py-3 md:py-2.5 transition-all hover:bg-secondary/40 animate-slide-up`}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* Star */}
      <IconButton
        label={q.starred ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.preventDefault();
          onStar(q.id);
        }}
        className={`shrink-0 rounded p-0.5 transition-colors ${
          q.starred ? "text-stat-orange" : "text-border hover:text-stat-orange"
        }`}
      >
        <Star className={`h-3.5 w-3.5 ${q.starred ? "fill-stat-orange" : ""}`} />
      </IconButton>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-[13px] font-semibold group-hover:text-primary transition-colors truncate">
            {q.title}
          </span>
          {q.difficulty && (
            <span className="md:hidden">
              <DifficultyBadge value={q.difficulty} />
            </span>
          )}
          {q.category && (
            <span className="hidden sm:inline md:hidden">
              <CategoryBadge value={q.category} />
            </span>
          )}
          {q.topics?.length > 0 && q.topics.map((t) => (
            <span key={t} className="hidden lg:inline rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {capitalize(t)}
            </span>
          ))}
        </div>
        {/* Mobile-only: source + date */}
        <div className="flex items-center gap-2 mt-0.5 md:hidden">
          {sourceLabel && <span className="text-[10px] font-mono text-muted-foreground/60">{sourceLabel}</span>}
          {q.solvedAt && <span className="text-[10px] text-muted-foreground/50">{formatDate(q.solvedAt)}</span>}
        </div>
      </div>

      {/* Mobile actions — always visible */}
      <div className="flex md:hidden shrink-0 items-center gap-0.5">
        {q.url && (
          <IconButton
            label="Open problem"
            onClick={(e) => {
              e.preventDefault();
              window.open(q.url, "_blank");
            }}
            className="rounded-md p-1.5 text-muted-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </IconButton>
        )}
      </div>

      {/* Desktop: difficulty, category, source, date, hover-actions */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <span className="w-16 flex justify-center">
          {q.difficulty ? (
            <DifficultyBadge value={q.difficulty} />
          ) : (
            <span className="text-[11px] text-muted-foreground/50">—</span>
          )}
        </span>
        <span className="w-40 flex justify-center">
          {q.category ? (
            <CategoryBadge value={q.category} />
          ) : (
            <span className="text-[11px] text-muted-foreground/50">—</span>
          )}
        </span>
        <span className="w-28 text-center text-[11px] font-mono text-muted-foreground/50">{sourceLabel || "—"}</span>
        <span className="w-24 text-center text-[11px] text-muted-foreground/50 tabular-nums">
          {q.solvedAt ? formatDate(q.solvedAt) : "—"}
        </span>
        <div className="flex items-center w-24 justify-end gap-0.5">
          {q.url && (
            <IconButton
              label="Open problem"
              onClick={(e) => {
                e.preventDefault();
                window.open(q.url, "_blank");
              }}
              className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </IconButton>
          )}
          <IconButton
            label="Delete question"
            onClick={(e) => onDelete(q.id, e)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </Link>
  );
};

export default QuestionRow;
