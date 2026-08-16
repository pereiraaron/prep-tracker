import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { BatchStatsResponse } from "@api/stats";
import type { Question, QuestionListItem } from "@api/questions";
import { queryKeys } from "@lib/queryKeys";

type Paginated<T> = {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type Infinite<T> = { pages: Paginated<T>[]; pageParams: unknown[] };

const isPaginated = (old: unknown): old is Paginated<{ id: string }> =>
  !!old && typeof old === "object" && "data" in old && Array.isArray((old as Paginated<unknown>).data);

const isInfinite = (old: unknown): old is Infinite<{ id: string }> =>
  !!old && typeof old === "object" && "pages" in old && Array.isArray((old as Infinite<unknown>).pages);

const bumpPagination = (
  pagination: Paginated<unknown>["pagination"],
  delta: number,
): Paginated<unknown>["pagination"] => {
  const total = Math.max(0, pagination.total + delta);
  return {
    ...pagination,
    total,
    totalPages: Math.max(1, Math.ceil(total / Math.max(1, pagination.limit))),
  };
};

/** Map batch response fields ↔ individual query keys used by seedStatsCaches. */
export const STAT_FIELD_KEYS: {
  field: keyof BatchStatsResponse;
  key: readonly string[];
}[] = [
  { field: "overview", key: queryKeys.stats.overview() },
  { field: "categories", key: queryKeys.stats.categories() },
  { field: "difficulties", key: queryKeys.stats.difficulties() },
  { field: "progress", key: queryKeys.stats.progress() },
  { field: "weeklyProgress", key: queryKeys.stats.weekly() },
  { field: "cumulativeProgress", key: queryKeys.stats.cumulative() },
  { field: "topics", key: queryKeys.stats.topics() },
  { field: "sources", key: queryKeys.stats.sources() },
  { field: "dailyByCategory", key: [...queryKeys.stats.all, "dailyByCategory"] },
  { field: "companyTags", key: queryKeys.stats.companyTags() },
  { field: "heatmap", key: queryKeys.stats.heatmap() },
  { field: "difficultyByCategory", key: queryKeys.stats.difficultyByCategory() },
  { field: "streaks", key: queryKeys.stats.streaks() },
  { field: "insights", key: queryKeys.stats.insights() },
];

/** Assemble a batch payload from seeded individual caches when all fields are present. */
export const getBatchFromSeededCaches = (
  queryClient: QueryClient,
  fields: (keyof BatchStatsResponse)[],
): { data: BatchStatsResponse; dataUpdatedAt: number } | null => {
  const data: BatchStatsResponse = {};
  let dataUpdatedAt = Infinity;

  for (const field of fields) {
    const entry = STAT_FIELD_KEYS.find((e) => e.field === field);
    if (!entry) return null;
    const state = queryClient.getQueryState(entry.key as QueryKey);
    if (state?.data === undefined) return null;
    (data as Record<string, unknown>)[field] = state.data;
    dataUpdatedAt = Math.min(dataUpdatedAt, state.dataUpdatedAt);
  }

  return { data, dataUpdatedAt: Number.isFinite(dataUpdatedAt) ? dataUpdatedAt : 0 };
};

export const seedStatsCaches = (queryClient: QueryClient, data: BatchStatsResponse) => {
  for (const { field, key } of STAT_FIELD_KEYS) {
    if (data[field] !== undefined) {
      queryClient.setQueryData(key as QueryKey, data[field]);
    }
  }
  if (data.progress !== undefined) {
    queryClient.setQueryData([...queryKeys.stats.progress(), 14], data.progress);
  }
};

const mapListItem = <T extends { id: string }>(
  items: T[],
  id: string,
  map: (item: T) => T,
): T[] => items.map((item) => (item.id === id ? map(item) : item));

/** Toggle starred across question + backlog list/infinite caches and detail. */
export const toggleStarredInCaches = (queryClient: QueryClient, id: string) => {
  const flip = <T extends { id: string; starred: boolean }>(item: T): T => ({
    ...item,
    starred: !item.starred,
  });

  const apply = (old: unknown) => {
    if (isPaginated(old)) {
      return { ...old, data: mapListItem(old.data as { id: string; starred: boolean }[], id, flip) };
    }
    if (isInfinite(old)) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: mapListItem(page.data as { id: string; starred: boolean }[], id, flip),
        })),
      };
    }
    return old;
  };

  queryClient.setQueriesData({ queryKey: queryKeys.questions.all }, apply);
  queryClient.setQueriesData({ queryKey: queryKeys.backlog.all }, apply);
  queryClient.setQueryData(queryKeys.questions.detail(id), (old: Question | undefined) =>
    old ? flip(old) : old,
  );
};

/** Remove an id from paginated/infinite caches under the given root key(s). */
export const removeIdFromCaches = (queryClient: QueryClient, rootKeys: QueryKey[], id: string) => {
  for (const rootKey of rootKeys) {
    queryClient.setQueriesData({ queryKey: rootKey }, (old: unknown) => {
      if (isPaginated(old)) {
        const data = old.data.filter((q) => q.id !== id);
        if (data.length === old.data.length) return old;
        return { ...old, data, pagination: bumpPagination(old.pagination, -1) };
      }
      if (isInfinite(old)) {
        let removed = false;
        const pages = old.pages.map((page) => {
          const data = page.data.filter((q) => q.id !== id);
          if (data.length === page.data.length) return page;
          removed = true;
          return { ...page, data, pagination: bumpPagination(page.pagination, -1) };
        });
        return removed ? { ...old, pages } : old;
      }
      return old;
    });
  }
};

/** Patch a list item (and detail) from a full/partial question. */
export const patchQuestionInCaches = (
  queryClient: QueryClient,
  question: Pick<QuestionListItem, "id"> & Partial<QuestionListItem>,
) => {
  const patch = <T extends { id: string }>(item: T): T =>
    item.id === question.id ? { ...item, ...question } : item;

  const apply = (old: unknown) => {
    if (isPaginated(old)) {
      return { ...old, data: (old.data as { id: string }[]).map(patch) };
    }
    if (isInfinite(old)) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: (page.data as { id: string }[]).map(patch),
        })),
      };
    }
    return old;
  };

  queryClient.setQueriesData({ queryKey: queryKeys.questions.all }, apply);
  queryClient.setQueriesData({ queryKey: queryKeys.backlog.all }, apply);
  queryClient.setQueryData(queryKeys.questions.detail(question.id), (old: Question | undefined) =>
    old ? { ...old, ...question } : old,
  );
};

export const snapshotQueries = (queryClient: QueryClient, rootKeys: QueryKey[]) => {
  const snapshots: [QueryKey, unknown][] = [];
  for (const rootKey of rootKeys) {
    snapshots.push(...queryClient.getQueriesData({ queryKey: rootKey }));
  }
  return snapshots;
};

export const restoreSnapshots = (queryClient: QueryClient, snapshots: [QueryKey, unknown][] | undefined) => {
  if (!snapshots) return;
  for (const [key, data] of snapshots) {
    queryClient.setQueryData(key, data);
  }
};
