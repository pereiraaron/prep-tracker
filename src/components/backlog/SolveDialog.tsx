import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";

interface SolveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolve: (solution: string) => void;
  isPending: boolean;
  questionTitle: string;
}

const SolveDialog = ({ open, onOpenChange, onSolve, isPending, questionTitle }: SolveDialogProps) => {
  const [solution, setSolution] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution.trim()) return;
    onSolve(solution.trim());
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setSolution("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <div className="mb-4">
          <DialogTitle>Mark as Solved</DialogTitle>
          <DialogDescription className="mt-0.5 line-clamp-1">
            {questionTitle}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="solve-solution" className="block text-xs font-medium text-muted-foreground mb-1.5">
            Solution <span className="text-destructive">*</span>
          </label>
          <textarea
            id="solve-solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Paste your solution code or write your approach..."
            rows={10}
            className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y font-mono"
            autoFocus
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
              disabled={!solution.trim() || isPending}
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
