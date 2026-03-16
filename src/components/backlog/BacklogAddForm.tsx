import { Plus, Loader2 } from "lucide-react";

interface BacklogAddFormProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: () => void;
  creating: boolean;
}

const BacklogAddForm = ({ value, onChange, onAdd, creating }: BacklogAddFormProps) => (
  <div className="glass-card mb-6 rounded-xl p-4">
    <div className="flex gap-2">
      <label htmlFor="add-backlog" className="sr-only">Add to backlog</label>
      <input
        id="add-backlog"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder="Add a question to solve later..."
        className="h-10 flex-1 min-w-0 rounded-xl border border-border bg-background px-3 sm:px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
        disabled={creating}
      />
      <button
        onClick={onAdd}
        disabled={creating || !value.trim()}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
      >
        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add
      </button>
    </div>
  </div>
);

export default BacklogAddForm;
