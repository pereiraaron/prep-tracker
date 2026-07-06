// Capitalize with acronym awareness (for displaying lowercase-stored values)
const ACRONYMS: Record<string, string> = {
  bfs: "BFS", dfs: "DFS", bst: "BST", api: "API", cdn: "CDN",
  sql: "SQL", nosql: "NoSQL", css: "CSS", html: "HTML", dom: "DOM",
  oop: "OOP", dbms: "DBMS", os: "OS", svg: "SVG", cap: "CAP", solid: "SOLID",
};
const SMALL_WORDS = new Set(["vs", "and", "or", "of", "the", "in", "on", "to", "a", "an"]);

const capitalizeWord = (word: string): string => {
  const lower = word.toLowerCase();
  if (lower in ACRONYMS) return ACRONYMS[lower];
  if (lower.includes("/")) {
    return lower.split("/").map((part) => part in ACRONYMS ? ACRONYMS[part] : part.charAt(0).toUpperCase() + part.slice(1)).join("/");
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const capitalize = (s: string) =>
  s.split(" ").map((word, i) => {
    const lower = word.toLowerCase();
    if (i > 0 && SMALL_WORDS.has(lower) && !(lower in ACRONYMS)) return lower;
    return capitalizeWord(word);
  }).join(" ");

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

export const FORM_INPUT =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const FORM_TEXTAREA =
  "flex w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none";

export const SOURCE_COLORS: Record<string, string> = {
  leetcode: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  greatfrontend: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  minichallenges: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  geeksforgeeks: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  linkedin: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  medium: "bg-muted text-muted-foreground border-border",
  namastedsa: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  fmc: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  other: "bg-muted text-muted-foreground border-border",
};
