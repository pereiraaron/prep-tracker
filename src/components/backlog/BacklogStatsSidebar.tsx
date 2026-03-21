import { useOverview } from "@queries/useStats";
import { StatsSidebarSkeleton } from "@components/Skeleton";
import { CATEGORY_LABEL } from "@api/types";
import type { PrepCategory } from "@api/types";
import { Layers, ListTodo } from "lucide-react";

const BacklogStatsSidebar = () => {
  const { data: overview, isLoading } = useOverview();

  if (isLoading) return <StatsSidebarSkeleton />;

  const backlogCount = overview?.backlogCount ?? 0;

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <ListTodo className="h-3 w-3 text-muted-foreground" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Backlog</h3>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3 text-center">
          <p className="font-display text-2xl font-bold">{backlogCount}</p>
          <p className="text-[10px] font-medium text-muted-foreground mt-1">Questions to practice</p>
        </div>
      </div>
    </div>
  );
};

export default BacklogStatsSidebar;
