import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi, type QuestionsFilter, type CreateQuestionBody, type UpdateQuestionBody } from "@api/questions";
import { queryKeys } from "@lib/queryKeys";

// ---- Queries ----

interface ListParams extends QuestionsFilter {
  search?: string;
}

export const useQuestionsList = (params: ListParams = {}, enabled = true) => {
  const { search, ...filter } = params;
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () =>
      search
        ? questionsApi.search(search, {
            status: filter.status,
            difficulty: filter.difficulty,
            category: filter.category,
            page: filter.page,
            limit: filter.limit,
          })
        : questionsApi.getAll(filter),
    enabled,
  });
};

export const useQuestionsInfinite = (params: Omit<ListParams, "page"> & { limit: number; enabled?: boolean }) => {
  const { search, limit, enabled = true, ...filter } = params;
  const keyParams = { ...params, page: undefined, enabled: undefined };
  return useInfiniteQuery({
    enabled,
    queryKey: queryKeys.questions.infinite(keyParams),
    queryFn: ({ pageParam = 1 }) =>
      search
        ? questionsApi.search(search, {
            status: filter.status,
            difficulty: filter.difficulty,
            category: filter.category,
            page: pageParam,
            limit,
          })
        : questionsApi.getAll({ ...filter, page: pageParam, limit }),
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
    queryFn: () => questionsApi.getById(id!),
    enabled: !!id,
  });

export const useRecentQuestions = () =>
  useQuery({
    queryKey: queryKeys.questions.recent(),
    queryFn: () => questionsApi.getAll({ sort: "-solvedAt", limit: 5, status: "solved" }),
  });

// ---- Playground ----

export const useTemplates = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.questions.templates(id!),
    queryFn: () => questionsApi.getTemplates(id!),
    enabled: !!id,
  });

export const useSubmission = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.questions.submission(id!),
    queryFn: () => questionsApi.getSubmission(id!),
    enabled: !!id,
  });

export const useSaveSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: Record<string, string> }) =>
      questionsApi.saveSubmission(id, files),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.submission(id) });
    },
  });
};

// ---- Mutations ----

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuestionBody) => questionsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateQuestionBody }) => questionsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
    },
  });
};

export const useStarQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.star(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.questions.all });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.questions.all });

      // Optimistically toggle starred in all question caches
      queryClient.setQueriesData({ queryKey: queryKeys.questions.all }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        // Paginated shape: { data: Question[], pagination }
        if ("data" in old && Array.isArray((old as { data: unknown[] }).data)) {
          const typed = old as { data: { id: string; starred: boolean }[] };
          return { ...typed, data: typed.data.map((q) => q.id === id ? { ...q, starred: !q.starred } : q) };
        }
        // Infinite shape: { pages: [...], pageParams }
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
      // Rollback on error
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    },
  });
};
