import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: number;
  trendLabel?: string;
  sublabel?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel = "vs last week",
  sublabel,
}: StatCardProps) => (
  <div className="glass-card group rounded-xl p-4 transition-all hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
        <div className="mt-1 flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-2 sm:flex-wrap">
          <p className="font-display text-xl md:text-2xl font-bold tabular-nums leading-none">{value}</p>
          {trend !== undefined && trend !== 0 && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${trend > 0 ? "text-stat-green" : "text-muted-foreground"}`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend > 0 ? "+" : ""}
              {trend} {trendLabel}
            </span>
          )}
          {sublabel && (trend === undefined || trend === 0) && (
            <span className="text-[10px] font-medium text-muted-foreground/70">{sublabel}</span>
          )}
        </div>
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
