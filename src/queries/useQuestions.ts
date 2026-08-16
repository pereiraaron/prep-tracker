import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  questionsApi,
  fetchQuestionsList,
  type ListQueryParams,
  type CreateQuestionBody,
  type UpdateQuestionBody,
} from "@api/questions";
import { queryKeys } from "@lib/queryKeys";
import { invalidateCoreStats } from "@lib/invalidateStats";
import { invalidateQuestionLists, invalidateBacklogLists } from "@lib/invalidateLists";
import {
  toggleStarredInCaches,
  removeIdFromCaches,
  patchQuestionInCaches,
  snapshotQueries,
  restoreSnapshots,
} from "@lib/queryCache";

// ---- Queries ----

export const useQuestionsList = (params: ListQueryParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: ({ signal }) => fetchQuestionsList(params, { signal }),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useQuestionsInfinite = (
  params: Omit<ListQueryParams, "page"> & { limit: number; enabled?: boolean },
) => {
  const { limit, enabled = true, ...rest } = params;
  const keyParams = { ...params, page: undefined, enabled: undefined };
  return useInfiniteQuery({
    enabled,
    queryKey: queryKeys.questions.infinite(keyParams),
    queryFn: ({ pageParam = 1, signal }) =>
      fetchQuestionsList({ ...rest, page: pageParam, limit }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

export const useQuestionDetail = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.questions.detail(id!),
    queryFn: ({ signal }) => questionsApi.getById(id!, { signal }),
    enabled: !!id,
  });

export const useRecentQuestions = () =>
  useQuery({
    queryKey: queryKeys.questions.recent(),
    queryFn: ({ signal }) =>
      questionsApi.getAll({ sort: "-solvedAt", limit: 5, status: "solved" }, { signal }),
  });

// ---- Suggestions ----

export const useSuggestions = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.questions.suggestions(),
    queryFn: ({ signal }) => questionsApi.getSuggestions({ signal }),
    staleTime: Infinity,
    enabled,
  });

// ---- Mutations ----

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuestionBody) => questionsApi.create(body),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.questions.detail(data.id), data);
      invalidateQuestionLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.suggestions() });
      invalidateCoreStats(queryClient);
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateQuestionBody }) =>
      questionsApi.update(id, body),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(queryKeys.questions.detail(id), data);
      patchQuestionInCaches(queryClient, data);
      invalidateQuestionLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.suggestions() });
      invalidateCoreStats(queryClient);
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onMutate: async (id) => {
      const rootKeys = [queryKeys.questions.all, queryKeys.backlog.all];
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
      invalidateQuestionLists(queryClient);
      invalidateBacklogLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.suggestions() });
      invalidateCoreStats(queryClient);
    },
  });
};

export const useStarQuestion = () => {
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
