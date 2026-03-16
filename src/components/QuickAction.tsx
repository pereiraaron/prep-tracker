import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const QuickAction = ({ to, icon: Icon, label, description }: QuickActionProps) => (
  <Link
    to={to}
    className="glass-card group flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-sm hover:bg-card/80"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium group-hover:text-primary transition-colors">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </Link>
);

export default QuickAction;
