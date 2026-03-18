import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi, type QuestionsFilter, type CreateBacklogQuestionBody } from "@api/questions";
import { queryKeys } from "@lib/queryKeys";

// ---- Queries ----

interface BacklogListParams extends QuestionsFilter {
  search?: string;
}

export const useBacklogList = (params: BacklogListParams = {}, enabled = true) => {
  const { search, ...filter } = params;
  return useQuery({
    queryKey: queryKeys.backlog.list(params),
    queryFn: () =>
      search
        ? questionsApi.search(search, {
            status: "pending",
            difficulty: filter.difficulty,
            category: filter.category,
            page: filter.page,
            limit: filter.limit,
          })
        : questionsApi.getBacklog(filter),
    enabled,
  });
};

export const useBacklogInfinite = (params: Omit<BacklogListParams, "page"> & { limit: number; enabled?: boolean }) => {
  const { search, limit, enabled = true, ...filter } = params;
  const keyParams = { ...params, page: undefined, enabled: undefined };
  return useInfiniteQuery({
    enabled,
    queryKey: queryKeys.backlog.infinite(keyParams),
    queryFn: ({ pageParam = 1 }) =>
      search
        ? questionsApi.search(search, {
            status: "pending",
            difficulty: filter.difficulty,
            category: filter.category,
            page: pageParam,
            limit,
          })
        : questionsApi.getBacklog({ ...filter, page: pageParam, limit }),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    },
  });
};

export const useDeleteBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
};

export const useStarBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.star(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.backlog.all });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.backlog.all });

      queryClient.setQueriesData({ queryKey: queryKeys.backlog.all }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        if ("data" in old && Array.isArray((old as { data: unknown[] }).data)) {
          const typed = old as { data: { id: string; starred: boolean }[] };
          return { ...typed, data: typed.data.map((q) => q.id === id ? { ...q, starred: !q.starred } : q) };
        }
        if ("pages" in old && Array.isArray((old as { pages: unknown[] }).pages)) {
          const typed = old as { pages: { data: { id: string; starred: boolean }[] }[]; pageParams: unknown[] };
          return {
            ...typed,
            pages: typed.pages.map((page) => ({
              ...page,
              data: page.data.map((q) => q.id === id ? { ...q, starred: !q.starred } : q),
            })),
          };
        }
        return old;
      });

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
    },
  });
};

export const useSolveBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, solution }: { id: string; solution: string }) =>
      questionsApi.solve(id, { solution }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    },
  });
};
