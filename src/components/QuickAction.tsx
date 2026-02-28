import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const QuickAction = ({ to, icon: Icon, label, description }: QuickActionProps) => (
  <Link
    to={to}
    className="glass-card flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/20"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </Link>
);

export default QuickAction;
