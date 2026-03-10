import { Flame, Zap, Calendar } from "lucide-react";

interface StreaksData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

const streakItems = [
  { key: "currentStreak" as const, label: "Current Streak", icon: Flame, color: "bg-stat-orange/10", iconColor: "text-stat-orange" },
  { key: "longestStreak" as const, label: "Best Streak", icon: Zap, color: "bg-stat-purple/10", iconColor: "text-stat-purple" },
  { key: "totalActiveDays" as const, label: "Active Days", icon: Calendar, color: "bg-stat-blue/10", iconColor: "text-stat-blue" },
];

const Streaks = ({ data }: { data: StreaksData }) => (
  <div className="mb-8 grid grid-cols-3 gap-3">
    {streakItems.map(({ key, label, icon: Icon, color, iconColor }) => (
      <div key={key} className="glass-card rounded-xl p-4 text-center">
        <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <p className="font-display text-xl md:text-2xl font-bold">{data[key]}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    ))}
  </div>
);

export default Streaks;
