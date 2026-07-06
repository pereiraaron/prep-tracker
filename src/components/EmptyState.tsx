import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  iconBg?: string;
  title: string;
  description: string;
  tip?: string;
  action?: ReactNode;
}

const EmptyState = ({
  icon: Icon,
  iconBg = "from-primary/15 via-primary/8 to-transparent",
  title,
  description,
  tip,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center py-16 md:py-24 text-center px-4 animate-fade-in">
    <div className="relative mb-5">
      <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl scale-150" aria-hidden />
      <div className={`relative flex h-16 w-16 md:h-[4.5rem] md:w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br ${iconBg} ring-1 ring-border/60 shadow-sm`}>
        <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary/70" />
      </div>
    </div>
    <p className="font-display text-sm md:text-base font-semibold">{title}</p>
    <p className="mt-1.5 max-w-sm text-xs md:text-sm text-muted-foreground/70 leading-relaxed">{description}</p>
    {tip && (
      <p className="mt-3 max-w-xs rounded-lg bg-secondary/50 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
        {tip}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
