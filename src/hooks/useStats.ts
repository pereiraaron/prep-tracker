import { useStatsStore } from "@store/useStatsStore";
import { useShallow } from "zustand/react/shallow";

const useStats = () =>
  useStatsStore(
    useShallow((s) => ({
      overview: s.overview,
      categories: s.categories,
      difficulties: s.difficulties,
      progress: s.progress,
      weekly: s.weekly,
      cumulative: s.cumulative,
      topics: s.topics,
      sources: s.sources,
      companyTags: s.companyTags,
      heatmap: s.heatmap,
      difficultyByCategory: s.difficultyByCategory,
      isLoading: s.isLoading,
      error: s.error,
      fetchAll: s.fetchAll,
      fetchOverview: s.fetchOverview,
    })),
  );

export default useStats;
