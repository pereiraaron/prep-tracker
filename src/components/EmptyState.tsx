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
  <div className="flex flex-col items-center py-16 md:py-24 text-center px-4">
    <div className={`flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl ${iconBg} mb-4`}>
      <Icon className="h-6 w-6 md:h-7 md:w-7 opacity-25" />
    </div>
    <p className="font-display text-sm md:text-base font-semibold">{title}</p>
    <p className="mt-1.5 max-w-xs text-xs md:text-sm text-muted-foreground/70 leading-relaxed">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
