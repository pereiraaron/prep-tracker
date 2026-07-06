import { lazy, Suspense } from "react";
import type { Solution } from "@api/questions";
import type { PrepCategory } from "@api/types";
import { MAX_SOLUTIONS } from "@api/types";
import { allowsMultipleSolutions } from "@lib/solutions";
import { Code2, Plus, Trash2 } from "lucide-react";

const CodeEditor = lazy(() => import("@components/CodeEditor"));

const defaultTextareaCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30 resize-none disabled:opacity-50";
const defaultLabelCls = "mb-1.5 block text-xs font-semibold text-muted-foreground";

interface SolutionFieldsProps {
  solutions: Solution[];
  onChange: (solutions: Solution[]) => void;
  category: PrepCategory;
  isCode?: boolean;
  disabled?: boolean;
  solutionRequired?: boolean;
  idPrefix?: string;
  labelCls?: string;
  textareaCls?: string;
}

const SolutionFields = ({
  solutions,
  onChange,
  category,
  isCode = false,
  disabled = false,
  solutionRequired = false,
  idPrefix = "solution",
  labelCls = defaultLabelCls,
  textareaCls = defaultTextareaCls,
}: SolutionFieldsProps) => {
  const multi = allowsMultipleSolutions(category);

  const updateAt = (index: number, content: string) => {
    onChange(solutions.map((s, i) => (i === index ? { ...s, content } : s)));
  };

  const addSolution = () => {
    if (solutions.length >= MAX_SOLUTIONS) return;
    onChange([...solutions, { content: "" }]);
  };

  const removeSolution = (index: number) => {
    if (solutions.length <= 1) {
      onChange([{ content: "" }]);
      return;
    }
    onChange(solutions.filter((_, i) => i !== index));
  };

  const solutionLabel = (index: number) =>
    multi && solutions.length > 1 ? `Solution ${index + 1}` : "Solution";

  if (isCode) {
    return (
      <div className="space-y-4">
        {solutions.map((solution, index) => (
          <div key={index} className="rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[hsl(var(--code-bg))] px-4 py-3 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-stat-blue" />
                <h2 className="font-display text-sm font-semibold text-[hsl(var(--code-fg))]">
                  {solutionLabel(index)}
                  {solutionRequired && index === 0 && <span className="text-destructive ml-0.5">*</span>}
                </h2>
              </div>
              {multi && solutions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSolution(index)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
            <Suspense fallback={<div className="bg-[hsl(var(--code-bg))] rounded-b-xl px-4 py-8 text-center text-sm text-muted-foreground">Loading editor...</div>}>
              <CodeEditor
                value={solution.content}
                onChange={(v) => updateAt(index, v)}
                editable={!disabled}
                readOnly={disabled}
                maxHeight="500px"
                placeholder="Write your solution..."
              />
            </Suspense>
          </div>
        ))}

        {multi && solutions.length < MAX_SOLUTIONS && (
          <button
            type="button"
            onClick={addSolution}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add another solution
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solutions.map((solution, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={`${idPrefix}-${index}`} className={labelCls}>
              Solution {solutionRequired && index === 0 && <span className="text-destructive">*</span>}
            </label>
            {multi && solutions.length > 1 && (
              <button
                type="button"
                onClick={() => removeSolution(index)}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          <textarea
            id={`${idPrefix}-${index}`}
            value={solution.content}
            onChange={(e) => updateAt(index, e.target.value)}
            rows={6}
            className={textareaCls}
            placeholder="Describe your approach, include code snippets..."
            disabled={disabled}
          />
        </div>
      ))}

      {multi && solutions.length < MAX_SOLUTIONS && (
        <button
          type="button"
          onClick={addSolution}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another solution
        </button>
      )}
    </div>
  );
};

export default SolutionFields;
