import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import StatCard from "@components/StatCard";
import { useStatsBatch } from "@queries/useStats";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import { BookOpen, CheckCircle, ListTodo, TrendingUp, Loader2 } from "lucide-react";
import { categoryShort, PRIMARY_COLOR, TEAL_COLOR } from "@components/stats/constants";
import { SectionHeader } from "@components/stats/shared";
import Heatmap, { buildHeatmapWeeks } from "@components/stats/Heatmap";
import Streaks from "@components/stats/Streaks";
import ActivityCharts from "@components/stats/ActivityCharts";
import BreakdownCharts from "@components/stats/BreakdownCharts";
import InsightsSection from "@components/stats/Insights";

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

  const total = overview ? overview.total + overview.backlogCount : 0;
  const solved = overview?.byStatus?.solved ?? 0;
  const backlog = overview?.backlogCount ?? 0;
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

  const categoryData = (categoryBreakdown ?? [])
    .filter((c) => c.total > 0)
    .map((c) => ({
      name: CATEGORY_LABEL[c.category as keyof typeof CATEGORY_LABEL] || c.category,
      short: categoryShort(c.category),
      solved: c.solved,
      pending: c.pending,
    }));

  const diffData = (difficultyBreakdown ?? []).map((d) => ({
    name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
    total: d.total,
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
    .filter((t) => t.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((t) => ({ name: t.topic, solved: t.solved, pending: t.pending }));

  const sourceData = (sourceBreakdown ?? [])
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total)
    .map((s) => ({ name: SOURCE_LABEL[s.source] || s.source, solved: s.solved, pending: s.pending }));

  const companyData = (companyBreakdown ?? [])
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((c) => ({ name: c.companyTag, solved: c.solved, pending: c.pending }));

  const diffByCatData = (diffByCategory ?? [])
    .filter((d) => d.total > 0)
    .map((d) => ({ name: categoryShort(d.category), Easy: d.easy, Medium: d.medium, Hard: d.hard }));

  const heatmapWeeks = buildHeatmapWeeks(heatmapData ?? {});

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-lg md:text-xl font-bold">Stats & Insights</h1>
        <p className="text-sm text-muted-foreground">Track your interview prep progress</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Total" value={total || "—"} icon={BookOpen} color="bg-stat-blue/10 text-stat-blue" />
            <StatCard label="Solved" value={solved || "—"} icon={CheckCircle} color="bg-stat-green/10 text-stat-green" />
            <StatCard label="Remaining" value={backlog || "—"} icon={ListTodo} color="bg-stat-orange/10 text-stat-orange" />
            <StatCard label="Rate" value={total > 0 ? `${completionRate}%` : "—"} icon={TrendingUp} color="bg-stat-purple/10 text-stat-purple" />
          </div>

          {/* Progress bar */}
          <div className="glass-card mb-8 rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-display font-semibold">Overall Progress</span>
              <span className="text-muted-foreground">{solved}/{total}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${completionRate}%`, background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${TEAL_COLOR})` }}
              />
            </div>
          </div>

          {streaks && <Streaks data={streaks} />}

          <SectionHeader title="Activity" />

          <div className="glass-card mb-6 rounded-xl p-4 md:p-5">
            <h3 className="font-display text-sm font-semibold mb-4">Activity Heatmap</h3>
            {Object.keys(heatmapData ?? {}).length > 0 ? (
              <Heatmap weeks={heatmapWeeks} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Solve some questions and your stats will appear here
              </p>
            )}
          </div>

          <ActivityCharts dailyData={dailyData} weeklyData={weeklyChartData} cumulativeData={cumulativeChartData} />

          <SectionHeader title="Breakdowns" />
          <BreakdownCharts
            categoryData={categoryData}
            diffData={diffData}
            diffByCatData={diffByCatData}
            topicData={topicData}
            sourceData={sourceData}
            companyData={companyData}
          />

          {insights && <InsightsSection insights={insights} />}
        </>
      )}
    </Layout>
  );
};

export default StatsPage;
