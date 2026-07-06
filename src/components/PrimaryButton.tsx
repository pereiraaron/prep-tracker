import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

interface PrimaryButtonProps {
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  size?: "default" | "sm";
}

const PrimaryButton = ({
  to,
  onClick,
  disabled,
  loading,
  children,
  className = "",
  size = "default",
}: PrimaryButtonProps) => {
  const btnSize = size === "sm" ? "sm" : "default";

  if (to) {
    return (
      <Button asChild variant="brand" size={btnSize} className={cn(className)}>
        <Link to={to}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button variant="brand" size={btnSize} onClick={onClick} disabled={disabled || loading} className={className}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default PrimaryButton;
