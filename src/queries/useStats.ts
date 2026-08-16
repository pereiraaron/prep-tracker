import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { statsApi, type BatchStatsResponse } from "@api/stats";
import { queryKeys } from "@lib/queryKeys";
import { getBatchFromSeededCaches, seedStatsCaches } from "@lib/queryCache";

type BatchField = keyof BatchStatsResponse;

const useSeededBatchQuery = (
  queryKey: readonly unknown[],
  fields: BatchField[],
  fetchKeys?: string[],
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const data = await statsApi.getBatch(fetchKeys, undefined, { signal });
      seedStatsCaches(queryClient, data);
      return data;
    },
    initialData: () => getBatchFromSeededCaches(queryClient, fields)?.data,
    initialDataUpdatedAt: () => getBatchFromSeededCaches(queryClient, fields)?.dataUpdatedAt,
  });
};

/** Lightweight batch for Dashboard — one request for overview, progress, streaks, insights. */
export const useDashboardStats = () =>
  useSeededBatchQuery(
    [...queryKeys.stats.all, "dashboard"] as const,
    ["overview", "progress", "streaks", "insights"],
    ["overview", "progress", "streaks", "insights"],
  );

/** Fetches deep dive stats filtered by category. */
export const useFilteredDeepDive = (category?: string) =>
  useQuery({
    queryKey: [...queryKeys.stats.all, "deepDive", category] as const,
    queryFn: ({ signal }) =>
      statsApi.getBatch(["dailyByCategory", "weeklyProgress"], category, { signal }),
    enabled: !!category,
    placeholderData: keepPreviousData,
  });

export const useStatsBatch = () => {
  const fields: BatchField[] = [
    "overview",
    "categories",
    "difficulties",
    "progress",
    "weeklyProgress",
    "cumulativeProgress",
    "topics",
    "sources",
    "companyTags",
    "heatmap",
    "difficultyByCategory",
    "streaks",
    "insights",
  ];
  return useSeededBatchQuery([...queryKeys.stats.all, "batch"] as const, fields);
};

/** One request for Questions page sidebar stats. */
export const useQuestionsSidebarStats = () =>
  useSeededBatchQuery(
    [...queryKeys.stats.all, "sidebar"] as const,
    ["overview", "streaks", "categories", "difficulties", "sources"],
    ["overview", "streaks", "categories", "difficulties", "sources"],
  );

/** One request for Backlog page sidebar stats. */
export const useBacklogSidebarStats = () =>
  useSeededBatchQuery(
    [...queryKeys.stats.all, "backlog-sidebar"] as const,
    ["categories", "difficulties", "sources"],
    ["categories", "difficulties", "sources"],
  );
