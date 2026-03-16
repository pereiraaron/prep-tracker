import type { Question } from "@api/questions";
import { CATEGORY_LABEL } from "@api/types";
import { DifficultyBadge, TopicBadge, SourceBadge } from "@components/Badge";
import { Star, Trash2, ExternalLink, CheckCircle } from "lucide-react";

interface BacklogRowProps {
  item: Question;
  index: number;
  solvingId: string | null;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onStartSolve: (id: string) => void;
  onSolve: (id: string, category: string) => void;
  onCancelSolve: () => void;
}

const BacklogRow = ({
  item: q,
  index,
  solvingId,
  onStar,
  onDelete,
  onStartSolve,
  onSolve,
  onCancelSolve,
}: BacklogRowProps) => (
  <div
    className="group flex items-center gap-3 px-4 py-3 md:py-2.5 transition-colors hover:bg-secondary/50 animate-slide-up"
    style={{ animationDelay: `${index * 20}ms` }}
  >
    {/* Star */}
    <button
      aria-label={q.starred ? "Unstar" : "Star"}
      onClick={() => onStar(q.id)}
      className={`shrink-0 rounded p-0.5 transition-colors ${
        q.starred ? "text-stat-orange" : "text-border hover:text-stat-orange"
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${q.starred ? "fill-stat-orange" : ""}`} />
    </button>

    {/* Content */}
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-display text-[13px] font-semibold truncate">{q.title}</span>
        {q.difficulty && <DifficultyBadge value={q.difficulty} />}
        {q.topic && <span className="hidden sm:inline"><TopicBadge value={q.topic} /></span>}
        {q.source && <span className="hidden sm:inline"><SourceBadge value={q.source} /></span>}
      </div>
    </div>

    {/* Actions — always visible on mobile, hover-reveal on desktop */}
    <div className="flex shrink-0 items-center gap-0.5">
      {q.url && (
        <a
          href={q.url}
          target="_blank"
          rel="noreferrer"
          aria-label="Open problem link"
          className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors md:opacity-0 md:group-hover:opacity-100"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {solvingId === q.id ? (
        <select
          autoFocus
          onChange={(e) => {
            if (e.target.value) onSolve(q.id, e.target.value);
          }}
          onBlur={onCancelSolve}
          className="h-7 rounded-lg border border-border bg-card px-2 text-[11px] outline-none"
        >
          <option value="">Category...</option>
          {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      ) : (
        <button
          onClick={() => onStartSolve(q.id)}
          className="rounded-md p-1.5 text-muted-foreground hover:text-stat-green hover:bg-stat-green/10 transition-colors md:opacity-0 md:group-hover:opacity-100"
          title="Mark as solved"
        >
          <CheckCircle className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        aria-label="Remove from backlog"
        onClick={() => onDelete(q.id)}
        className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors md:opacity-0 md:group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

export default BacklogRow;
