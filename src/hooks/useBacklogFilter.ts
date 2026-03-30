import { useBacklogFilterStore } from "@store/useBacklogFilterStore";
import { useShallow } from "zustand/react/shallow";

const useBacklogFilter = () =>
  useBacklogFilterStore(
    useShallow((s) => ({
      search: s.search,
      categoryFilter: s.categoryFilter,
      difficultyFilter: s.difficultyFilter,
      currentPage: s.currentPage,
      showFilters: s.showFilters,
      sort: s.sort,
      setSearch: s.setSearch,
      setCategoryFilter: s.setCategoryFilter,
      setDifficultyFilter: s.setDifficultyFilter,
      setCurrentPage: s.setCurrentPage,
      setShowFilters: s.setShowFilters,
      setSort: s.setSort,
      clearAll: s.clearAll,
    }))
  );

export default useBacklogFilter;
