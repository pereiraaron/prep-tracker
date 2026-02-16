import { useEffect, useState } from 'react'
import { Flex, Heading, Text, Spinner, VStack, Grid } from '@chakra-ui/react'
import {
  LuBookOpen,
  LuCircleCheck,
  LuClock,
  LuFlame,
  LuTrophy,
  LuCalendarDays,
  LuTarget,
  LuArchive,
} from 'react-icons/lu'
import { statsApi } from '@api/stats'
import type {
  OverviewResponse,
  CategoryBreakdown,
  DifficultyBreakdown,
  StreaksResponse,
} from '@api/stats'
import { CATEGORY_LABEL, CATEGORY_COLOR, DIFFICULTY_COLOR } from '@api/types'
import PageContainer from '@components/PageContainer'
import StatCard from '@components/StatCard'
import Card from './components/Card'
import ProgressBar from './components/ProgressBar'
import BreakdownSection from './components/BreakdownSection'
import { MOCK_OVERVIEW, MOCK_CATEGORIES, MOCK_DIFFICULTIES, MOCK_STREAKS } from './mockData'

const Stats = () => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [categories, setCategories] = useState<CategoryBreakdown[]>([])
  const [difficulties, setDifficulties] = useState<DifficultyBreakdown[]>([])
  const [streaks, setStreaks] = useState<StreaksResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      statsApi.getOverview(),
      statsApi.getCategoryBreakdown(),
      statsApi.getDifficultyBreakdown(),
      statsApi.getStreaks(),
    ])
      .then(([o, c, d, s]) => {
        setOverview(o)
        setCategories(c)
        setDifficulties(d)
        setStreaks(s)
      })
      .catch(() => {
        if (import.meta.env.DEV) {
          setOverview(MOCK_OVERVIEW)
          setCategories(MOCK_CATEGORIES)
          setDifficulties(MOCK_DIFFICULTIES)
          setStreaks(MOCK_STREAKS)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="lg" />
      </Flex>
    )
  }

  const solved = overview?.byStatus.solved || 0
  const total = overview?.total || 0
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0

  const categoryItems = categories
    .filter((c) => c.total > 0)
    .map((cat) => ({
      label: CATEGORY_LABEL[cat.category as keyof typeof CATEGORY_LABEL] || cat.category,
      solved: cat.solved,
      total: cat.total,
      completionRate: cat.completionRate,
      color: CATEGORY_COLOR[cat.category] || 'gray',
    }))

  const difficultyItems = difficulties
    .filter((d) => d.total > 0)
    .map((diff) => ({
      label: diff.difficulty.charAt(0).toUpperCase() + diff.difficulty.slice(1),
      solved: diff.solved,
      total: diff.total,
      completionRate: diff.completionRate,
      color: DIFFICULTY_COLOR[diff.difficulty] || 'gray',
    }))

  return (
    <PageContainer>
      {overview && overview.total === 0 && overview.backlogCount === 0 && (
        <VStack gap={3} py={16}>
          <Text color="fg.muted" fontSize="lg">No data to show yet</Text>
          <Text color="fg.muted" fontSize="sm">
            Create some tasks and solve questions to see your statistics here.
          </Text>
        </VStack>
      )}

      {overview && (overview.total > 0 || overview.backlogCount > 0) && (
        <>
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gap={{ base: 3, md: 4 }}
            mb={{ base: 4, md: 5 }}
          >
            <StatCard icon={<LuBookOpen size={20} />} label="Total Questions" value={total} color="blue.500" />
            <StatCard icon={<LuCircleCheck size={20} />} label="Solved" value={solved} color="green.500" />
            <StatCard icon={<LuClock size={20} />} label="In Progress" value={overview.byStatus.in_progress || 0} color="orange.500" />
            <StatCard icon={<LuFlame size={20} />} label="Current Streak" value={streaks?.currentStreak ?? 0} suffix=" days" color="purple.500" />
          </Grid>

          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gap={{ base: 3, md: 4 }}
            mb={{ base: 6, md: 8 }}
          >
            <StatCard icon={<LuTarget size={20} />} label="Completion Rate" value={completionRate} suffix="%" color="teal.500" />
            <StatCard icon={<LuTrophy size={20} />} label="Longest Streak" value={streaks?.longestStreak ?? 0} suffix=" days" color="yellow.500" />
            <StatCard icon={<LuCalendarDays size={20} />} label="Active Days" value={streaks?.totalActiveDays ?? 0} color="cyan.500" />
            <StatCard icon={<LuArchive size={20} />} label="In Backlog" value={overview.backlogCount} color="gray.500" />
          </Grid>

          <Card mb={{ base: 6, md: 8 }}>
            <Flex justify="space-between" align="center" mb={3}>
              <Heading size="sm">Overall Progress</Heading>
              <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                {solved}/{total} solved ({completionRate}%)
              </Text>
            </Flex>
            <ProgressBar value={completionRate} color="green" size="md" />
          </Card>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={{ base: 8, md: 6 }}
          >
            <BreakdownSection title="Category Breakdown" items={categoryItems} />
            <BreakdownSection title="Difficulty Breakdown" items={difficultyItems} />
          </Grid>
        </>
      )}
    </PageContainer>
  )
}

export default Stats
