import type { QuestionListItem } from "@api/questions";
import { questionsApi } from "@api/questions";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";
import { prefetchDetailChunks } from "@lib/prefetchDetailChunks";
import { CategoryBadge } from "@components/Badge";
import { ChevronRight } from "lucide-react";

interface ActivityItemProps {
  question: QuestionListItem;
  index?: number;
}

const ActivityItem = ({ question, index = 0 }: ActivityItemProps) => {
  const queryClient = useQueryClient();
  const cat = question.category;
  const solvedDate = question.solvedAt
    ? new Date(question.solvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPrefetch = () => {
    hoverTimer.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.questions.detail(question.id),
        queryFn: ({ signal }) => questionsApi.getById(question.id, { signal }),
        staleTime: 30_000,
      });
      prefetchDetailChunks(question.category);
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
      to={`/questions/${question.id}`}
      onMouseEnter={startPrefetch}
      onMouseLeave={cancelPrefetch}
      onFocus={startPrefetch}
      onBlur={cancelPrefetch}
      className="list-row group flex items-center gap-3 px-4 py-3 animate-list-in"
      style={{ animationDelay: `${Math.min(index, 12) * 28}ms` }}
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-sm font-semibold font-display truncate tracking-tight transition-colors group-hover:text-primary">
          {question.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {cat && <CategoryBadge value={cat} />}
        </div>
      </div>
      {solvedDate && (
        <span className="shrink-0 text-xs text-muted-foreground/70 tabular-nums">{solvedDate}</span>
      )}
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:text-muted-foreground/45" />
    </Link>
  );
};

export default ActivityItem;
