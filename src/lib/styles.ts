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

/** Case-insensitive alphabetical sort (stable copy). */
export const sortAlpha = (items: string[]) =>
  [...items].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

// Shared color maps — design tokens only (primary = brand, stats = data ink)

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-stat-green/10 text-stat-green border-stat-green/20",
  medium: "bg-stat-orange/10 text-stat-orange border-stat-orange/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export const CATEGORY_COLORS: Record<string, string> = {
  dsa: "bg-stat-blue/10 text-stat-blue border-stat-blue/20",
  system_design: "bg-stat-purple/10 text-stat-purple border-stat-purple/20",
  machine_coding: "bg-stat-orange/10 text-stat-orange border-stat-orange/20",
  language_framework: "bg-stat-green/10 text-stat-green border-stat-green/20",
  behavioral: "bg-stat-pink/10 text-stat-pink border-stat-pink/20",
  theory: "bg-stat-sky/10 text-stat-sky border-stat-sky/20",
  quiz: "bg-stat-yellow/10 text-stat-yellow border-stat-yellow/20",
};

/** Solid dots for legends — full class names so Tailwind can detect them. */
export const CATEGORY_DOT_COLORS: Record<string, string> = {
  dsa: "bg-stat-blue",
  system_design: "bg-stat-purple",
  machine_coding: "bg-stat-orange",
  language_framework: "bg-stat-green",
  behavioral: "bg-stat-pink",
  theory: "bg-stat-sky",
  quiz: "bg-stat-yellow",
};

export const CHIP_BASE = "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-[0.97]";
export const CHIP_ACTIVE = "border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/5";
export const CHIP_INACTIVE =
  "border-border/50 bg-background/40 text-muted-foreground backdrop-blur-md hover:border-primary/20 hover:text-foreground dark:bg-white/5";

export const FORM_INPUT =
  "flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md dark:bg-white/5";

export const FORM_TEXTAREA =
  "flex w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none backdrop-blur-md dark:bg-white/5";

export const SOURCE_COLORS: Record<string, string> = {
  leetcode: "bg-stat-orange/10 text-stat-orange border-stat-orange/20",
  greatfrontend: "bg-stat-green/10 text-stat-green border-stat-green/20",
  minichallenges: "bg-stat-purple/10 text-stat-purple border-stat-purple/20",
  geeksforgeeks: "bg-stat-blue/10 text-stat-blue border-stat-blue/20",
  linkedin: "bg-stat-blue/10 text-stat-blue border-stat-blue/20",
  medium: "bg-muted text-muted-foreground border-border",
  namastedsa: "bg-stat-yellow/10 text-stat-yellow border-stat-yellow/20",
  fmc: "bg-stat-green/10 text-stat-green border-stat-green/20",
  other: "bg-muted text-muted-foreground border-border",
};
