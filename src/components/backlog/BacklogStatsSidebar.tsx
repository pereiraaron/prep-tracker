import { useCategoryBreakdown, useDifficultyBreakdown, useSourceBreakdown } from "@queries/useStats";
import { StatsSidebarSkeleton } from "@components/Skeleton";
import { CATEGORY_COLORS } from "@lib/styles";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import type { PrepCategory } from "@api/types";
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

const BacklogStatsSidebar = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategoryBreakdown();
  const { data: difficulties } = useDifficultyBreakdown();
  const { data: sources } = useSourceBreakdown();

  if (categoriesLoading) return <StatsSidebarSkeleton />;

  const pendingByDiff = {
    easy: difficulties?.find((d) => d.difficulty === "easy")?.pending ?? 0,
    medium: difficulties?.find((d) => d.difficulty === "medium")?.pending ?? 0,
    hard: difficulties?.find((d) => d.difficulty === "hard")?.pending ?? 0,
  };
  const diffTotal = pendingByDiff.easy + pendingByDiff.medium + pendingByDiff.hard;

  const pendingCategories = (categories ?? [])
    .filter((c) => c.pending > 0)
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 5);

  const pendingSources = (sources ?? [])
    .filter((s) => s.pending > 0)
    .sort((a, b) => b.pending - a.pending);

  const srcTotal = pendingSources.reduce((s, x) => s + x.pending, 0);

  return (
    <div className="space-y-4">
      {/* Difficulty breakdown */}
      {diffTotal > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Difficulty</h3>
          <div className="space-y-2.5">
            <DifficultyBar label="Easy" count={pendingByDiff.easy} total={diffTotal} color="bg-emerald-500" />
            <DifficultyBar label="Medium" count={pendingByDiff.medium} total={diffTotal} color="bg-amber-500" />
            <DifficultyBar label="Hard" count={pendingByDiff.hard} total={diffTotal} color="bg-red-500" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/60 border-t border-border pt-2.5">
            <span>Total pending</span>
            <span className="font-semibold">{diffTotal}</span>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {pendingCategories.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Categories</h3>
          <div className="space-y-2">
            {pendingCategories.map((cat) => {
              const colorCls = CATEGORY_COLORS[cat.category] || "";
              const label = CATEGORY_LABEL[cat.category as PrepCategory] || cat.category;
              return (
                <div key={cat.category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${colorCls.split(" ")[0]?.replace("/10", "") || "bg-muted-foreground"}`} />
                    <span className="text-xs font-medium truncate">{label}</span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{cat.pending}</span>
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

      {/* Source breakdown */}
      {pendingSources.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources</h3>
          <div className="space-y-2">
            {pendingSources.map((src) => {
              const label = SOURCE_LABEL[src.source] || src.source;
              const pct = srcTotal > 0 ? (src.pending / srcTotal) * 100 : 0;
              return (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">{src.pending}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-stat-orange/60 transition-all duration-500"
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

export default BacklogStatsSidebar;
