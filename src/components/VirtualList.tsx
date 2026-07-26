import { ReactNode, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualListProps<T> {
  items: T[];
  estimateSize?: number;
  overscan?: number;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  onNearEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

/**
 * Windowed list for mobile infinite scroll. Keeps only visible rows mounted.
 */
const VirtualList = <T,>({
  items,
  estimateSize = 64,
  overscan = 8,
  getKey,
  renderItem,
  className = "",
  onNearEnd,
  hasMore,
  isLoadingMore,
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const onNearEndRef = useRef(onNearEnd);
  onNearEndRef.current = onNearEnd;

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems[virtualItems.length - 1]?.index ?? -1;

  useEffect(() => {
    if (!hasMore || isLoadingMore || lastIndex < 0 || items.length === 0) return;
    // Only fetch when scrolled near the end — not when the whole list fits on screen
    // with fewer than a page of items left to load (threshold of 5)
    if (lastIndex >= items.length - 5) {
      onNearEndRef.current?.();
    }
  }, [lastIndex, items.length, hasMore, isLoadingMore]);

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ maxHeight: "min(70vh, calc(100dvh - 14rem))" }}
    >
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={getKey(item, virtualRow.index)}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full border-b border-border last:border-b-0"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center py-3 text-[11px] text-muted-foreground">Loading…</div>
      )}
    </div>
  );
};

export default VirtualList;
