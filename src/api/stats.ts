import { API_BASE_URL, apiFetch } from "./client";
import type { PrepCategory } from "./types";

// ---- Response types ----

export interface OverviewResponse {
  totalSolved: number;
  backlogCount: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
}

export interface DifficultyBreakdown {
  difficulty: string;
  count: number;
}

export interface TopicBreakdown {
  topic: string;
  count: number;
}

export interface SourceBreakdown {
  source: string;
  count: number;
}

export interface CompanyTagBreakdown {
  companyTag: string;
  count: number;
}

export interface TagBreakdown {
  tag: string;
  count: number;
}

export interface ProgressDay {
  date: string;
  solved: number;
}

export interface WeeklyProgress {
  week: string;
  startDate: string;
  solved: number;
}

export interface CumulativeProgress {
  date: string;
  total: number;
}

export interface DifficultyByCategory {
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

export interface InsightsResponse {
  weakAreas: {
    type: string;
    name: string;
    count: number;
    lastSolvedDaysAgo: number | null;
  }[];
  tips: { text: string; priority: "high" | "medium" | "low" }[];
  milestones: { name: string; achieved: boolean; progress: string }[];
}

// ---- API ----

export const statsApi = {
  getOverview: async () => apiFetch<OverviewResponse>(`${API_BASE_URL}/stats/overview`),

  getCategoryBreakdown: async () => apiFetch<CategoryBreakdown[]>(`${API_BASE_URL}/stats/categories`),

  getDifficultyBreakdown: async () => apiFetch<DifficultyBreakdown[]>(`${API_BASE_URL}/stats/difficulties`),

  getTopicBreakdown: async (category?: PrepCategory) => {
    const query = category ? `?category=${category}` : "";
    return apiFetch<TopicBreakdown[]>(`${API_BASE_URL}/stats/topics${query}`);
  },

  getSourceBreakdown: async () => apiFetch<SourceBreakdown[]>(`${API_BASE_URL}/stats/sources`),

  getCompanyTagBreakdown: async () => apiFetch<CompanyTagBreakdown[]>(`${API_BASE_URL}/stats/company-tags`),

  getTagBreakdown: async () => apiFetch<TagBreakdown[]>(`${API_BASE_URL}/stats/tags`),

  getProgress: async (days = 30) => apiFetch<ProgressDay[]>(`${API_BASE_URL}/stats/progress?days=${days}`),

  getWeeklyProgress: async (weeks = 12) =>
    apiFetch<WeeklyProgress[]>(`${API_BASE_URL}/stats/weekly-progress?weeks=${weeks}`),

  getCumulativeProgress: async (days = 90) =>
    apiFetch<CumulativeProgress[]>(`${API_BASE_URL}/stats/cumulative-progress?days=${days}`),

  getHeatmap: async (year?: number) => {
    const query = year ? `?year=${year}` : "";
    return apiFetch<Record<string, number>>(`${API_BASE_URL}/stats/heatmap${query}`);
  },

  getDifficultyByCategory: async () => apiFetch<DifficultyByCategory[]>(`${API_BASE_URL}/stats/difficulty-by-category`),

  getStreaks: async () => apiFetch<StreaksResponse>(`${API_BASE_URL}/stats/streaks`),

  getInsights: async (refresh = false) => {
    const query = refresh ? "?refresh=true" : "";
    return apiFetch<InsightsResponse>(`${API_BASE_URL}/stats/insights${query}`);
  },

  getBatch: async (keys?: string[]) => {
    const query = keys ? `?keys=${keys.join(",")}` : "";
    return apiFetch<BatchStatsResponse>(`${API_BASE_URL}/stats/batch${query}`);
  },
};

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
  streaks?: StreaksResponse;
  insights?: InsightsResponse;
}
