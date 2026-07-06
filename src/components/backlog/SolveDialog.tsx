import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@components/ui/dialog";
import SolutionFields from "@components/SolutionFields";
import { toast } from "@components/ui/sonner";
import { CheckCircle, Loader2 } from "lucide-react";
import type { Solution } from "@api/questions";
import type { PrepCategory } from "@api/types";
import {
  isSolutionRequired,
  normalizeSolutionsForSubmit,
  solutionsHaveContent,
  validateSolutions,
} from "@lib/solutions";

interface SolveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolve: (solutions?: Solution[]) => void;
  isPending: boolean;
  questionTitle: string;
  category?: PrepCategory | null;
}

const dialogTextareaCls =
  "w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y font-mono";

const SolveDialog = ({ open, onOpenChange, onSolve, isPending, questionTitle, category }: SolveDialogProps) => {
  const [solutions, setSolutions] = useState<Solution[]>([{ content: "" }]);
  const activeCategory = category ?? "dsa";
  const solutionRequired = isSolutionRequired(activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateSolutions(solutions, activeCategory);
    if (error) {
      toast.error(error);
      return;
    }
    onSolve(normalizeSolutionsForSubmit(solutions, activeCategory));
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setSolutions([{ content: "" }]);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <DialogTitle>Mark as Solved</DialogTitle>
          <DialogDescription className="mt-0.5 line-clamp-1">
            {questionTitle}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit}>
          <SolutionFields
            solutions={solutions}
            onChange={setSolutions}
            category={activeCategory}
            disabled={isPending}
            solutionRequired={solutionRequired}
            idPrefix="solve-solution"
            textareaCls={dialogTextareaCls}
          />

          <div className="flex items-center justify-end gap-2 mt-4">
            <DialogClose
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </DialogClose>
            <button
              type="submit"
              disabled={(solutionRequired && !solutionsHaveContent(solutions)) || isPending}
              className="flex items-center gap-2 rounded-xl bg-stat-green px-4 py-2 text-sm font-medium text-white shadow-lg shadow-stat-green/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Mark as Solved
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SolveDialog;
