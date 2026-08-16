import { API_BASE_URL, apiFetch } from "./client";

// ---- Response types ----

export interface OverviewResponse {
  totalSolved: number;
  backlogCount: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
}

interface CategoryBreakdown {
  category: string;
  count: number;
  total: number;
  solved: number;
  pending: number;
  completionRate: number;
}

interface DifficultyBreakdown {
  difficulty: string;
  count: number;
  total: number;
  solved: number;
  pending: number;
  completionRate: number;
}

interface TopicBreakdown {
  topic: string;
  count: number;
}

interface SourceBreakdown {
  source: string;
  count: number;
  total: number;
  solved: number;
  pending: number;
  completionRate: number;
}

interface CompanyTagBreakdown {
  companyTag: string;
  count: number;
}

interface DailyByCategoryResponse {
  categories: string[];
  days: Record<string, any>[];
}

interface ProgressDay {
  date: string;
  solved: number;
}

export interface WeeklyProgress {
  week: string;
  startDate: string;
  solved: number;
}

interface CumulativeProgress {
  date: string;
  total: number;
}

interface DifficultyByCategory {
  category: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export interface StreaksResponse {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

interface InsightsResponse {
  tips: { text: string; priority: "high" | "medium" | "low" }[];
  milestones: { name: string; achieved: boolean; progress: string }[];
}

export interface BatchStatsResponse {
  overview?: OverviewResponse;
  categories?: CategoryBreakdown[];
  difficulties?: DifficultyBreakdown[];
  progress?: ProgressDay[];
  weeklyProgress?: WeeklyProgress[];
  cumulativeProgress?: CumulativeProgress[];
  topics?: TopicBreakdown[];
  sources?: SourceBreakdown[];
  companyTags?: CompanyTagBreakdown[];
  heatmap?: Record<string, number>;
  difficultyByCategory?: DifficultyByCategory[];
  dailyByCategory?: DailyByCategoryResponse;
  streaks?: StreaksResponse;
  insights?: InsightsResponse;
}

// ---- API ----

export const statsApi = {
  getStreaks: async (init?: RequestInit) =>
    apiFetch<StreaksResponse>(`${API_BASE_URL}/stats/streaks`, init),

  getBatch: async (keys?: string[], category?: string, init?: RequestInit) => {
    const params = new URLSearchParams();
    if (keys) params.set("keys", keys.join(","));
    if (category) params.set("category", category);
    const query = params.toString() ? `?${params}` : "";
    return apiFetch<BatchStatsResponse>(`${API_BASE_URL}/stats/batch${query}`, init);
  },
};
