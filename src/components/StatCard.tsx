import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="glass-card rounded-xl p-4 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</p>
        <p className="mt-1 font-display text-xl md:text-2xl font-bold tabular-nums">{value}</p>
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
