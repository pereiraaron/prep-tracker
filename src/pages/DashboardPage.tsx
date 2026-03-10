import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import StatCard from "@components/StatCard";
import ActivityItem from "@components/ActivityItem";
import QuickAction from "@components/QuickAction";
import { useOverview, useInsights, useStreaks } from "@queries/useStats";
import { useRecentQuestions } from "@queries/useQuestions";
import {
  BookOpen,
  CheckCircle,
  ListTodo,
  Archive,
  Plus,
  BarChart3,
  Flame,
  Clock,
  Loader2,
  Lightbulb,
} from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  usePageTitle("Dashboard");
  const { data: overview, isLoading: statsLoading } = useOverview();
  const { data: recentData, isLoading: recentLoading } = useRecentQuestions();
  const { data: insights } = useInsights();
  const { data: streaks } = useStreaks();
  const tips = insights?.tips ?? [];
  const recentSolved = recentData?.data ?? [];

  const total = overview ? overview.total + overview.backlogCount : 0;
  const solved = overview?.byStatus?.solved ?? 0;
  const backlog = overview?.backlogCount ?? 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      {/* Hero greeting */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold">{getGreeting()}</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total"
          value={statsLoading ? "..." : total || "—"}
          icon={BookOpen}
          color="bg-stat-blue/10 text-stat-blue"
        />
        <StatCard
          label="Solved"
          value={statsLoading ? "..." : solved || "—"}
          icon={CheckCircle}
          color="bg-stat-green/10 text-stat-green"
        />
        <StatCard
          label="Backlog"
          value={statsLoading ? "..." : backlog || "—"}
          icon={ListTodo}
          color="bg-stat-orange/10 text-stat-orange"
        />
        <StatCard
          label="Streak"
          value={
            statsLoading
              ? "..."
              : `${streaks?.currentStreak ?? 0} ${(streaks?.currentStreak ?? 0) === 1 ? "day" : "days"}`
          }
          icon={Flame}
          color="bg-stat-purple/10 text-stat-purple"
        />
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="glass-card mb-6 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-stat-blue" />
            <h2 className="font-display text-sm font-semibold">Tips</h2>
          </div>
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <span
                  className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    tip.priority === "high"
                      ? "bg-destructive/10 text-destructive"
                      : tip.priority === "medium"
                        ? "bg-stat-orange/10 text-stat-orange"
                        : "bg-stat-green/10 text-stat-green"
                  }`}
                >
                  {tip.priority}
                </span>
                <p className="text-sm">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-5 min-w-0">
        {/* Recent activity */}
        <div className="md:col-span-3 min-w-0">
          <h2 className="font-display text-base font-bold mb-3">Recent Activity</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            {recentLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentSolved.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-display font-medium text-sm">Nothing here yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Start solving questions and they'll show up here</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentSolved.map((q) => (
                  <ActivityItem key={q.id} question={q} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="md:col-span-2">
          <h2 className="font-display text-base font-bold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction to="/question/new" icon={Plus} label="New Question" description="Log a solved question" />
            <QuickAction to="/questions" icon={BookOpen} label="Browse All" description="View & filter questions" />
            <QuickAction to="/backlog" icon={Archive} label="Backlog" description="Save for later" />
            <QuickAction to="/stats" icon={BarChart3} label="View Stats" description="Charts & insights" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
