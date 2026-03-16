import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps {
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const baseStyles = "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:active:scale-100";

const PrimaryButton = ({ to, onClick, disabled, loading, children, className = "" }: PrimaryButtonProps) => {
  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${className}`}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default PrimaryButton;
