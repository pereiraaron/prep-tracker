import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  questionsApi,
  fetchBacklogList,
  type ListQueryParams,
  type CreateBacklogQuestionBody,
  type Solution,
} from "@api/questions";
import { queryKeys } from "@lib/queryKeys";
import { useBacklogFilterStore } from "@store/useBacklogFilterStore";
import { useQuestionsFilterStore } from "@store/useQuestionsFilterStore";
import { invalidateCoreStats } from "@lib/invalidateStats";
import { invalidateQuestionLists, invalidateBacklogLists } from "@lib/invalidateLists";
import {
  toggleStarredInCaches,
  removeIdFromCaches,
  snapshotQueries,
  restoreSnapshots,
} from "@lib/queryCache";

// ---- Queries ----

export const useBacklogList = (params: ListQueryParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.backlog.list(params),
    queryFn: ({ signal }) => fetchBacklogList(params, { signal }),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useBacklogInfinite = (
  params: Omit<ListQueryParams, "page"> & { limit: number; enabled?: boolean },
) => {
  const { limit, enabled = true, ...rest } = params;
  const keyParams = { ...params, page: undefined, enabled: undefined };
  return useInfiniteQuery({
    enabled,
    queryKey: queryKeys.backlog.infinite(keyParams),
    queryFn: ({ pageParam = 1, signal }) =>
      fetchBacklogList({ ...rest, page: pageParam, limit }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// ---- Mutations ----

export const useCreateBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBacklogQuestionBody) => questionsApi.createBacklog(body),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.questions.detail(data.id), data);
      invalidateBacklogLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.suggestions() });
      invalidateCoreStats(queryClient);
      invalidateQuestionLists(queryClient);
    },
  });
};

export const useDeleteBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onMutate: async (id) => {
      const rootKeys = [queryKeys.backlog.all, queryKeys.questions.all];
      await Promise.all(rootKeys.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const snapshots = snapshotQueries(queryClient, rootKeys);
      removeIdFromCaches(queryClient, rootKeys, id);
      queryClient.removeQueries({ queryKey: queryKeys.questions.detail(id) });
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      restoreSnapshots(queryClient, context?.snapshots);
    },
    onSettled: () => {
      invalidateBacklogLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.suggestions() });
      invalidateCoreStats(queryClient);
    },
  });
};

export const useStarBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.star(id),
    onMutate: async (id) => {
      const rootKeys = [queryKeys.questions.all, queryKeys.backlog.all];
      await Promise.all(rootKeys.map((key) => queryClient.cancelQueries({ queryKey: key })));
      const snapshots = snapshotQueries(queryClient, rootKeys);
      toggleStarredInCaches(queryClient, id);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      restoreSnapshots(queryClient, context?.snapshots);
    },
  });
};

export const useSolveBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, solutions }: { id: string; solutions?: Solution[] }) =>
      questionsApi.solve(id, solutions?.length ? { solutions } : undefined),
    onMutate: async ({ id }) => {
      const rootKeys = [queryKeys.backlog.all];
      await queryClient.cancelQueries({ queryKey: queryKeys.backlog.all });
      const snapshots = snapshotQueries(queryClient, rootKeys);
      removeIdFromCaches(queryClient, rootKeys, id);
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      restoreSnapshots(queryClient, context?.snapshots);
    },
    onSuccess: (data) => {
      useBacklogFilterStore.getState().setCurrentPage(1);
      useQuestionsFilterStore.getState().setCurrentPage(1);
      queryClient.setQueryData(queryKeys.questions.detail(data.id), data);
      invalidateQuestionLists(queryClient);
      invalidateCoreStats(queryClient);
    },
    onSettled: () => {
      invalidateBacklogLists(queryClient);
    },
  });
};
