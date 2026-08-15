import { CATEGORY_LABEL } from "@api/types";

export const DIFF_COLORS = [
  "hsl(var(--stat-green))",
  "hsl(var(--stat-orange))",
  "hsl(var(--destructive))",
];

export const CHART_BLUE = "hsl(var(--stat-blue))";
export const CHART_VIOLET = "hsl(var(--stat-purple))";
export const CHART_TEAL = "hsl(var(--stat-green))";

const CHART_ORANGE = "hsl(var(--stat-orange))";
const CHART_ROSE = "hsl(var(--stat-pink))";
const CHART_SKY = "hsl(208 70% 52%)";
const CHART_AMBER = "hsl(var(--stat-yellow))";
const CHART_EMERALD = "hsl(152 48% 40%)";
const PENDING_COLOR = "hsl(var(--muted-foreground) / 0.45)";

export const CATEGORY_CHART_COLORS: Record<string, string> = {
  dsa: CHART_BLUE,
  system_design: CHART_VIOLET,
  machine_coding: CHART_ORANGE,
  language_framework: CHART_TEAL,
  behavioral: CHART_ROSE,
  theory: CHART_SKY,
  quiz: "hsl(var(--stat-yellow))",
};

export const SOURCE_CHART_COLORS: Record<string, string> = {
  leetcode: CHART_ORANGE,
  greatfrontend: CHART_TEAL,
  minichallenges: CHART_VIOLET,
  geeksforgeeks: CHART_BLUE,
  linkedin: CHART_SKY,
  medium: "hsl(var(--muted-foreground))",
  namastedsa: CHART_AMBER,
  fmc: CHART_EMERALD,
  other: PENDING_COLOR,
};

const GRID_COLOR_LIGHT = "hsl(220 16% 82% / 0.45)";
const GRID_COLOR_DARK = "hsl(220 16% 100% / 0.06)";

export const getGridColor = () =>
  document.documentElement.classList.contains("dark") ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;

export const getTextColor = () =>
  document.documentElement.classList.contains("dark") ? "hsl(220, 12%, 52%)" : "hsl(220, 10%, 48%)";

export const categoryShort = (category: string) => {
  const label = CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] || category;
  switch (category) {
    case "language_framework":
      return "Lang/FW";
    case "machine_coding":
      return "Machine";
    case "system_design":
      return "Sys Design";
    default:
      return label;
  }
};

export const MILESTONE_ICONS: Record<string, string> = {
  "First Question": "🎯",
  "Getting Started": "🔟",
  "Half Century": "🏆",
  Century: "💯",
  "First Hard": "💪",
  "Hard Grinder": "⚡",
  "Category Explorer": "🌟",
  "Well Rounded": "🌍",
  "Streak: 7 Days": "🔥",
  "Streak: 30 Days": "⚡",
};
