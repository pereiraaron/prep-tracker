import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import { BacklogListSkeleton } from "@components/Skeleton";
import EmptyState from "@components/EmptyState";
import PrimaryButton from "@components/PrimaryButton";
import BacklogAddForm from "@components/backlog/BacklogAddForm";
import BacklogRow from "@components/backlog/BacklogRow";
import {
  useBacklogList,
  useCreateBacklogItem,
  useDeleteBacklogItem,
  useStarBacklogItem,
  useSolveBacklogItem,
} from "@queries/useBacklog";
import type { PrepCategory } from "@api/types";
import { toast } from "@components/ui/sonner";
import { Plus, Archive } from "lucide-react";

const BacklogPage = () => {
  usePageTitle("Backlog");
  const [solvingId, setSolvingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const { data: backlogData, isLoading } = useBacklogList();
  const backlog = backlogData?.data ?? [];
  const createMutation = useCreateBacklogItem();
  const deleteMutation = useDeleteBacklogItem();
  const starMutation = useStarBacklogItem();
  const solveMutation = useSolveBacklogItem();

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    try {
      await createMutation.mutateAsync({ title });
      setNewTitle("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this from your backlog?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Removed from backlog");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleSolve = async (id: string, category: string) => {
    try {
      await solveMutation.mutateAsync({ id, category: category as PrepCategory });
      toast.success("Marked as solved");
      setSolvingId(null);
    } catch {
      toast.error("Failed to mark as solved");
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={Archive}
        iconColor="bg-stat-orange/10 text-stat-orange"
        title="Backlog"
        subtitle={backlog.length === 0 ? "Save questions you want to tackle later" : "Questions saved for later"}
        count={backlog.length}
        countColor="bg-stat-orange/10 text-stat-orange"
      />

      <BacklogAddForm
        value={newTitle}
        onChange={setNewTitle}
        onAdd={handleAdd}
        creating={createMutation.isPending}
      />

      {isLoading ? (
        <BacklogListSkeleton />
      ) : backlog.length === 0 ? (
        <EmptyState
          icon={Archive}
          iconBg="bg-stat-orange/5"
          title="Backlog is empty"
          description="Add questions you want to solve later"
          action={
            <PrimaryButton onClick={() => document.getElementById("add-backlog")?.focus()}>
              <Plus className="h-4 w-4" />
              Add your first item
            </PrimaryButton>
          }
        />
      ) : (
        <>
          <div className="mb-1 px-4 text-[11px] font-medium text-muted-foreground/60">
            {backlog.length} item{backlog.length === 1 ? "" : "s"}
          </div>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
            {backlog.map((q, i) => (
              <BacklogRow
                key={q.id}
                item={q}
                index={i}
                solvingId={solvingId}
                onStar={(id) => starMutation.mutate(id)}
                onDelete={handleDelete}
                onStartSolve={setSolvingId}
                onSolve={handleSolve}
                onCancelSolve={() => setSolvingId(null)}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default BacklogPage;
