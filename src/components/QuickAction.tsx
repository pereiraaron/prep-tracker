import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import prefetchRoute from "@lib/prefetchRoute";

interface QuickActionProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const QuickAction = ({ to, icon: Icon, label, description }: QuickActionProps) => (
  <Link
    to={to}
    onMouseEnter={() => prefetchRoute(to)}
    onFocus={() => prefetchRoute(to)}
    className="glass-card group flex items-center gap-3 rounded-xl p-3.5 transition-all hover:shadow-md"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium group-hover:text-primary transition-colors">{label}</p>
      <p className="text-[11px] text-muted-foreground/70">{description}</p>
    </div>
    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground/50 group-hover:translate-x-0.5" />
  </Link>
);

export default QuickAction;
