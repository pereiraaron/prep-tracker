import type { Question } from "@api/questions";
import { SOURCE_LABEL } from "@api/types";
import { CATEGORY_BORDER_COLORS } from "@lib/styles";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
import { Star, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface QuestionRowProps {
  question: Question;
  index: number;
  onStar: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const QuestionRow = ({ question: q, index, onStar, onDelete }: QuestionRowProps) => {
  const borderColor = q.category ? CATEGORY_BORDER_COLORS[q.category] || "border-l-border" : "border-l-border";
  const sourceLabel = q.source ? SOURCE_LABEL[q.source] || q.source : null;

  return (
    <Link
      to={`/questions/${q.id}`}
      className={`group flex items-center gap-3 border-l-[3px] ${borderColor} px-3 sm:px-4 py-3 md:py-2.5 transition-colors hover:bg-secondary/50 animate-slide-up`}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* Star */}
      <button
        aria-label={q.starred ? "Unstar" : "Star"}
        onClick={(e) => {
          e.preventDefault();
          onStar(q.id);
        }}
        className={`shrink-0 rounded p-0.5 transition-colors ${
          q.starred ? "text-stat-orange" : "text-border hover:text-stat-orange"
        }`}
      >
        <Star className={`h-3.5 w-3.5 ${q.starred ? "fill-stat-orange" : ""}`} />
      </button>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-[13px] font-semibold group-hover:text-primary transition-colors truncate">
            {q.title}
          </span>
          {q.difficulty && <DifficultyBadge value={q.difficulty} />}
          <span className="hidden sm:inline">{q.category && <CategoryBadge value={q.category} />}</span>
          {q.topic && (
            <span className="hidden lg:inline rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {q.topic}
            </span>
          )}
        </div>
        {/* Mobile-only: source + date */}
        <div className="flex items-center gap-2 mt-0.5 md:hidden">
          {sourceLabel && (
            <span className="text-[10px] font-mono text-muted-foreground/60">{sourceLabel}</span>
          )}
          {q.solvedAt && (
            <span className="text-[10px] text-muted-foreground/50">{formatDate(q.solvedAt)}</span>
          )}
        </div>
      </div>

      {/* Mobile actions — always visible */}
      <div className="flex md:hidden shrink-0 items-center gap-0.5">
        {q.url && (
          <span
            role="button"
            aria-label="Open link"
            onClick={(e) => {
              e.preventDefault();
              window.open(q.url, "_blank");
            }}
            className="rounded-md p-1.5 text-muted-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* Desktop: source, date, hover-actions */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <span className="w-20 text-right text-[11px] font-mono text-muted-foreground/50 truncate">
          {sourceLabel || "—"}
        </span>
        <span className="w-16 text-right text-[11px] text-muted-foreground/50 tabular-nums">
          {q.solvedAt ? formatDate(q.solvedAt) : "—"}
        </span>
        <div className="flex items-center w-24 justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          {q.url && (
            <span
              role="button"
              aria-label="Open link"
              onClick={(e) => {
                e.preventDefault();
                window.open(q.url, "_blank");
              }}
              className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          )}
          <button
            aria-label="Delete"
            onClick={(e) => onDelete(q.id, e)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default QuestionRow;
