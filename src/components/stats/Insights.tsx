import { AlertTriangle, Trophy } from "lucide-react";
import { CHART_BLUE, MILESTONE_ICONS } from "./constants";
import { SectionHeader } from "./shared";

interface WeakArea {
  type: string;
  name: string;
  total: number;
  solved: number;
  completionRate: number;
  lastSolvedDaysAgo: number | null;
}

interface Milestone {
  name: string;
  achieved: boolean;
  progress: string;
}

interface InsightsData {
  weakAreas: WeakArea[];
  milestones: Milestone[];
  tips: { text: string; priority: string }[];
}

const InsightsSection = ({ insights }: { insights: InsightsData }) => {
  if (!insights.weakAreas.length && !insights.milestones.length) return null;

  return (
    <>
      <SectionHeader title="Insights" />

      {insights.weakAreas.length > 0 && (
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-stat-orange" />
            <h3 className="font-display text-sm font-semibold">Weak Areas</h3>
          </div>
          <div className="space-y-3">
            {insights.weakAreas.map((area, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{area.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {area.solved}/{area.total} ({area.completionRate}%)
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${area.completionRate}%`,
                      background:
                        area.completionRate < 40
                          ? "hsl(0, 72%, 55%)"
                          : area.completionRate < 70
                            ? "hsl(42, 95%, 52%)"
                            : "hsl(155, 65%, 42%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.milestones.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-stat-purple" />
            <h3 className="font-display text-sm font-semibold">Milestones</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {insights.milestones.map((m, i) => {
              const [current, target] = m.progress.split("/").map(Number);
              const pct = target > 0 ? Math.round((current / target) * 100) : 0;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    m.achieved ? "border-stat-green/30 bg-stat-green/5" : "border-border bg-secondary/20"
                  }`}
                >
                  <span className="text-2xl">{MILESTONE_ICONS[m.name] ?? "🎯"}</span>
                  <p className="font-display text-xs font-semibold mt-1 truncate">{m.name}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: m.achieved ? "hsl(155, 65%, 42%)" : CHART_BLUE,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{m.progress}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default InsightsSection;
