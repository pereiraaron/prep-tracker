import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  iconBg?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ icon: Icon, iconBg = "bg-muted/50", title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center py-12 md:py-20 text-center px-4">
    <div className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl ${iconBg} mb-3 md:mb-4`}>
      <Icon className="h-5 w-5 md:h-6 md:w-6 opacity-30" />
    </div>
    <p className="font-display text-sm font-semibold">{title}</p>
    <p className="mt-1 max-w-xs text-xs md:text-sm text-muted-foreground">{description}</p>
    {action && <div className="mt-4 md:mt-5">{action}</div>}
  </div>
);

export default EmptyState;
