import { useCallback, useEffect, useState } from "react";
import { Flex, Heading, Text, Spinner, VStack, Grid } from "@chakra-ui/react";
import { LuBookOpen, LuCircleCheck, LuListTodo, LuTarget } from "react-icons/lu";
import { statsApi } from "@api/stats";
import type {
  OverviewResponse,
  CategoryBreakdown,
  DifficultyBreakdown,
  SourceBreakdown,
  ProgressDay,
  WeeklyProgress,
} from "@api/stats";
import { CATEGORY_LABEL, CATEGORY_COLOR, DIFFICULTY_COLOR } from "@api/types";
import PageContainer from "@components/PageContainer";
import { ErrorState } from "@components/EmptyState";
import StatCard from "@components/StatCard";
import Card from "@components/Card";
import ProgressBar from "@components/ProgressBar";
import BreakdownSection from "./components/BreakdownSection";
import DailyProgressChart from "./components/DailyProgressChart";
import WeeklyProgressChart from "./components/WeeklyProgressChart";
import HeatmapCalendar from "./components/HeatmapCalendar";
import TopicBreakdownSection from "./components/TopicBreakdownSection";
import SourceBreakdownSection from "./components/SourceBreakdownSection";

const Stats = () => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [difficulties, setDifficulties] = useState<DifficultyBreakdown[]>([]);
  const [sources, setSources] = useState<SourceBreakdown[]>([]);
  const [dailyProgress, setDailyProgress] = useState<ProgressDay[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      statsApi.getOverview(),
      statsApi.getCategoryBreakdown(),
      statsApi.getDifficultyBreakdown(),
      statsApi.getSourceBreakdown(),
      statsApi.getProgress(30),
      statsApi.getWeeklyProgress(12),
      statsApi.getHeatmap(),
    ])
      .then(([o, c, d, s, dp, wp, hm]) => {
        setOverview(o);
        setCategories(c);
        setDifficulties(d);
        setSources(s);
        setDailyProgress(dp);
        setWeeklyProgress(wp);
        setHeatmapData(hm);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <PageContainer>
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={fetchStats} />
      </PageContainer>
    );
  }

  const solved = overview?.byStatus.solved || 0;
  const total = overview?.total || 0;
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

  const categoryItems = categories
    .filter((c) => c.total > 0)
    .map((cat) => ({
      label: CATEGORY_LABEL[cat.category as keyof typeof CATEGORY_LABEL] || cat.category,
      solved: cat.solved,
      total: cat.total,
      completionRate: cat.completionRate,
      color: CATEGORY_COLOR[cat.category] || "gray",
    }));

  const difficultyItems = difficulties
    .filter((d) => d.total > 0)
    .map((diff) => ({
      label: diff.difficulty.charAt(0).toUpperCase() + diff.difficulty.slice(1),
      solved: diff.solved,
      total: diff.total,
      completionRate: diff.completionRate,
      color: DIFFICULTY_COLOR[diff.difficulty] || "gray",
    }));

  if (overview && overview.total === 0 && overview.backlogCount === 0) {
    return (
      <PageContainer>
        <VStack gap={3} py={16}>
          <Text color="fg.muted" fontSize="lg">
            No data to show yet
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Solve some questions to see your statistics here.
          </Text>
        </VStack>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Stat cards */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 3, md: 4 }} mb={{ base: 6, md: 8 }}>
        <StatCard icon={<LuBookOpen size={20} />} label="Total Questions" value={total} color="blue.500" />
        <StatCard icon={<LuCircleCheck size={20} />} label="Solved" value={solved} color="green.500" />
        <StatCard icon={<LuListTodo size={20} />} label="Pending" value={overview?.byStatus.pending || 0} color="orange.500" />
        <StatCard icon={<LuTarget size={20} />} label="Completion Rate" value={completionRate} suffix="%" color="teal.500" />
      </Grid>

      {/* Overall progress */}
      <Card mb={{ base: 6, md: 8 }}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading size="sm">Overall Progress</Heading>
          <Text fontSize="sm" color="fg.muted" fontWeight="medium">
            {solved}/{total} solved ({completionRate}%)
          </Text>
        </Flex>
        <ProgressBar value={completionRate} color="green" size="md" />
      </Card>

      {/* Charts */}
      <VStack gap={{ base: 6, md: 8 }} align="stretch" mb={{ base: 6, md: 8 }}>
        <DailyProgressChart data={dailyProgress} />
        <HeatmapCalendar data={heatmapData} />
        <WeeklyProgressChart data={weeklyProgress} />
      </VStack>

      {/* Category & Difficulty breakdowns */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 8, md: 6 }} mb={{ base: 6, md: 8 }}>
        <BreakdownSection title="Category Breakdown" items={categoryItems} />
        <BreakdownSection title="Difficulty Breakdown" items={difficultyItems} />
      </Grid>

      {/* Topic & Source breakdowns */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 8, md: 6 }}>
        <TopicBreakdownSection />
        <SourceBreakdownSection data={sources} />
      </Grid>
    </PageContainer>
  );
};

export default Stats;
