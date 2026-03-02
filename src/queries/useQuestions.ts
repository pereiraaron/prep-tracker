import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi, type QuestionsFilter, type CreateQuestionBody, type UpdateQuestionBody } from "@api/questions";
import { queryKeys } from "@lib/queryKeys";

// ---- Queries ----

interface ListParams extends QuestionsFilter {
  search?: string;
}

export const useQuestionsList = (params: ListParams = {}) => {
  const { search, ...filter } = params;
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () =>
      search
        ? questionsApi.search(search, { difficulty: filter.difficulty, page: filter.page, limit: filter.limit })
        : questionsApi.getAll(filter),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    },
  });
};
