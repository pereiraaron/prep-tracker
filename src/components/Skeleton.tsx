const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted/60 ${className}`} />
);

export const QuestionsListSkeleton = () => (
  <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-40 sm:w-56" />
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    ))}
  </div>
);

export const BacklogListSkeleton = () => (
  <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-44 sm:w-64" />
            <Skeleton className="h-4 w-14 rounded-md hidden sm:block" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-7 w-10" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardActivitySkeleton = () => (
  <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    ))}
  </div>
);

export default Skeleton;
