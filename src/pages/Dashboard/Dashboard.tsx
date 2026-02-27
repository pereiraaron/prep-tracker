import { useCallback, useEffect, useState } from "react";
import { LuBookOpen, LuCircleCheck, LuArchive, LuListTodo, LuFlame } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { statsApi, type OverviewResponse } from "@api/stats";
import { questionsApi, type Question } from "@api/questions";
import { CATEGORY_COLOR, CATEGORY_LABEL } from "@api/types";
import PageContainer from "@components/PageContainer";
import StatCard from "@components/StatCard";
import Card from "@components/Card";
import { ErrorState } from "@components/EmptyState";
import QuickActions from "./components/QuickActions";

const BADGE_COLOR_MAP: Record<string, string> = {
  purple: "#9333ea",
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f97316",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  gray: "#6b7280",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [recentSolved, setRecentSolved] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [overviewData, recentData] = await Promise.all([
        statsApi.getOverview(),
        questionsApi.getAll({ status: "solved", sort: "-solvedAt", limit: 5 }),
      ]);
      setOverview(overviewData);
      setRecentSolved(recentData.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayName = user?.username || user?.email?.split("@")[0] || "there";

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={fetchData} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Greeting with icon */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
          <LuFlame size={20} />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">
            {getGreeting()}, {displayName}
          </h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {formatDate()}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard icon={<LuBookOpen size={20} />} label="Total" value={overview?.total ?? 0} color="var(--color-stat-blue)" />
        <StatCard icon={<LuCircleCheck size={20} />} label="Solved" value={overview?.byStatus?.solved ?? 0} color="var(--color-stat-green)" />
        <StatCard icon={<LuArchive size={20} />} label="Backlog" value={overview?.backlogCount ?? 0} color="var(--color-stat-orange)" />
        <StatCard icon={<LuListTodo size={20} />} label="Completion" value={overview?.total ? `${Math.round(((overview.byStatus?.solved ?? 0) / overview.total) * 100)}%` : "0%"} color="var(--color-stat-purple)" />
      </div>

      {/* Recent Activity + Quick Actions side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* Recent Activity */}
        <div>
          <h2 className="text-sm font-semibold mb-3">
            Recent Activity
          </h2>
          <Card>
            {recentSolved.length === 0 ? (
              <p className="text-sm text-(--muted-foreground)">
                No recent solves yet. Start solving to see activity here.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {recentSolved.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 hover:bg-(--muted) transition-colors"
                    onClick={() => navigate(`/questions/${q.id}`)}
                  >
                    <div
                      className="w-0.75 self-stretch rounded-full"
                      style={{
                        backgroundColor: q.category
                          ? BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]] || "#9ca3af"
                          : "#9ca3af",
                      }}
                    />
                    <div className="flex flex-1 flex-col min-w-0">
                      <p className="text-sm font-medium truncate">
                        {q.title}
                      </p>
                      <div className="flex gap-2 items-center mt-0.5">
                        {q.category && (
                          <span
                            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
                            style={{
                              color: BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]] || "#6b7280",
                              borderColor: BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]]
                                ? `${BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]]}33`
                                : undefined,
                              backgroundColor: BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]]
                                ? `${BADGE_COLOR_MAP[CATEGORY_COLOR[q.category]]}11`
                                : undefined,
                            }}
                          >
                            {CATEGORY_LABEL[q.category] || q.category}
                          </span>
                        )}
                        {q.solvedAt && (
                          <p className="text-xs text-(--muted-foreground)">
                            {new Date(q.solvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold mb-3">
            Quick Actions
          </h2>
          <QuickActions />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
