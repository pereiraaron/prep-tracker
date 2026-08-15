import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";

/** Invalidate question list / infinite / recent — not detail. */
export const invalidateQuestionLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [...queryKeys.questions.all, "list"] });
  queryClient.invalidateQueries({ queryKey: [...queryKeys.questions.all, "infinite"] });
  queryClient.invalidateQueries({ queryKey: queryKeys.questions.recent() });
};

/** Invalidate backlog list / infinite only. */
export const invalidateBacklogLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [...queryKeys.backlog.all, "list"] });
  queryClient.invalidateQueries({ queryKey: [...queryKeys.backlog.all, "infinite"] });
};
