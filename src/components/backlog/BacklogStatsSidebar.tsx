import { useCategoryBreakdown, useDifficultyBreakdown, useSourceBreakdown } from "@queries/useStats";
import { StatsSidebarSkeleton } from "@components/Skeleton";
import { CATEGORY_COLORS } from "@lib/styles";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";
import type { PrepCategory } from "@api/types";
import { Layers, BarChart3 } from "lucide-react";

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
  const { data: categories, isLoading: catLoading } = useCategoryBreakdown();
  const { data: difficulties, isLoading: diffLoading } = useDifficultyBreakdown();
  const { data: sources } = useSourceBreakdown();

  if (catLoading || diffLoading) return <StatsSidebarSkeleton />;

  // Difficulty — pending counts
  const easyPending = difficulties?.find((d) => d.difficulty === "easy")?.pending ?? 0;
  const mediumPending = difficulties?.find((d) => d.difficulty === "medium")?.pending ?? 0;
  const hardPending = difficulties?.find((d) => d.difficulty === "hard")?.pending ?? 0;
  const diffTotal = easyPending + mediumPending + hardPending;

  // Categories — pending counts
  const topCategories = (categories ?? [])
    .filter((c) => c.pending > 0)
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 5);

  // Sources — pending counts
  const topSources = (sources ?? [])
    .filter((s) => s.pending > 0)
    .sort((a, b) => b.pending - a.pending);

  return (
    <div className="space-y-4">
      {/* Difficulty breakdown — pending items */}
      {diffTotal > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Difficulty</h3>
          <div className="space-y-2.5">
            <DifficultyBar label="Easy" count={easyPending} total={diffTotal} color="bg-emerald-500" />
            <DifficultyBar label="Medium" count={mediumPending} total={diffTotal} color="bg-amber-500" />
            <DifficultyBar label="Hard" count={hardPending} total={diffTotal} color="bg-red-500" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/60 border-t border-border pt-2.5">
            <span>Pending with difficulty</span>
            <span className="font-semibold">{diffTotal}</span>
          </div>
        </div>
      )}

      {/* Category breakdown — pending items */}
      {topCategories.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Layers className="h-3 w-3 text-muted-foreground" />
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
          </div>
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
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{cat.pending}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources breakdown — pending items */}
      {topSources.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <BarChart3 className="h-3 w-3 text-muted-foreground" />
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sources</h3>
          </div>
          <div className="space-y-2">
            {topSources.map((src) => {
              const label = SOURCE_LABEL[src.source] || src.source;
              const srcTotal = topSources.reduce((s, x) => s + x.pending, 0);
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
