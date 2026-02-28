import { useBacklogStore } from "@store/useBacklogStore";
import { useShallow } from "zustand/react/shallow";

const useBacklog = () =>
  useBacklogStore(
    useShallow((s) => ({
      items: s.items,
      isLoading: s.isLoading,
      error: s.error,
      creating: s.creating,
      fetchBacklog: s.fetchBacklog,
      createBacklogItem: s.createBacklogItem,
      deleteBacklogItem: s.deleteBacklogItem,
      starBacklogItem: s.starBacklogItem,
      solveBacklogItem: s.solveBacklogItem,
    })),
  );

export default useBacklog;
