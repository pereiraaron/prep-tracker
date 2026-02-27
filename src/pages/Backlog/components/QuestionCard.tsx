import { useState } from "react";
import { LuExternalLink, LuTrash2, LuStar, LuCircleCheck } from "react-icons/lu";
import type { Question } from "@api/questions";
import { DIFFICULTY_COLOR, PREP_CATEGORIES } from "@api/types";
import type { PrepCategory } from "@api/types";

const BADGE_COLOR_MAP: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  gray: "#6b7280",
};

interface QuestionCardProps {
  question: Question;
  onDelete: () => void;
  onStar: () => void;
  onSolve: (category: PrepCategory) => void;
}

const QuestionCard = ({ question, onDelete, onStar, onSolve }: QuestionCardProps) => {
  const [showSolve, setShowSolve] = useState(false);

  const diffColor = question.difficulty
    ? BADGE_COLOR_MAP[DIFFICULTY_COLOR[question.difficulty]] || BADGE_COLOR_MAP.gray
    : BADGE_COLOR_MAP.gray;

  return (
    <div
      className="group flex items-start sm:items-center gap-2 md:gap-3 p-3 md:p-4 glass-card rounded-xl hover:border-purple-500/20 transition-all"
    >
      {/* Star */}
      <button
        aria-label={question.starred ? "Unstar" : "Star"}
        className={`p-1 rounded-lg hover:bg-(--secondary) transition-colors shrink-0 ${
          question.starred ? "text-yellow-500" : "text-(--muted-foreground)"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
      >
        <LuStar fill={question.starred ? "currentColor" : "none"} size={16} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">
            {question.title}
          </p>
          {question.url && (
            <a href={question.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <span className="text-blue-500 shrink-0">
                <LuExternalLink size={14} />
              </span>
            </a>
          )}
        </div>

        <div className="flex gap-2 mt-1.5 flex-wrap items-center">
          {question.difficulty && (
            <span
              className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
              style={{
                color: diffColor,
                borderColor: `${diffColor}33`,
                backgroundColor: `${diffColor}11`,
              }}
            >
              {question.difficulty}
            </span>
          )}
          {question.topic && (
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
              {question.topic}
            </span>
          )}
          {question.source && (
            <span className="text-xs text-(--muted-foreground)">
              {question.source}
            </span>
          )}
        </div>

        {/* Inline solve picker */}
        {showSolve && (
          <div className="flex items-center gap-2 mt-2">
            <select
              className="select-base flex-1"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onSolve(e.target.value as PrepCategory);
                  setShowSolve(false);
                }
              }}
            >
              <option value="">Pick a category...</option>
              {PREP_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              aria-label="Cancel"
              className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors"
              onClick={() => setShowSolve(false)}
            >
              &#10005;
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center shrink-0">
        <button
          aria-label="Solve"
          className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors text-green-500"
          onClick={(e) => {
            e.stopPropagation();
            setShowSolve((v) => !v);
          }}
        >
          <LuCircleCheck size={16} />
        </button>
        <button
          aria-label="Delete question"
          className="p-1.5 rounded-lg hover:bg-(--secondary) text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
