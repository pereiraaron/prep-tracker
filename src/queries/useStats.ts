import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { statsApi, type BatchStatsResponse } from "@api/stats";
import { queryKeys } from "@lib/queryKeys";

/** Seed individual caches used by celebrate (overview/streaks) and invalidate keys. */
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
  if (data.progress !== undefined) {
    queryClient.setQueryData([...queryKeys.stats.progress(), 14], data.progress);
  }
};

/** Lightweight batch for Dashboard — one request for overview, progress, streaks, insights. */
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

/** Fetches deep dive stats filtered by category. */
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

/** One request for Questions page sidebar stats. */
export const useQuestionsSidebarStats = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.stats.all, "sidebar"] as const,
    queryFn: async () => {
      const data = await statsApi.getBatch([
        "overview",
        "streaks",
        "categories",
        "difficulties",
        "sources",
      ]);
      seedStatsCaches(queryClient, data);
      return data;
    },
  });
};

/** One request for Backlog page sidebar stats. */
export const useBacklogSidebarStats = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.stats.all, "backlog-sidebar"] as const,
    queryFn: async () => {
      const data = await statsApi.getBatch(["categories", "difficulties", "sources"]);
      seedStatsCaches(queryClient, data);
      return data;
    },
  });
};
