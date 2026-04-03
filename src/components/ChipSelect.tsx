import { useState } from "react";
import { X } from "lucide-react";
import { capitalize, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";

interface ChipSelectProps {
  presets: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
  lowercase?: boolean;
}

const ChipSelect = ({ presets, selected, onToggle, onAdd, onRemove, placeholder, lowercase }: ChipSelectProps) => {
  const [input, setInput] = useState("");

  const eq = lowercase
    ? (a: string, b: string) => a.toLowerCase() === b.toLowerCase()
    : (a: string, b: string) => a === b;
  const isSelected = (p: string) => selected.some((s) => eq(s, p));
  const normalize = (v: string) => lowercase ? v.toLowerCase() : v;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const val = normalize(input.trim());
      if (!selected.some((s) => eq(s, val))) onAdd(val);
      setInput("");
    }
  };

  const custom = selected.filter((s) => !presets.some((p) => eq(s, p)));
  const display = lowercase ? capitalize : (s: string) => s;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onToggle(normalize(p))}
            className={`${CHIP_BASE} ${isSelected(p) ? CHIP_ACTIVE : CHIP_INACTIVE}`}
          >
            {p}
          </button>
        ))}
      </div>
      {custom.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {custom.map((c) => (
            <span
              key={c}
              className={`inline-flex items-center gap-1 ${CHIP_BASE} ${CHIP_ACTIVE}`}
            >
              {display(c)}
              <button type="button" onClick={() => onRemove(c)} className="hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChipSelect;
