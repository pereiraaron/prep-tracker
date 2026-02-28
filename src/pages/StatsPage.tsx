import usePageTitle from "@hooks/usePageTitle";
import { useEffect } from "react";
import Layout from "@components/Layout";
import StatCard from "@components/StatCard";
import useStats from "@hooks/useStats";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import { BookOpen, CheckCircle, ListTodo, TrendingUp, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const DIFF_COLORS = [
  "hsl(155, 65%, 42%)",
  "hsl(42, 95%, 52%)",
  "hsl(0, 72%, 55%)",
];
const SOLVED_COLOR = "hsl(155, 65%, 42%)";
const PENDING_COLOR = "hsl(220, 15%, 80%)";
const PRIMARY_COLOR = "hsl(230, 65%, 55%)";
const TEAL_COLOR = "hsl(170, 70%, 45%)";

const categoryShort = (category: string) => {
  const label = CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] || category;
  switch (category) {
    case "language_framework": return "Lang/FW";
    case "machine_coding": return "Machine";
    case "system_design": return "Sys Design";
    default: return label;
  }
};

const NoData = () => (
  <p className="py-8 text-center text-sm text-muted-foreground">
    Solve some questions and your stats will appear here
  </p>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="font-display text-base font-bold mb-4 mt-2">{title}</h2>
);

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`glass-card rounded-xl p-5 ${className}`}>
    <h3 className="font-display text-sm font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const StatsPage = () => {
  usePageTitle("Stats & Insights");
  const {
    overview,
    categories: categoryBreakdown,
    difficulties: difficultyBreakdown,
    progress: progressData,
    weekly: weeklyData,
    cumulative: cumulativeData,
    topics: topicBreakdown,
    sources: sourceBreakdown,
    companyTags: companyBreakdown,
    heatmap: heatmapData,
    difficultyByCategory: diffByCategory,
    isLoading: overviewLoading,
    fetchAll,
  } = useStats();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // --- Derived data ---

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
        <h1 className="font-display text-xl font-bold">Stats & Insights</h1>
        <p className="text-sm text-muted-foreground">
          Track your interview prep progress
        </p>
      </div>

      {overviewLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
      <>

      {/* ── Overview ── */}
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
            style={{
              width: `${completionRate}%`,
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${TEAL_COLOR})`,
            }}
          />
        </div>
      </div>

      {/* ── Activity ── */}
      <SectionHeader title="Activity" />

      {/* Heatmap — full width */}
      <div className="glass-card mb-6 rounded-xl p-5">
        <h3 className="font-display text-sm font-semibold mb-4">Activity Heatmap</h3>
        {Object.keys(heatmapData ?? {}).length > 0 ? (
          <div className="overflow-x-auto">
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${heatmapWeeks.length}, minmax(0, 1fr))`, minWidth: "600px" }}
            >
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day.date ? `${day.date}: ${day.count} solved` : ""}
                      className="aspect-square w-full rounded-full"
                      style={{ backgroundColor: day.date ? heatmapColor(day.count) : "transparent" }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className="h-3 w-3 rounded-full" style={{ backgroundColor: heatmapColor(level === 0 ? 0 : level) }} />
              ))}
              <span>More</span>
            </div>
          </div>
        ) : (
          <NoData />
        )}
      </div>

      {/* Daily / Weekly / Cumulative — 3-col on large, 1-col on mobile */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <ChartCard title="Daily (14 days)">
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Area type="monotone" dataKey="solved" stroke={PRIMARY_COLOR} fill="url(#colorSolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        <ChartCard title="Weekly (12 weeks)">
          {weeklyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Bar dataKey="solved" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        <ChartCard title="Cumulative (90 days)">
          {cumulativeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cumulativeChartData}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL_COLOR} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={TEAL_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke={TEAL_COLOR} fill="url(#colorCumulative)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>

      {/* ── Breakdowns ── */}
      <SectionHeader title="Breakdowns" />

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        {/* Category — solved vs pending */}
        <ChartCard title="By Category">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="short" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="solved" stackId="a" fill={SOLVED_COLOR} />
                <Bar dataKey="pending" stackId="a" fill={PENDING_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Difficulty pie */}
        <ChartCard title="By Difficulty">
          {diffData.some((d) => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Tooltip formatter={(value, name) => `${name}: ${value}`} />
                <Pie data={diffData} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {diffData.map((_, i) => (
                    <Cell key={i} fill={DIFF_COLORS[i]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Difficulty × Category stacked */}
        <ChartCard title="Difficulty × Category">
          {diffByCatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={diffByCatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Easy" stackId="a" fill={DIFF_COLORS[0]} />
                <Bar dataKey="Medium" stackId="a" fill={DIFF_COLORS[1]} />
                <Bar dataKey="Hard" stackId="a" fill={DIFF_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>

      {/* ── Sources & Tags ── */}
      <SectionHeader title="Sources & Tags" />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Topics */}
        <ChartCard title="Top Topics">
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, topicData.length * 28)}>
              <BarChart data={topicData} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={85} />
                <Tooltip />
                <Bar dataKey="solved" stackId="a" fill={SOLVED_COLOR} />
                <Bar dataKey="pending" stackId="a" fill={PENDING_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Sources */}
        <ChartCard title="By Source">
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, sourceData.length * 35)}>
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={95} />
                <Tooltip />
                <Bar dataKey="solved" stackId="a" fill={SOLVED_COLOR} />
                <Bar dataKey="pending" stackId="a" fill={PENDING_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Company tags */}
        <ChartCard title="Top Companies">
          {companyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, companyData.length * 28)}>
              <BarChart data={companyData} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={85} />
                <Tooltip />
                <Bar dataKey="solved" stackId="a" fill={PRIMARY_COLOR} />
                <Bar dataKey="pending" stackId="a" fill={PENDING_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>
      </>
      )}
    </Layout>
  );
};

// --- Heatmap helpers ---

const heatmapColor = (count: number): string => {
  if (count === 0) return "hsl(220, 15%, 90%)";
  if (count === 1) return "hsl(155, 50%, 75%)";
  if (count === 2) return "hsl(155, 55%, 58%)";
  if (count <= 4) return "hsl(155, 60%, 42%)";
  return "hsl(155, 65%, 30%)";
};

interface HeatmapDay {
  date: string;
  count: number;
}

const buildHeatmapWeeks = (data: Record<string, number>): HeatmapDay[][] => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const weeks: HeatmapDay[][] = [];
  let current = new Date(start);

  while (current <= today) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      if (current > today) {
        week.push({ date: "", count: 0 });
      } else {
        const dateStr = current.toISOString().split("T")[0];
        week.push({ date: dateStr, count: data[dateStr] ?? 0 });
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

export default StatsPage;
