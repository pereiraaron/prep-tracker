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

export const StatsSidebarSkeleton = () => (
  <div className="space-y-4">
    {/* Overview card */}
    <div className="glass-card rounded-xl p-4">
      <Skeleton className="h-3 w-20 mb-3" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-secondary/50 p-2.5 flex flex-col items-center gap-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </div>
    </div>
    {/* Difficulty card */}
    <div className="glass-card rounded-xl p-4">
      <Skeleton className="h-3 w-16 mb-3" />
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-3 w-7" />
          </div>
        ))}
      </div>
    </div>
    {/* Categories card */}
    <div className="glass-card rounded-xl p-4">
      <Skeleton className="h-3 w-24 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-5" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
