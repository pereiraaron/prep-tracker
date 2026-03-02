export type PrepCategory =
  | "dsa"
  | "system_design"
  | "behavioral"
  | "machine_coding"
  | "language_framework"
  | "theory"
  | "quiz";

export type Difficulty = "easy" | "medium" | "hard";

export interface CategoryInfo {
  value: PrepCategory;
  label: string;
  description: string;
}

export const PREP_CATEGORIES: CategoryInfo[] = [
  {
    value: "dsa",
    label: "Data Structures & Algorithms",
    description: "Coding problems, algorithmic thinking, and data structure usage",
  },
  {
    value: "system_design",
    label: "System Design",
    description: "Designing scalable systems, architecture, and trade-off analysis",
  },
  {
    value: "behavioral",
    label: "Behavioral",
    description: "Behavioral and situational interview questions",
  },
  {
    value: "machine_coding",
    label: "Machine Coding",
    description: "Live coding rounds building small applications or features",
  },
  {
    value: "language_framework",
    label: "Language & Framework",
    description: "Language-specific and framework-specific knowledge",
  },
  {
    value: "theory",
    label: "Theory",
    description: "CS fundamentals and theoretical concepts",
  },
  { value: "quiz", label: "Quiz", description: "Quick quiz-style questions" },
];

export const CATEGORY_LABEL: Record<PrepCategory, string> = Object.fromEntries(
  PREP_CATEGORIES.map((c) => [c.value, c.label])
) as Record<PrepCategory, string>;

export const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export const QUESTION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "solved", label: "Solved" },
] as const;

export const QUESTION_SOURCES = [
  { value: "leetcode", label: "LeetCode" },
  { value: "greatfrontend", label: "GreatFrontend" },
  { value: "geeksforgeeks", label: "GeeksforGeeks" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "medium", label: "Medium" },
  { value: "other", label: "Other" },
] as const;

export const CATEGORY_COLOR: Record<string, string> = {
  dsa: "purple",
  system_design: "blue",
  behavioral: "green",
  machine_coding: "orange",
  language_framework: "teal",
  theory: "cyan",
  quiz: "pink",
};

export const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "green",
  medium: "yellow",
  hard: "red",
};

export const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
  QUESTION_SOURCES.map((s) => [s.value, s.label])
) as Record<string, string>;

export const SOURCE_COLOR: Record<string, string> = {
  leetcode: "orange",
  greatfrontend: "teal",
  geeksforgeeks: "green",
  linkedin: "blue",
  medium: "gray",
  other: "gray",
};

export const STATUS_COLOR: Record<string, string> = {
  pending: "orange",
  solved: "green",
};
