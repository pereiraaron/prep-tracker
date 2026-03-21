import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import StatCard from "@components/StatCard";
import ActivityItem from "@components/ActivityItem";
import { DashboardStatsSkeleton, DashboardActivitySkeleton } from "@components/Skeleton";
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
  CalendarCheck,
  Clock,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

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

  const solved = overview?.totalSolved ?? 0;
  const backlog = overview?.backlogCount ?? 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <PageHeader
        icon={Clock}
        title={getGreeting()}
        subtitle={today}
        actions={
          <Link
            to="/question/new"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Question</span>
          </Link>
        }
      />

      {/* Stat cards */}
      {statsLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard label="Solved" value={solved || "—"} icon={CheckCircle} color="bg-stat-green/10 text-stat-green" />
          <StatCard label="Backlog" value={backlog || "—"} icon={ListTodo} color="bg-stat-orange/10 text-stat-orange" />
          <StatCard
            label="Streak"
            value={`${streaks?.currentStreak ?? 0}d`}
            icon={Flame}
            color="bg-stat-purple/10 text-stat-purple"
          />
          <StatCard
            label="Active Days"
            value={streaks?.totalActiveDays ?? "—"}
            icon={CalendarCheck}
            color="bg-stat-blue/10 text-stat-blue"
          />
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="glass-card mb-8 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-stat-blue" />
            <h2 className="font-display text-sm font-semibold">Tips</h2>
          </div>
          <div className="space-y-2">
            {tips.map((tip, i) => {
              const color = `hsl(var(${
                tip.priority === "high" ? "--destructive" : tip.priority === "medium" ? "--stat-orange" : "--stat-green"
              }))`;
              return (
                <div
                  key={i}
                  className={`rounded-lg bg-secondary/30 pl-4 pr-3.5 py-3 ${
                    tip.priority === "high" ? "tip-glow-fast" : tip.priority === "medium" ? "tip-glow" : ""
                  }`}
                  style={{
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                    boxShadow: `inset 3px 0 0 ${color}`,
                    ["--tip-color" as string]: color,
                  }}
                >
                  <p className="text-sm leading-relaxed text-foreground/90">{tip.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5 min-w-0">
        {/* Recent activity */}
        <div className="lg:col-span-3 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-bold">Recent Activity</h2>
            {recentSolved.length > 0 && (
              <Link
                to="/questions"
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            {recentLoading ? (
              <DashboardActivitySkeleton />
            ) : recentSolved.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen className="mx-auto mb-3 h-7 w-7 text-muted-foreground/30" />
                <p className="font-display font-medium text-sm">Nothing here yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Start solving questions and they'll show up here</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentSolved.map((q, i) => (
                  <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <ActivityItem question={q} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2">
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
