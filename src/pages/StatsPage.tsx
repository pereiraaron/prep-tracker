import usePageTitle from "@hooks/usePageTitle";
import { lazy, Suspense } from "react";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import Skeleton from "@components/Skeleton";
import StatCard from "@components/StatCard";
import { DashboardStatsSkeleton } from "@components/Skeleton";
import { useStatsBatch } from "@queries/useStats";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import { CheckCircle, ListTodo, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { categoryShort } from "@components/stats/constants";
import { SectionHeader } from "@components/stats/shared";
import Heatmap, { buildHeatmapWeeks } from "@components/stats/Heatmap";
import Streaks from "@components/stats/Streaks";

// Lazy-load chart-heavy components (recharts is 386KB)
const ActivityCharts = lazy(() => import("@components/stats/ActivityCharts"));
const BreakdownCharts = lazy(() => import("@components/stats/BreakdownCharts"));
const InsightsSection = lazy(() => import("@components/stats/Insights"));

const ChartSkeleton = () => (
  <div className="mb-6 grid gap-6 md:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="glass-card rounded-xl p-5">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    ))}
  </div>
);

const StatsPage = () => {
  usePageTitle("Stats & Insights");
  const { data: batch, isLoading } = useStatsBatch();

  const overview = batch?.overview;
  const categoryBreakdown = batch?.categories;
  const difficultyBreakdown = batch?.difficulties;
  const progressData = batch?.progress;
  const weeklyData = batch?.weeklyProgress;
  const cumulativeData = batch?.cumulativeProgress;
  const topicBreakdown = batch?.topics;
  const sourceBreakdown = batch?.sources;
  const companyBreakdown = batch?.companyTags;
  const heatmapData = batch?.heatmap;
  const diffByCategory = batch?.difficultyByCategory;
  const streaks = batch?.streaks;
  const insights = batch?.insights;

  const solved = overview?.totalSolved ?? 0;
  const backlog = overview?.backlogCount ?? 0;

  const categoryData = (categoryBreakdown ?? [])
    .filter((c) => c.count > 0)
    .map((c) => ({
      name: CATEGORY_LABEL[c.category as keyof typeof CATEGORY_LABEL] || c.category,
      short: categoryShort(c.category),
      count: c.count,
      key: c.category,
    }));

  const diffData = (difficultyBreakdown ?? []).map((d) => ({
    name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
    count: d.count,
  }));

  const dailyData = (progressData ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    solved: d.solved,
  }));

  const weeklyChartData = (weeklyData ?? []).map((w) => ({
    week: new Date(w.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    solved: w.solved,
  }));

  const cumulativeChartData = (cumulativeData ?? []).map((c) => ({
    date: new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: c.total,
  }));

  const topicData = (topicBreakdown ?? [])
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((t) => ({ name: t.topic, count: t.count }));

  const sourceData = (sourceBreakdown ?? [])
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((s) => ({ name: SOURCE_LABEL[s.source] || s.source, count: s.count, key: s.source }));

  const companyData = (companyBreakdown ?? [])
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((c) => ({ name: c.companyTag, count: c.count }));

  const diffByCatData = (diffByCategory ?? [])
    .filter((d) => d.total > 0)
    .map((d) => ({ name: categoryShort(d.category), Easy: d.easy, Medium: d.medium, Hard: d.hard }));

  const heatmapWeeks = buildHeatmapWeeks(heatmapData ?? {});

  return (
    <Layout>
      <PageHeader
        icon={BarChart3}
        iconColor="bg-stat-purple/10 text-stat-purple"
        title="Stats & Insights"
        subtitle="Track your interview prep progress"
      />

      {isLoading ? (
        <>
          <DashboardStatsSkeleton />
          <Skeleton className="h-12 w-full rounded-xl mb-8" />
          <ChartSkeleton />
        </>
      ) : (
        <>
          {/* Overview */}
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatCard label="Solved" value={solved || "—"} icon={CheckCircle} color="bg-stat-green/10 text-stat-green" />
            <StatCard label="Backlog" value={backlog || "—"} icon={ListTodo} color="bg-stat-orange/10 text-stat-orange" />
            <StatCard
              label="Streak"
              value={streaks ? `${streaks.currentStreak}d` : "—"}
              icon={TrendingUp}
              color="bg-stat-purple/10 text-stat-purple"
            />
          </div>

          {streaks && <Streaks data={streaks} />}

          <SectionHeader title="Activity" />

          <div className="glass-card mb-6 rounded-xl p-4 md:p-5">
            <h3 className="font-display text-sm font-semibold mb-4">Activity Heatmap</h3>
            {Object.keys(heatmapData ?? {}).length > 0 ? (
              <Heatmap weeks={heatmapWeeks} />
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">Solve some questions and your heatmap will appear here</p>
              </div>
            )}
          </div>

          {/* Charts load lazily — recharts is 386KB */}
          <Suspense fallback={<ChartSkeleton />}>
            <ActivityCharts dailyData={dailyData} weeklyData={weeklyChartData} cumulativeData={cumulativeChartData} />
          </Suspense>

          <SectionHeader title="Breakdowns" />
          <Suspense fallback={<ChartSkeleton />}>
            <BreakdownCharts
              categoryData={categoryData}
              diffData={diffData}
              diffByCatData={diffByCatData}
              topicData={topicData}
              sourceData={sourceData}
              companyData={companyData}
            />
          </Suspense>

          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          }>
            {insights && <InsightsSection insights={insights} />}
          </Suspense>
        </>
      )}
    </Layout>
  );
};

export default StatsPage;
