// Shared color maps for badges and chips across pages

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  hard: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
};

export const CATEGORY_COLORS: Record<string, string> = {
  dsa: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  system_design: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  machine_coding: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  language_framework: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  behavioral: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  theory: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  quiz: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export const CATEGORY_BORDER_COLORS: Record<string, string> = {
  dsa: "border-l-stat-blue",
  system_design: "border-l-stat-purple",
  machine_coding: "border-l-stat-orange",
  language_framework: "border-l-stat-green",
  behavioral: "border-l-pink-400",
  theory: "border-l-cyan-400",
  quiz: "border-l-pink-300",
};

// Chip styles for filter/selection chips
export const CHIP_BASE = "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-[0.97]";
export const CHIP_ACTIVE = "border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/5";
export const CHIP_INACTIVE =
  "border-border bg-secondary/50 text-muted-foreground hover:border-primary/20 hover:text-foreground";
