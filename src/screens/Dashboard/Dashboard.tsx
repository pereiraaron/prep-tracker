import { useCallback, useEffect, useState } from 'react'
import {
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
  VStack,
  Button,
} from '@chakra-ui/react'
import {
  LuListTodo,
  LuCircleCheck,
  LuBookOpen,
  LuFlame,
  LuPlus,
} from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { useAuthStore } from '@store/useAuthStore'
import { statsApi, type StreaksResponse } from '@api/stats'
import PageContainer from '@components/PageContainer'
import StatCard from '@components/StatCard'
import { ErrorState } from '@components/EmptyState'
import CategoryProgress from './components/CategoryProgress'
import QuickActions from './components/QuickActions'
import { MOCK_TODAY, MOCK_STREAKS } from './mockData'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { today, fetchToday } = useTaskStore()
  const { user } = useAuthStore()
  const [streaks, setStreaks] = useState<StreaksResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      await Promise.all([
        fetchToday(),
        statsApi.getStreaks().then(setStreaks),
      ])
      // fetchToday swallows errors internally — check store state
      if (useTaskStore.getState().error) {
        throw new Error('Failed to load today data')
      }
    } catch {
      if (import.meta.env.DEV) {
        setStreaks(MOCK_STREAKS)
      } else {
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }, [fetchToday])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Use mock data in dev when API fails
  const todayData = !today && import.meta.env.DEV && !loading ? MOCK_TODAY : today

  // Compute totals from groups
  const totalQuestions = todayData?.groups.reduce(
    (sum, g) => sum + g.instances.reduce((s, i) => s + i.targetQuestionCount, 0), 0
  ) ?? 0
  const solvedQuestions = todayData?.groups.reduce(
    (sum, g) => sum + g.instances.reduce((s, i) => s + i.solvedQuestionCount, 0), 0
  ) ?? 0

  const displayName = user?.username || user?.email?.split('@')[0] || 'there'

  if (loading) {
    return (
      <PageContainer>
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState onRetry={fetchData} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Greeting */}
      <Flex direction="column" mb={{ base: 6, md: 8 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>
          {getGreeting()}, {displayName}
        </Heading>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          {formatDate()}
        </Text>
      </Flex>

      {/* Stat cards */}
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={{ base: 3, md: 4 }}
        mb={{ base: 6, md: 8 }}
      >
        <StatCard
          icon={<LuListTodo size={20} />}
          label="Today's Tasks"
          value={todayData?.summary.total ?? 0}
          color="blue.500"
        />
        <StatCard
          icon={<LuCircleCheck size={20} />}
          label="Completed"
          value={todayData?.summary.completed ?? 0}
          color="green.500"
        />
        <StatCard
          icon={<LuBookOpen size={20} />}
          label="Questions Solved"
          value={`${solvedQuestions}/${totalQuestions}`}
          color="orange.500"
        />
        <StatCard
          icon={<LuFlame size={20} />}
          label="Current Streak"
          value={streaks?.currentStreak ?? 0}
          suffix=" days"
          color="purple.500"
        />
      </Grid>

      {/* Today's Progress */}
      {todayData && todayData.summary.total > 0 && (
        <>
          <Heading size="sm" mb={{ base: 3, md: 4 }}>
            Today's Progress
          </Heading>
          <VStack gap={3} align="stretch" mb={{ base: 6, md: 8 }}>
            {todayData.groups.map((group) => {
              const groupSolved = group.instances.reduce((s, i) => s + i.solvedQuestionCount, 0)
              const groupTotal = group.instances.reduce((s, i) => s + i.targetQuestionCount, 0)
              const groupStatus = group.summary.completed === group.summary.total
                ? 'completed'
                : group.summary.in_progress > 0
                  ? 'in_progress'
                  : group.summary.incomplete > 0
                    ? 'incomplete'
                    : 'pending'

              const taskId = group.instances[0]?.task

              return (
                <CategoryProgress
                  key={group.category}
                  category={group.category}
                  solved={groupSolved}
                  total={groupTotal}
                  status={groupStatus}
                  onClick={taskId ? () => navigate(`/tasks/${taskId}`) : undefined}
                />
              )
            })}
          </VStack>
        </>
      )}

      {/* Empty state */}
      {todayData && todayData.summary.total === 0 && (
        <VStack gap={4} py={12} mb={{ base: 6, md: 8 }}>
          <Text color="fg.muted" fontSize="lg">No tasks scheduled for today</Text>
          <Text color="fg.muted" fontSize="sm">
            Create recurring tasks to see them here each day.
          </Text>
          <Button colorPalette="purple" size="sm" onClick={() => navigate('/tasks/new')}>
            <LuPlus /> Create your first task
          </Button>
        </VStack>
      )}

      {/* Quick Actions */}
      <Heading size="sm" mb={{ base: 3, md: 4 }}>
        Quick Actions
      </Heading>
      <QuickActions />
    </PageContainer>
  )
}

export default Dashboard
