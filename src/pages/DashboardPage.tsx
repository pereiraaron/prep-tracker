import usePageTitle from "@hooks/usePageTitle";
import { useEffect } from "react";
import Layout from "@components/Layout";
import StatCard from "@components/StatCard";
import ActivityItem from "@components/ActivityItem";
import QuickAction from "@components/QuickAction";
import useStats from "@hooks/useStats";
import useQuestions from "@hooks/useQuestions";
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
} from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  usePageTitle("Dashboard");
  const { overview, isLoading: statsLoading, fetchOverview } = useStats();
  const { recentSolved, recentLoading, fetchRecent } = useQuestions();

  useEffect(() => {
    fetchOverview();
    fetchRecent();
  }, [fetchOverview, fetchRecent]);

  const total = overview ? overview.total + overview.backlogCount : 0;
  const solved = overview?.byStatus?.solved ?? 0;
  const backlog = overview?.backlogCount ?? 0;
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

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
            <h1 className="font-display text-xl font-bold">{getGreeting()}</h1>
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
          label="Completion"
          value={statsLoading ? "..." : total > 0 ? `${completionRate}%` : "—"}
          icon={Flame}
          color="bg-stat-purple/10 text-stat-purple"
        />
      </div>

      {/* Progress bar */}
      <div className="glass-card mb-6 rounded-xl p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-display font-semibold">Overall Progress</span>
          <span className="text-muted-foreground">
            {solved}/{total}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${completionRate}%`,
              background:
                "linear-gradient(90deg, hsl(230, 65%, 55%), hsl(170, 70%, 45%))",
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Recent activity */}
        <div className="md:col-span-3">
          <h2 className="font-display text-base font-bold mb-3">
            Recent Activity
          </h2>
          <div className="glass-card rounded-xl">
            {recentLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentSolved.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-display font-medium text-sm">Nothing here yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start solving questions and they'll show up here
                </p>
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
          <h2 className="font-display text-base font-bold mb-3">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <QuickAction
              to="/new"
              icon={Plus}
              label="New Question"
              description="Log a solved question"
            />
            <QuickAction
              to="/questions"
              icon={BookOpen}
              label="Browse All"
              description="View & filter questions"
            />
            <QuickAction
              to="/backlog"
              icon={Archive}
              label="Backlog"
              description="Save for later"
            />
            <QuickAction
              to="/stats"
              icon={BarChart3}
              label="View Stats"
              description="Charts & insights"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
