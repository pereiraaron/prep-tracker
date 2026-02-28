import type { Question } from "@api/questions";
import { CATEGORY_LABEL } from "@api/types";

interface ActivityItemProps {
  question: Question;
}

const borderColors: Record<string, string> = {
  dsa: "border-l-stat-blue",
  system_design: "border-l-stat-purple",
  machine_coding: "border-l-stat-orange",
  language_framework: "border-l-stat-green",
  behavioral: "border-l-pink-400",
  conceptual: "border-l-yellow-400",
  theory: "border-l-cyan-400",
  quiz: "border-l-pink-300",
};

const categoryBadgeColors: Record<string, string> = {
  dsa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  system_design: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  machine_coding: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  language_framework: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  behavioral: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  conceptual: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  theory: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  quiz: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const ActivityItem = ({ question }: ActivityItemProps) => {
  const cat = question.category;
  const solvedDate = question.solvedAt
    ? new Date(question.solvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  const borderColor = cat ? borderColors[cat] || "border-l-border" : "border-l-border";

  return (
    <div className={`flex items-center gap-3 border-l-[3px] ${borderColor} px-4 py-3 transition-colors hover:bg-secondary/50`}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold font-display">{question.title}</p>
        <div className="flex items-center gap-2 mt-1">
          {cat && (
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${categoryBadgeColors[cat] || ""}`}>
              {CATEGORY_LABEL[cat] || cat}
            </span>
          )}
        </div>
      </div>
      {solvedDate && (
        <span className="shrink-0 text-xs text-muted-foreground">{solvedDate}</span>
      )}
    </div>
  );
};

export default ActivityItem;
