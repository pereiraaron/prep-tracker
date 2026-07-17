import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { statsApi, type BatchStatsResponse } from "@api/stats";
import { queryKeys } from "@lib/queryKeys";

export const useOverview = (enabled = true) =>
  useQuery({ queryKey: queryKeys.stats.overview(), queryFn: statsApi.getOverview, enabled });

export const useCategoryBreakdown = (enabled = true) =>
  useQuery({ queryKey: queryKeys.stats.categories(), queryFn: statsApi.getCategoryBreakdown, enabled });

export const useDifficultyBreakdown = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.stats.difficulties(),
    queryFn: statsApi.getDifficultyBreakdown,
    enabled,
  });

export const useProgress = (days = 14, enabled = true) =>
  useQuery({
    queryKey: [...queryKeys.stats.progress(), days] as const,
    queryFn: () => statsApi.getProgress(days),
    enabled,
  });

export const useWeeklyProgress = (weeks = 12) =>
  useQuery({ queryKey: queryKeys.stats.weekly(), queryFn: () => statsApi.getWeeklyProgress(weeks) });

export const useCumulativeProgress = (days = 90) =>
  useQuery({ queryKey: queryKeys.stats.cumulative(), queryFn: () => statsApi.getCumulativeProgress(days) });

export const useTopicBreakdown = () =>
  useQuery({ queryKey: queryKeys.stats.topics(), queryFn: () => statsApi.getTopicBreakdown() });

export const useSourceBreakdown = (enabled = true) =>
  useQuery({ queryKey: queryKeys.stats.sources(), queryFn: statsApi.getSourceBreakdown, enabled });

export const useHeatmap = (year?: number) =>
  useQuery({ queryKey: queryKeys.stats.heatmap(), queryFn: () => statsApi.getHeatmap(year) });

export const useDifficultyByCategory = () =>
  useQuery({ queryKey: queryKeys.stats.difficultyByCategory(), queryFn: statsApi.getDifficultyByCategory });

export const useStreaks = (enabled = true) =>
  useQuery({ queryKey: queryKeys.stats.streaks(), queryFn: statsApi.getStreaks, enabled });

export const useInsights = (enabled = true) =>
  useQuery({ queryKey: queryKeys.stats.insights(), queryFn: () => statsApi.getInsights(), enabled });

const seedStatsCaches = (queryClient: ReturnType<typeof useQueryClient>, data: BatchStatsResponse) => {
  const seedMap: [readonly string[], keyof BatchStatsResponse][] = [
    [queryKeys.stats.overview(), "overview"],
    [queryKeys.stats.categories(), "categories"],
    [queryKeys.stats.difficulties(), "difficulties"],
    [queryKeys.stats.progress(), "progress"],
    [queryKeys.stats.weekly(), "weeklyProgress"],
    [queryKeys.stats.cumulative(), "cumulativeProgress"],
    [queryKeys.stats.topics(), "topics"],
    [queryKeys.stats.sources(), "sources"],
    [[...queryKeys.stats.all, "dailyByCategory"], "dailyByCategory"],
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
  // Also seed progress with days key used by useProgress(14)
  if (data.progress !== undefined) {
    queryClient.setQueryData([...queryKeys.stats.progress(), 14], data.progress);
  }
};

/**
 * Lightweight batch for Dashboard — one request for overview, progress, streaks, insights.
 */
export const useDashboardStats = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.stats.all, "dashboard"] as const,
    queryFn: async () => {
      const data = await statsApi.getBatch(["overview", "progress", "streaks", "insights"]);
      seedStatsCaches(queryClient, data);
      return data;
    },
  });
};

/**
 * Fetches deep dive stats (dailyByCategory) filtered by category.
 * Returns undefined when no category is selected (use batch data instead).
 */
export const useFilteredDeepDive = (category?: string) =>
  useQuery({
    queryKey: [...queryKeys.stats.all, "deepDive", category] as const,
    queryFn: () => statsApi.getBatch(["dailyByCategory", "weeklyProgress"], category),
    enabled: !!category,
    placeholderData: keepPreviousData,
  });

export const useStatsBatch = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.stats.all, "batch"] as const,
    queryFn: async () => {
      const data = await statsApi.getBatch();
      seedStatsCaches(queryClient, data);
      return data;
    },
  });
};
