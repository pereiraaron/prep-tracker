import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@api/stats";
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
