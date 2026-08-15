import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle: string;
  count?: number;
  countColor?: string;
  actions?: ReactNode;
}

const PageHeader = ({
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  title,
  subtitle,
  count,
  countColor = "bg-primary/10 text-primary",
  actions,
}: PageHeaderProps) => (
  <div className="mb-6 md:mb-9 flex items-start justify-between gap-3 md:gap-4">
    <div className="flex items-center gap-3 md:gap-4 min-w-0">
      <div
        className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-sm ${iconColor}`}
      >
        <Icon className="h-4 w-4 md:h-5 md:w-5" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-lg md:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {count !== undefined && count > 0 && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold tabular-nums ring-1 ring-inset ring-black/5 dark:ring-white/10 ${countColor}`}
            >
              {count}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs md:text-sm text-muted-foreground/80 truncate">{subtitle}</p>
      </div>
    </div>
    {actions}
  </div>
);

export default PageHeader;
