import type { QuestionListItem } from "@api/questions";
import { capitalize, CATEGORY_BORDER_COLORS, sortAlpha } from "@lib/styles";
import { DifficultyBadge, CategoryBadge, SourceBadge } from "@components/Badge";
import IconButton from "@components/IconButton";
import { Star, Trash2, ExternalLink, CheckCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BacklogRowProps {
  item: QuestionListItem;
  index: number;
  onStar: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onSolve: (id: string) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const BacklogRow = ({ item: q, index, onStar, onDelete, onSolve }: BacklogRowProps) => {
  const borderColor = q.category ? CATEGORY_BORDER_COLORS[q.category] || "border-l-border" : "border-l-border";

  return (
    <Link
      to={`/questions/${q.id}`}
      className={`list-row group flex items-center gap-3 border-l-[3px] ${borderColor} px-3 sm:px-4 py-3 md:py-2.5 animate-list-in`}
      style={{ animationDelay: `${Math.min(index, 12) * 22}ms` }}
    >
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

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-[13px] font-semibold tracking-tight group-hover:text-primary transition-colors truncate">
            {q.title}
          </span>
          {q.difficulty && <span className="md:hidden"><DifficultyBadge value={q.difficulty} /></span>}
          {q.category && <span className="hidden sm:inline md:hidden"><CategoryBadge value={q.category} /></span>}
          {q.topics?.length > 0 && sortAlpha(q.topics).map((t) => (
            <span key={t} className="hidden lg:inline rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {capitalize(t)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-0.5 md:hidden">
          {q.source && <SourceBadge value={q.source} />}
          <span className="text-[10px] text-muted-foreground/50 tabular-nums">{formatDate(q.createdAt)}</span>
        </div>
      </div>

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:text-muted-foreground/40 md:hidden" />

      <div className="flex md:hidden shrink-0 items-center gap-0.5">
        <IconButton
          label="Solve this question"
          onClick={(e) => {
            e.preventDefault();
            onSolve(q.id);
          }}
          className="rounded-md p-1.5 text-muted-foreground hover:text-stat-green"
        >
          <CheckCircle className="h-3.5 w-3.5" />
        </IconButton>
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

      <div className="hidden md:flex items-center gap-4 shrink-0">
        <span className="w-16 flex justify-center">
          {q.difficulty ? <DifficultyBadge value={q.difficulty} /> : <span className="text-[11px] text-muted-foreground/50">—</span>}
        </span>
        <span className="w-40 flex justify-center">
          {q.category ? <CategoryBadge value={q.category} /> : <span className="text-[11px] text-muted-foreground/50">—</span>}
        </span>
        <span className="w-28 flex justify-center">
          {q.source ? (
            <SourceBadge value={q.source} />
          ) : (
            <span className="text-[11px] text-muted-foreground/50">—</span>
          )}
        </span>
        <span className="w-24 text-center text-[11px] text-muted-foreground/50 tabular-nums">
          {formatDate(q.createdAt)}
        </span>
        <div className="flex items-center w-24 justify-end gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
          <IconButton
            label="Solve this question"
            onClick={(e) => {
              e.preventDefault();
              onSolve(q.id);
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:text-stat-green hover:bg-stat-green/10 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" />
          </IconButton>
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
            label="Remove from backlog"
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

export default BacklogRow;
