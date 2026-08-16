import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@lib/utils";

interface BrandLogoProps {
  size?: "sm" | "lg";
  showWordmark?: boolean;
  to?: string | null;
  className?: string;
}

const sizes = {
  sm: {
    mark: "h-9 w-9 rounded-xl",
    icon: "h-4 w-4",
    word: "text-[15px]",
  },
  lg: {
    mark: "h-14 w-14 rounded-2xl",
    icon: "h-7 w-7",
    word: "text-lg",
  },
} as const;

const BrandLogo = ({
  size = "sm",
  showWordmark = true,
  to = "/",
  className,
}: BrandLogoProps) => {
  const s = sizes[size];

  const content = (
    <>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/25",
          s.mark,
        )}
      >
        <Zap className={s.icon} aria-hidden />
      </span>
      {showWordmark && (
        <span className={cn("font-display font-bold tracking-tight", s.word)}>
          PrepTracker
        </span>
      )}
    </>
  );

  if (to === null) {
    return (
      <div className={cn("inline-flex items-center gap-3", className)} aria-label="PrepTracker">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
      aria-label="PrepTracker home"
    >
      {content}
    </Link>
  );
};

export default BrandLogo;
