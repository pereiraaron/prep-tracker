import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@lib/queryKeys";

/** Mark stats stale; only refetch queries currently mounted. */
export const invalidateCoreStats = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.stats.all,
    refetchType: "active",
  });
};
