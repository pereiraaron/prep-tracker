import { Flame, Zap, Calendar } from "lucide-react";

interface StreaksData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

const streakItems = [
  { key: "currentStreak" as const, label: "Current Streak", suffix: "d", icon: Flame, color: "bg-stat-orange/10", iconColor: "text-stat-orange" },
  { key: "longestStreak" as const, label: "Best Streak", suffix: "d", icon: Zap, color: "bg-stat-yellow/10", iconColor: "text-stat-yellow" },
  { key: "totalActiveDays" as const, label: "Active Days", suffix: "", icon: Calendar, color: "bg-stat-sky/10", iconColor: "text-stat-sky" },
];

const Streaks = ({ data }: { data: StreaksData }) => (
  <div className="mb-6 grid grid-cols-3 gap-3">
    {streakItems.map(({ key, label, suffix, icon: Icon, color, iconColor }) => (
      <div key={key} className="glass-card glass-lift rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
            <p className="mt-1 font-display text-xl md:text-2xl font-bold tabular-nums tracking-tight">
              {data[key]}
              {suffix && <span className="text-xs font-normal text-muted-foreground/60">{suffix}</span>}
            </p>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10 ${color}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Streaks;
