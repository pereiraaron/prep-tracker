import { useCallback, useEffect, useState } from "react";
import { LuBookOpen, LuCircleCheck, LuListTodo, LuTarget } from "react-icons/lu";
import { statsApi } from "@api/stats";
import type {
  OverviewResponse,
  CategoryBreakdown,
  DifficultyBreakdown,
  SourceBreakdown,
  ProgressDay,
  WeeklyProgress,
} from "@api/stats";
import PageContainer from "@components/PageContainer";
import { ErrorState } from "@components/EmptyState";
import StatCard from "@components/StatCard";
import Card from "@components/Card";
import ProgressBar from "@components/ProgressBar";
import DailyProgressChart from "./components/DailyProgressChart";
import WeeklyProgressChart from "./components/WeeklyProgressChart";
import HeatmapCalendar from "./components/HeatmapCalendar";
import CategoryBarChart from "./components/CategoryBarChart";
import DifficultyPieChart from "./components/DifficultyPieChart";
import TopicBreakdownSection from "./components/TopicBreakdownSection";
import SourceBreakdownSection from "./components/SourceBreakdownSection";

const Stats = () => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyBreakdown[]>([]);
  const [sources, setSources] = useState<SourceBreakdown[]>([]);
  const [dailyProgress, setDailyProgress] = useState<ProgressDay[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      statsApi.getOverview(),
      statsApi.getCategoryBreakdown(),
      statsApi.getDifficultyBreakdown(),
      statsApi.getSourceBreakdown(),
      statsApi.getProgress(30),
      statsApi.getWeeklyProgress(12),
      statsApi.getHeatmap(),
    ])
      .then(([o, c, d, s, dp, wp, hm]) => {
        setOverview(o);
        setCategories(c);
        setDifficulties(d);
        setSources(s);
        setDailyProgress(dp);
        setWeeklyProgress(wp);
        setHeatmapData(hm);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={fetchStats} />
      </PageContainer>
    );
  }

  const solved = overview?.byStatus.solved || 0;
  const total = overview?.total || 0;
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

  if (overview && overview.total === 0 && overview.backlogCount === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-3 py-16">
          <p className="text-(--muted-foreground) text-lg">No data to show yet</p>
          <p className="text-(--muted-foreground) text-sm">
            Solve some questions to see your statistics here.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <h2 className="text-lg md:text-xl font-bold mb-1">
        Stats & Insights
      </h2>
      <p className="text-sm text-(--muted-foreground) mb-6 md:mb-8">
        Track your interview prep progress
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard icon={<LuBookOpen size={20} />} label="Total" value={total} color="var(--color-stat-blue)" />
        <StatCard icon={<LuCircleCheck size={20} />} label="Solved" value={solved} color="var(--color-stat-green)" />
        <StatCard icon={<LuListTodo size={20} />} label="Remaining" value={(overview?.byStatus.pending || 0) + (overview?.backlogCount || 0)} color="var(--color-stat-orange)" />
        <StatCard icon={<LuTarget size={20} />} label="Rate" value={completionRate} suffix="%" color="var(--color-stat-purple)" />
      </div>

      {/* Progress bar */}
      <Card className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Overall Progress</h3>
          <span className="text-xs text-(--muted-foreground) font-mono">
            {solved}/{total}
          </span>
        </div>
        <ProgressBar value={completionRate} color="var(--color-primary)" size="md" />
      </Card>

      {/* Charts 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        <DailyProgressChart data={dailyProgress} />
        <CategoryBarChart data={categories} />
      </div>

      {/* Difficulty full-width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        <WeeklyProgressChart data={weeklyProgress} />
        <DifficultyPieChart data={difficulties} />
      </div>

      {/* Heatmap */}
      <HeatmapCalendar data={heatmapData} />

      {/* Topic & Source breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-6 mt-6 md:mt-8">
        <TopicBreakdownSection />
        <SourceBreakdownSection data={sources} />
      </div>
    </PageContainer>
  );
};

export default Stats;
