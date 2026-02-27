import { useCallback, useEffect, useState } from "react";
import { Flex, Grid, Heading, Text, Spinner, VStack, Badge } from "@chakra-ui/react";
import { LuBookOpen, LuCircleCheck, LuArchive, LuListTodo } from "react-icons/lu";
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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
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
      {/* Greeting */}
      <Flex direction="column" mb={{ base: 6, md: 8 }}>
        <Heading size={{ base: "md", md: "lg" }}>
          {getGreeting()}, {displayName}
        </Heading>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          {formatDate()}
        </Text>
      </Flex>

      {/* Stat cards */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 3, md: 4 }} mb={{ base: 6, md: 8 }}>
        <StatCard icon={<LuBookOpen size={20} />} label="Total Questions" value={overview?.total ?? 0} color="blue.500" />
        <StatCard icon={<LuCircleCheck size={20} />} label="Solved" value={overview?.byStatus?.solved ?? 0} color="green.500" />
        <StatCard icon={<LuListTodo size={20} />} label="Pending" value={overview?.byStatus?.pending ?? 0} color="orange.500" />
        <StatCard icon={<LuArchive size={20} />} label="In Backlog" value={overview?.backlogCount ?? 0} color="purple.500" />
      </Grid>

      {/* Recent Activity */}
      <Heading size="sm" mb={{ base: 3, md: 4 }}>
        Recent Activity
      </Heading>
      <Card mb={{ base: 6, md: 8 }}>
        {recentSolved.length === 0 ? (
          <Text fontSize="sm" color="fg.muted">
            No recent solves yet. Start solving questions to see your activity here.
          </Text>
        ) : (
          <VStack gap={3} align="stretch">
            {recentSolved.map((q) => (
              <Flex
                key={q.id}
                align="center"
                gap={3}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                onClick={() => navigate(`/questions/${q.id}`)}
              >
                <Flex
                  w="3px"
                  alignSelf="stretch"
                  borderRadius="full"
                  bg={q.category ? `${CATEGORY_COLOR[q.category]}.500` : "gray.400"}
                />
                <Flex flex="1" direction="column" minW={0}>
                  <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                    {q.title}
                  </Text>
                  <Flex gap={2} align="center" mt={0.5}>
                    {q.category && (
                      <Badge size="sm" colorPalette={CATEGORY_COLOR[q.category] || "gray"}>
                        {CATEGORY_LABEL[q.category] || q.category}
                      </Badge>
                    )}
                    {q.solvedAt && (
                      <Text fontSize="xs" color="fg.muted">
                        {new Date(q.solvedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </VStack>
        )}
      </Card>

      {/* Quick Actions */}
      <Heading size="sm" mb={{ base: 3, md: 4 }}>
        Quick Actions
      </Heading>
      <QuickActions />
    </PageContainer>
  );
};

export default Dashboard;
