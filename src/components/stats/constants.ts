import { CATEGORY_LABEL } from "@api/types";

export const DIFF_COLORS = ["hsl(155, 65%, 42%)", "hsl(42, 95%, 52%)", "hsl(0, 72%, 55%)"];
export const SOLVED_COLOR = "hsl(155, 65%, 42%)";
export const PENDING_COLOR = "hsl(220, 15%, 80%)";
export const PRIMARY_COLOR = "hsl(230, 65%, 55%)";
export const TEAL_COLOR = "hsl(170, 70%, 45%)";

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
