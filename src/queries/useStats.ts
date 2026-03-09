import { useQuery, useQueryClient } from "@tanstack/react-query";
import { statsApi, type BatchStatsResponse } from "@api/stats";
import { queryKeys } from "@lib/queryKeys";

export const useOverview = () => useQuery({ queryKey: queryKeys.stats.overview(), queryFn: statsApi.getOverview });

export const useCategoryBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.categories(), queryFn: statsApi.getCategoryBreakdown });

export const useDifficultyBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.difficulties(), queryFn: statsApi.getDifficultyBreakdown });

export const useProgress = (days = 14) =>
  useQuery({ queryKey: queryKeys.stats.progress(), queryFn: () => statsApi.getProgress(days) });

export const useWeeklyProgress = (weeks = 12) =>
  useQuery({ queryKey: queryKeys.stats.weekly(), queryFn: () => statsApi.getWeeklyProgress(weeks) });

export const useCumulativeProgress = (days = 90) =>
  useQuery({ queryKey: queryKeys.stats.cumulative(), queryFn: () => statsApi.getCumulativeProgress(days) });

export const useTopicBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.topics(), queryFn: () => statsApi.getTopicBreakdown() });

export const useSourceBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.sources(), queryFn: statsApi.getSourceBreakdown });

export const useCompanyTagBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.companyTags(), queryFn: statsApi.getCompanyTagBreakdown });

export const useHeatmap = (year?: number) =>
  useQuery({ queryKey: queryKeys.stats.heatmap(), queryFn: () => statsApi.getHeatmap(year) });

export const useDifficultyByCategory = () =>
  useQuery({ queryKey: queryKeys.stats.difficultyByCategory(), queryFn: statsApi.getDifficultyByCategory });

export const useStreaks = () => useQuery({ queryKey: queryKeys.stats.streaks(), queryFn: statsApi.getStreaks });

export const useInsights = () =>
  useQuery({ queryKey: queryKeys.stats.insights(), queryFn: () => statsApi.getInsights() });

/**
 * Fetches all stats in a single request and seeds individual query caches.
 * Use this on StatsPage instead of 13 separate hooks.
 */
export const useStatsBatch = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.stats.all, "batch"] as const,
    queryFn: async () => {
      const data = await statsApi.getBatch();

      // Seed individual caches so other pages (Dashboard) benefit
      const seedMap: [readonly string[], keyof BatchStatsResponse][] = [
        [queryKeys.stats.overview(), "overview"],
        [queryKeys.stats.categories(), "categories"],
        [queryKeys.stats.difficulties(), "difficulties"],
        [queryKeys.stats.progress(), "progress"],
        [queryKeys.stats.weekly(), "weeklyProgress"],
        [queryKeys.stats.cumulative(), "cumulativeProgress"],
        [queryKeys.stats.topics(), "topics"],
        [queryKeys.stats.sources(), "sources"],
        [queryKeys.stats.companyTags(), "companyTags"],
        [queryKeys.stats.heatmap(), "heatmap"],
        [queryKeys.stats.difficultyByCategory(), "difficultyByCategory"],
        [queryKeys.stats.streaks(), "streaks"],
        [queryKeys.stats.insights(), "insights"],
      ];

      for (const [key, field] of seedMap) {
        if (data[field] !== undefined) {
          queryClient.setQueryData(key, data[field]);
        }
      }

      return data;
    },
  });
};
