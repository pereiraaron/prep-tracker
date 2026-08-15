import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";

/** Invalidate all stats caches when questions change. */
export const invalidateCoreStats = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
};
