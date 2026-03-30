import { useOverview, useStreaks, useCategoryBreakdown, useDifficultyBreakdown, useSourceBreakdown } from "@queries/useStats";
import { StatsSidebarSkeleton } from "@components/Skeleton";
import { CATEGORY_COLORS } from "@lib/styles";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import type { PrepCategory } from "@api/types";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const DifficultyBar = ({ label, count, total, color }: { label: string; count: number; total: number; color: string }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-14 text-[11px] font-medium text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-right text-[11px] font-semibold tabular-nums">{count}</span>
    </div>
  );
};

const StatsSidebar = () => {
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: streaks, isLoading: streaksLoading } = useStreaks();
  const { data: categories } = useCategoryBreakdown();
  const { data: difficulties } = useDifficultyBreakdown();
  const { data: sources } = useSourceBreakdown();

  if (overviewLoading || streaksLoading) return <StatsSidebarSkeleton />;

  const solved = overview?.totalSolved ?? 0;
  const currentStreak = streaks?.currentStreak ?? 0;
  const longestStreak = streaks?.longestStreak ?? 0;

  const diffTotal = difficulties?.reduce((s, d) => s + d.count, 0) ?? 0;
  const easyCount = difficulties?.find((d) => d.difficulty === "easy")?.count ?? 0;
  const mediumCount = difficulties?.find((d) => d.difficulty === "medium")?.count ?? 0;
  const hardCount = difficulties?.find((d) => d.difficulty === "hard")?.count ?? 0;

  const topCategories = (categories ?? [])
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSources = (sources ?? [])
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const srcTotal = topSources.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Target className="h-3 w-3 text-stat-green" />
              <span className="text-[10px] font-medium text-muted-foreground">Solved</span>
            </div>
            <p className="font-display text-lg font-bold">{solved}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Flame className="h-3 w-3 text-stat-orange" />
              <span className="text-[10px] font-medium text-muted-foreground">Streak</span>
            </div>
            <p className="font-display text-lg font-bold">{currentStreak}<span className="text-xs font-normal text-muted-foreground ml-0.5">d</span></p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Trophy className="h-3 w-3 text-stat-purple" />
              <span className="text-[10px] font-medium text-muted-foreground">Best</span>
            </div>
            <p className="font-display text-lg font-bold">{longestStreak}<span className="text-xs font-normal text-muted-foreground ml-0.5">d</span></p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <TrendingUp className="h-3 w-3 text-stat-blue" />
              <span className="text-[10px] font-medium text-muted-foreground">Backlog</span>
            </div>
            <p className="font-display text-lg font-bold">{overview?.backlogCount ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Difficulty</h3>
        <div className="space-y-2.5">
          <DifficultyBar label="Easy" count={easyCount} total={diffTotal} color="bg-emerald-500" />
          <DifficultyBar label="Medium" count={mediumCount} total={diffTotal} color="bg-amber-500" />
          <DifficultyBar label="Hard" count={hardCount} total={diffTotal} color="bg-red-500" />
        </div>
        {diffTotal > 0 && (
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/60 border-t border-border pt-2.5">
            <span>Total with difficulty</span>
            <span className="font-semibold">{diffTotal}</span>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {topCategories.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Categories</h3>
          <div className="space-y-2">
            {topCategories.map((cat) => {
              const colorCls = CATEGORY_COLORS[cat.category] || "";
              const label = CATEGORY_LABEL[cat.category as PrepCategory] || cat.category;
              return (
                <div key={cat.category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${colorCls.split(" ")[0]?.replace("/10", "") || "bg-muted-foreground"}`} />
                    <span className="text-xs font-medium truncate">{label}</span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{cat.count}</span>
                </div>
              );
            })}
          </div>
          <Link
            to="/stats"
            className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            View all stats
          </Link>
        </div>
      )}

      {/* Sources breakdown */}
      {topSources.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources</h3>
          <div className="space-y-2">
            {topSources.map((src) => {
              const label = SOURCE_LABEL[src.source] || src.source;
              const pct = srcTotal > 0 ? (src.count / srcTotal) * 100 : 0;
              return (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">{src.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-stat-blue/60 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSidebar;
