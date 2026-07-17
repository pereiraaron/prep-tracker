import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { capitalize, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";

const VISIBLE_LIMIT = 12;

interface ChipSelectProps {
  presets: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
  lowercase?: boolean;
  loading?: boolean;
  /** When true, show all presets with no "+N more" collapse. */
  alwaysOpen?: boolean;
}

const ChipSelect = ({
  presets,
  selected,
  onToggle,
  onAdd,
  onRemove,
  placeholder,
  lowercase,
  loading,
  alwaysOpen = false,
}: ChipSelectProps) => {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(alwaysOpen);

  const eq = lowercase
    ? (a: string, b: string) => a.toLowerCase() === b.toLowerCase()
    : (a: string, b: string) => a === b;
  const isSelected = (p: string) => selected.some((s) => eq(s, p));
  const normalize = (v: string) => (lowercase ? v.toLowerCase() : v);

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

  const dedupedPresets = presets.filter((p, i) => presets.findIndex((q) => eq(p, q)) === i);
  const selectedPresets = dedupedPresets.filter((p) => isSelected(p));
  const unselectedPresets = dedupedPresets.filter((p) => !isSelected(p));
  const canCollapse = !alwaysOpen && dedupedPresets.length > VISIBLE_LIMIT;
  const showAll = alwaysOpen || expanded;
  const visibleUnselected = showAll
    ? unselectedPresets
    : unselectedPresets.slice(0, Math.max(0, VISIBLE_LIMIT - selectedPresets.length));
  const hiddenCount = unselectedPresets.length - visibleUnselected.length;

  if (loading && presets.length === 0) {
    return (
      <div className="flex w-full flex-1 flex-col gap-3">
        <div className="flex w-full flex-1 flex-wrap content-start gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-7 rounded-lg bg-secondary/70 animate-pulse"
              style={{ width: `${60 + (i % 3) * 20}px` }}
            />
          ))}
        </div>
        <input
          disabled
          className="h-11 w-full shrink-0 rounded-xl border border-border bg-background px-4 text-sm opacity-50"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      <div className="flex w-full flex-1 flex-col gap-3">
        <div className="flex w-full flex-wrap content-start gap-1.5">
          {selectedPresets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onToggle(normalize(p))}
              className={`${CHIP_BASE} ${CHIP_ACTIVE}`}
            >
              {display(p)}
            </button>
          ))}
          {visibleUnselected.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onToggle(normalize(p))}
              className={`${CHIP_BASE} ${CHIP_INACTIVE}`}
            >
              {display(p)}
            </button>
          ))}
        </div>
        {canCollapse && hiddenCount > 0 && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`${CHIP_BASE} self-start border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/20 inline-flex items-center gap-1`}
          >
            +{hiddenCount} more <ChevronDown className="h-3 w-3" />
          </button>
        )}
        {canCollapse && expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className={`${CHIP_BASE} self-start border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/20 inline-flex items-center gap-1`}
          >
            Show less <ChevronUp className="h-3 w-3" />
          </button>
        )}
        {custom.length > 0 && (
          <div className="flex w-full flex-wrap gap-1.5">
            {custom.map((c) => (
              <span key={c} className={`inline-flex items-center gap-1 ${CHIP_BASE} ${CHIP_ACTIVE}`}>
                {display(c)}
                <button type="button" onClick={() => onRemove(c)} className="hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-11 w-full shrink-0 rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChipSelect;
