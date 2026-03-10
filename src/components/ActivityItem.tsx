import type { Question } from "@api/questions";
import { Link } from "react-router-dom";
import { CATEGORY_BORDER_COLORS } from "@lib/styles";
import { CategoryBadge } from "@components/Badge";

interface ActivityItemProps {
  question: Question;
}

const ActivityItem = ({ question }: ActivityItemProps) => {
  const cat = question.category;
  const solvedDate = question.solvedAt
    ? new Date(question.solvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  const borderColor = cat ? CATEGORY_BORDER_COLORS[cat] || "border-l-border" : "border-l-border";

  return (
    <Link
      to={`/questions/${question.id}`}
      className={`flex items-center gap-3 border-l-[3px] ${borderColor} px-4 py-3 transition-colors hover:bg-secondary/50`}
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
