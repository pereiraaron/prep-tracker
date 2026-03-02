import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi, type CreateBacklogQuestionBody } from "@api/questions";
import type { PrepCategory } from "@api/types";
import { queryKeys } from "@lib/queryKeys";

// ---- Query ----

export const useBacklogList = () =>
  useQuery({
    queryKey: queryKeys.backlog.all,
    queryFn: () => questionsApi.getBacklog({ limit: 100 }),
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
    },
  });
};

export const useSolveBacklogItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, category }: { id: string; category: PrepCategory }) => {
      await questionsApi.update(id, { category });
      return questionsApi.solve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.backlog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    },
  });
};
