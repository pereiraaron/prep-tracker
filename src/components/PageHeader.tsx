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
  <div className="mb-5 md:mb-8 flex items-center justify-between gap-3 md:gap-4">
    <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0">
      <div className={`flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
        <Icon className="h-4 w-4 md:h-5 md:w-5" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-base md:text-xl font-bold">{title}</h1>
          {count !== undefined && count > 0 && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-xs font-semibold tabular-nums ${countColor}`}>
              {count}
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
      </div>
    </div>
    {actions}
  </div>
);

export default PageHeader;
