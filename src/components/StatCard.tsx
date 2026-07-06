import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: number;
  trendLabel?: string;
  sparkline?: number[];
  sparkColor?: string;
  sublabel?: string;
}

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 52;
  const h = 22;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 2) - 1}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-50" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
  trendLabel = "vs last week",
  sparkline,
  sparkColor = "hsl(var(--primary))",
  sublabel,
}: StatCardProps) => (
  <div className="glass-card group rounded-xl p-4 transition-all hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
        <p className="mt-1 font-display text-xl md:text-2xl font-bold tabular-nums">{value}</p>
        {trend !== undefined && trend !== 0 && (
          <div className={`mt-1 flex items-center gap-0.5 text-[10px] font-semibold ${trend > 0 ? "text-stat-green" : "text-muted-foreground"}`}>
            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend > 0 ? "+" : ""}
            {trend} {trendLabel}
          </div>
        )}
        {sublabel && !trend && (
          <p className="mt-1 text-[10px] font-medium text-muted-foreground/70">{sublabel}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {sparkline && sparkline.length > 1 && <MiniSparkline data={sparkline} color={sparkColor} />}
      </div>
    </div>
  </div>
);

export default StatCard;
