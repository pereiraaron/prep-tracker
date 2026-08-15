import { CATEGORY_LABEL } from "@api/types";

export const DIFF_COLORS = ["hsl(155, 70%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 78%, 55%)"];

export const CHART_BLUE = "hsl(225, 73%, 57%)";
export const CHART_VIOLET = "hsl(265, 65%, 58%)";
export const CHART_TEAL = "hsl(172, 66%, 44%)";

const CHART_ORANGE = "hsl(28, 90%, 55%)";
const CHART_ROSE = "hsl(350, 70%, 55%)";
const CHART_SKY = "hsl(200, 80%, 52%)";
const CHART_AMBER = "hsl(42, 95%, 52%)";
const CHART_EMERALD = "hsl(145, 58%, 42%)";
const PENDING_COLOR = "hsl(220, 15%, 75%)";

export const CATEGORY_CHART_COLORS: Record<string, string> = {
  dsa: CHART_BLUE,
  system_design: CHART_VIOLET,
  machine_coding: CHART_ORANGE,
  language_framework: CHART_TEAL,
  behavioral: CHART_ROSE,
  theory: CHART_SKY,
  quiz: "hsl(320, 65%, 55%)",
};

export const SOURCE_CHART_COLORS: Record<string, string> = {
  leetcode: CHART_ORANGE,
  greatfrontend: CHART_TEAL,
  minichallenges: CHART_VIOLET,
  geeksforgeeks: CHART_BLUE,
  linkedin: CHART_SKY,
  medium: "hsl(0, 0%, 55%)",
  namastedsa: CHART_AMBER,
  fmc: CHART_EMERALD,
  other: PENDING_COLOR,
};

const GRID_COLOR_LIGHT = "hsl(220, 15%, 92%)";
const GRID_COLOR_DARK = "hsl(224, 20%, 22%)";

export const getGridColor = () =>
  document.documentElement.classList.contains("dark") ? GRID_COLOR_DARK : GRID_COLOR_LIGHT;

export const getTextColor = () =>
  document.documentElement.classList.contains("dark") ? "hsl(220, 15%, 55%)" : "hsl(220, 10%, 45%)";

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
