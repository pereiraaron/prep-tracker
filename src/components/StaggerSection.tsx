import { ReactNode } from "react";
import { cn } from "@lib/utils";

interface StaggerSectionProps {
  index: number;
  children: ReactNode;
  className?: string;
}

const StaggerSection = ({ index, children, className }: StaggerSectionProps) => (
  <div
    className={cn("animate-slide-up", className)}
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {children}
  </div>
);

export default StaggerSection;
