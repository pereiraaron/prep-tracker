import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import StatCard from "@components/StatCard";
import ActivityItem from "@components/ActivityItem";
import StaggerSection from "@components/StaggerSection";
import PrimaryButton from "@components/PrimaryButton";
import { DashboardStatsSkeleton, DashboardActivitySkeleton } from "@components/Skeleton";
import QuickAction from "@components/QuickAction";
import { useDashboardStats } from "@queries/useStats";
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
  Shuffle,
} from "lucide-react";
import { Link } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const sumDays = (days: { solved: number }[] | undefined) =>
  (days ?? []).reduce((acc, d) => acc + d.solved, 0);

const Dashboard = () => {
  usePageTitle("Dashboard");
  const { data: batch, isLoading: statsLoading } = useDashboardStats();
  const overview = batch?.overview;
  const progress = batch?.progress;
  const insights = batch?.insights;
  const streaks = batch?.streaks;
  const { data: recentData, isLoading: recentLoading } = useRecentQuestions();
  const tips = insights?.tips ?? [];
  const recentSolved = recentData?.data ?? [];

  const solved = overview?.totalSolved ?? 0;
  const backlog = overview?.backlogCount ?? 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const progressDays = progress ?? [];
  const last7 = progressDays.slice(-7);
  const prev7 = progressDays.slice(-14, -7);
  const solvedTrend = sumDays(last7) - sumDays(prev7);

  return (
    <Layout>
      <StaggerSection index={0}>
        <PageHeader
          icon={Clock}
          iconColor="bg-stat-blue/15 text-stat-blue"
          title={getGreeting()}
          subtitle={today}
          actions={
            <PrimaryButton to="/question/new" size="sm" className="shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Question</span>
            </PrimaryButton>
          }
        />
      </StaggerSection>

      <StaggerSection index={1}>
        {statsLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatCard
              label="Solved"
              value={solved || "—"}
              icon={CheckCircle}
              color="bg-stat-green/10 text-stat-green"
              trend={solvedTrend !== 0 ? solvedTrend : undefined}
            />
            <StatCard label="Backlog" value={backlog || "—"} icon={ListTodo} color="bg-stat-orange/10 text-stat-orange" />
            <StatCard
              label="Streak"
              value={`${streaks?.currentStreak ?? 0}d`}
              icon={Flame}
              color="bg-stat-orange/10 text-stat-orange"
              sublabel={streaks?.longestStreak ? `Best: ${streaks.longestStreak}d` : undefined}
            />
            <StatCard
              label="Active Days"
              value={streaks?.totalActiveDays ?? "—"}
              icon={CalendarCheck}
              color="bg-stat-blue/10 text-stat-blue"
            />
          </div>
        )}
      </StaggerSection>

      {tips.length > 0 && (
        <StaggerSection index={2}>
          <div className="glass-card mb-8 rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-primary" />
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
                    className={`glass-inset rounded-lg pl-4 pr-3.5 py-2.5 ${
                      tip.priority === "high" ? "tip-glow-fast" : tip.priority === "medium" ? "tip-glow" : ""
                    }`}
                    style={{
                      border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
                      boxShadow: `inset 3px 0 0 ${color}`,
                      ["--tip-color" as string]: color,
                    }}
                  >
                    <p className="text-[13px] leading-relaxed text-foreground/85">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </StaggerSection>
      )}

      <div className="grid gap-6 lg:grid-cols-5 min-w-0">
        <StaggerSection index={3} className="lg:col-span-3 min-w-0">
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
          <div className="glass-card rounded-2xl overflow-hidden">
            {recentLoading ? (
              <DashboardActivitySkeleton />
            ) : recentSolved.length === 0 ? (
              <div className="py-14 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/20" />
                <p className="font-display font-semibold text-sm">Nothing here yet</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Start solving questions and they'll show up here</p>
              </div>
            ) : (
              <div className="divide-y divide-border/70">
                {recentSolved.map((q, i) => (
                  <ActivityItem key={q.id} question={q} index={i} />
                ))}
              </div>
            )}
          </div>
        </StaggerSection>

        <StaggerSection index={4} className="lg:col-span-2">
          <h2 className="font-display text-base font-bold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction to="/question/new" icon={Plus} label="New Question" description="Log a solved question" />
            <QuickAction to="/questions" icon={BookOpen} label="Browse All" description="View & filter questions" />
            <QuickAction to="/backlog" icon={Archive} label="Backlog" description="Save for later" />
            <QuickAction to="/revision" icon={Shuffle} label="Revision Mode" description="Review old questions" />
            <QuickAction to="/stats" icon={BarChart3} label="View Stats" description="Charts & insights" />
          </div>
        </StaggerSection>
      </div>
    </Layout>
  );
};

export default Dashboard;
