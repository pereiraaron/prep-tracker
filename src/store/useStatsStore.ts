import { create } from "zustand";
import {
  statsApi,
  type OverviewResponse,
  type CategoryBreakdown,
  type DifficultyBreakdown,
  type TopicBreakdown,
  type SourceBreakdown,
  type CompanyTagBreakdown,
  type ProgressDay,
  type WeeklyProgress,
  type CumulativeProgress,
  type DifficultyByCategory,
} from "@api/stats";

interface StatsState {
  overview: OverviewResponse | null;
  categories: CategoryBreakdown[] | null;
  difficulties: DifficultyBreakdown[] | null;
  progress: ProgressDay[] | null;
  weekly: WeeklyProgress[] | null;
  cumulative: CumulativeProgress[] | null;
  topics: TopicBreakdown[] | null;
  sources: SourceBreakdown[] | null;
  companyTags: CompanyTagBreakdown[] | null;
  heatmap: Record<string, number> | null;
  difficultyByCategory: DifficultyByCategory[] | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchOverview: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  overview: null,
  categories: null,
  difficulties: null,
  progress: null,
  weekly: null,
  cumulative: null,
  topics: null,
  sources: null,
  companyTags: null,
  heatmap: null,
  difficultyByCategory: null,
  isLoading: false,
  error: null,
};

export const useStatsStore = create<StatsState>((set) => ({
  ...initialState,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        overview,
        categories,
        difficulties,
        progress,
        weekly,
        cumulative,
        topics,
        sources,
        companyTags,
        heatmap,
        difficultyByCategory,
      ] = await Promise.all([
        statsApi.getOverview(),
        statsApi.getCategoryBreakdown(),
        statsApi.getDifficultyBreakdown(),
        statsApi.getProgress(14),
        statsApi.getWeeklyProgress(12),
        statsApi.getCumulativeProgress(90),
        statsApi.getTopicBreakdown(),
        statsApi.getSourceBreakdown(),
        statsApi.getCompanyTagBreakdown(),
        statsApi.getHeatmap(),
        statsApi.getDifficultyByCategory(),
      ]);
      set({
        overview,
        categories,
        difficulties,
        progress,
        weekly,
        cumulative,
        topics,
        sources,
        companyTags,
        heatmap,
        difficultyByCategory,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load stats",
      });
    }
  },

  fetchOverview: async () => {
    try {
      const overview = await statsApi.getOverview();
      set({ overview });
    } catch {
      // silent — non-critical for cross-store refresh
    }
  },

  reset: () => set(initialState),
}));
