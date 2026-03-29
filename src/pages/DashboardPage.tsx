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
  CalendarClock,
  Shuffle,
  Pencil,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const InterviewCountdown = () => {
  const [, setTick] = useState(0);
  const [editing, setEditing] = useState(false);
  const [dateInput, setDateInput] = useState(() => localStorage.getItem("interviewDate") || "");
  const [labelInput, setLabelInput] = useState(() => localStorage.getItem("interviewLabel") || "");

  const dateStr = localStorage.getItem("interviewDate");
  const label = localStorage.getItem("interviewLabel");

  // Re-render at midnight to update days count
  useState(() => {
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = setTimeout(() => setTick((t) => t + 1), msToMidnight);
    return () => clearTimeout(timer);
  });

  const handleSave = () => {
    if (dateInput) {
      localStorage.setItem("interviewDate", dateInput);
      localStorage.setItem("interviewLabel", labelInput.trim());
      setEditing(false);
      setTick((t) => t + 1);
    }
  };

  const handleClear = () => {
    setDateInput("");
    setLabelInput("");
    localStorage.removeItem("interviewDate");
    localStorage.removeItem("interviewLabel");
    setEditing(false);
    setTick((t) => t + 1);
  };

  // No date set and not editing → show add button
  if (!dateStr && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="glass-card mb-8 w-full rounded-xl p-4 flex items-center gap-3 text-left transition-colors hover:bg-secondary/50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Add Interview Countdown</p>
          <p className="text-xs text-muted-foreground">Track days until your next interview</p>
        </div>
      </button>
    );
  }

  // Inline form
  if (editing) {
    return (
      <div className="glass-card mb-8 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-semibold">Interview Countdown</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">Label (optional)</label>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="e.g. Google Round 1"
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground">Date</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!dateInput}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setDateInput(localStorage.getItem("interviewDate") || "");
                setLabelInput(localStorage.getItem("interviewLabel") || "");
              }}
              className="h-9 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active countdown
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / 86400000);

  if (daysLeft < 0) return null;

  const urgency = daysLeft <= 3 ? "text-destructive" : daysLeft <= 7 ? "text-stat-orange" : "text-stat-blue";

  return (
    <div className="glass-card mb-8 rounded-xl p-4 flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary ${urgency}`}>
        <CalendarClock className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label || "Interview"}
        </p>
        <p className="font-display text-lg font-bold">
          {daysLeft === 0 ? (
            <span className={urgency}>Today!</span>
          ) : (
            <>
              <span className={urgency}>{daysLeft}</span>
              <span className="text-sm font-normal text-muted-foreground ml-1">
                day{daysLeft === 1 ? "" : "s"} left
              </span>
            </>
          )}
        </p>
      </div>
      <p className="text-xs text-muted-foreground hidden sm:block">
        {target.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </p>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => {
            setDateInput(dateStr || "");
            setLabelInput(label || "");
            setEditing(true);
          }}
          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Edit countdown"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Remove countdown"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
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

      {/* Interview countdown */}
      <InterviewCountdown />

      {/* Tips */}
      {tips.length > 0 && (
        <div className="glass-card mb-8 rounded-xl p-4 md:p-5">
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
                  className={`rounded-lg bg-secondary/30 pl-4 pr-3.5 py-2.5 ${
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
              <div className="py-14 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/20" />
                <p className="font-display font-semibold text-sm">Nothing here yet</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Start solving questions and they'll show up here</p>
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
            <QuickAction to="/revision" icon={Shuffle} label="Revision Mode" description="Review old questions" />
            <QuickAction to="/stats" icon={BarChart3} label="View Stats" description="Charts & insights" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
