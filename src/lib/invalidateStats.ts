import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";

/** Invalidate stats that change when questions are created, updated, deleted, or solved. */
export const invalidateCoreStats = (queryClient: QueryClient) => {
  const keys = [
    queryKeys.stats.overview(),
    queryKeys.stats.streaks(),
    queryKeys.stats.progress(),
    queryKeys.stats.insights(),
    queryKeys.stats.categories(),
    queryKeys.stats.difficulties(),
    queryKeys.stats.sources(),
    queryKeys.stats.topics(),
    queryKeys.stats.heatmap(),
    queryKeys.stats.weekly(),
    queryKeys.stats.cumulative(),
    queryKeys.stats.difficultyByCategory(),
    queryKeys.stats.companyTags(),
    [...queryKeys.stats.all, "batch"] as const,
    [...queryKeys.stats.all, "dashboard"] as const,
    [...queryKeys.stats.all, "dailyByCategory"] as const,
    [...queryKeys.stats.all, "deepDive"] as const,
  ];

  for (const queryKey of keys) {
    queryClient.invalidateQueries({ queryKey });
  }
};
