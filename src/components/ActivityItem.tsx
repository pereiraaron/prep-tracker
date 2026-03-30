import type { Question } from "@api/questions";
import { questionsApi } from "@api/questions";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";
import { CATEGORY_BORDER_COLORS } from "@lib/styles";
import { CategoryBadge } from "@components/Badge";

interface ActivityItemProps {
  question: Question;
}

const ActivityItem = ({ question }: ActivityItemProps) => {
  const queryClient = useQueryClient();
  const cat = question.category;
  const solvedDate = question.solvedAt
    ? new Date(question.solvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  const borderColor = cat ? CATEGORY_BORDER_COLORS[cat] || "border-l-border" : "border-l-border";

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPrefetch = () => {
    hoverTimer.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.questions.detail(question.id),
        queryFn: () => questionsApi.getById(question.id),
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
      to={`/questions/${question.id}`}
      onMouseEnter={startPrefetch}
      onMouseLeave={cancelPrefetch}
      onFocus={startPrefetch}
      onBlur={cancelPrefetch}
      className={`flex items-center gap-3 border-l-[3px] ${borderColor} px-4 py-3 transition-all hover:bg-secondary/40`}
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-sm font-semibold font-display truncate">{question.title}</p>
        <div className="flex items-center gap-2 mt-1">
          {cat && <CategoryBadge value={cat} />}
        </div>
      </div>
      {solvedDate && <span className="shrink-0 text-xs text-muted-foreground">{solvedDate}</span>}
    </Link>
  );
};

export default ActivityItem;
