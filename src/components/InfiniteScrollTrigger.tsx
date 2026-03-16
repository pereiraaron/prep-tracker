import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
  onTrigger: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const InfiniteScrollTrigger = ({ onTrigger, hasMore, isLoading }: InfiniteScrollTriggerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onTrigger();
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onTrigger, hasMore, isLoading]);

  if (!hasMore) return null;

  return (
    <div ref={ref} className="flex items-center justify-center py-6">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
};

export default InfiniteScrollTrigger;
