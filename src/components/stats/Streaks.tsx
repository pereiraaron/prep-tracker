import { Flame, Zap, Calendar } from "lucide-react";

interface StreaksData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

const streakItems = [
  { key: "currentStreak" as const, label: "Current Streak", suffix: "d", icon: Flame, color: "bg-stat-orange/10", iconColor: "text-stat-orange" },
  { key: "longestStreak" as const, label: "Best Streak", suffix: "d", icon: Zap, color: "bg-stat-pink/10", iconColor: "text-stat-pink" },
  { key: "totalActiveDays" as const, label: "Active Days", suffix: "", icon: Calendar, color: "bg-stat-purple/10", iconColor: "text-stat-purple" },
];

const Streaks = ({ data }: { data: StreaksData }) => (
  <div className="mb-6 grid grid-cols-3 gap-3">
    {streakItems.map(({ key, label, suffix, icon: Icon, color, iconColor }) => (
      <div key={key} className="glass-card rounded-xl p-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
            <p className="mt-1 font-display text-xl md:text-2xl font-bold tabular-nums">
              {data[key]}
              {suffix && <span className="text-xs font-normal text-muted-foreground/60">{suffix}</span>}
            </p>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Streaks;
