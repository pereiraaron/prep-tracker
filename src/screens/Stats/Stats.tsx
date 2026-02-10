import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Spinner,
  VStack,
  Progress,
} from '@chakra-ui/react'
import { statsApi } from '@api/stats'
import type {
  OverviewResponse,
  CategoryBreakdown,
  DifficultyBreakdown,
  StreaksResponse,
} from '@api/stats'
import { CATEGORY_LABEL } from '@api/types'

const CATEGORY_COLOR: Record<string, string> = {
  dsa: 'purple',
  system_design: 'blue',
  behavioral: 'green',
  machine_coding: 'orange',
  language_framework: 'teal',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
}

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
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="lg" />
      </Flex>
    )
  }

  return (
    <Box maxW="900px" mx="auto" w="full" p={{ base: 4, md: 6 }} pt={{ base: 4, md: 8 }}>
      <Heading size={{ base: 'md', md: 'lg' }} mb={{ base: 4, md: 6 }}>Statistics</Heading>

      {/* Empty state */}
      {overview && overview.total === 0 && (
        <VStack gap={3} py={16}>
          <Text color="fg.muted" fontSize="lg">No data to show yet</Text>
          <Text color="fg.muted" fontSize="sm">
            Create some entries and complete tasks to see your statistics here.
          </Text>
        </VStack>
      )}

      {/* Overview cards */}
      {overview && overview.total > 0 && (
        <>
          <Flex gap={{ base: 2, md: 4 }} mb={{ base: 4, md: 8 }} wrap="wrap">
            <OverviewCard label="Total Entries" value={overview.total} color="blue" />
            <OverviewCard label="Completed" value={overview.byStatus.completed || 0} color="green" />
            <OverviewCard label="In Progress" value={overview.byStatus.in_progress || 0} color="yellow" />
            <OverviewCard label="Pending" value={overview.byStatus.pending || 0} color="gray" />
          </Flex>

          {streaks && (
            <Flex gap={{ base: 2, md: 4 }} mb={{ base: 4, md: 8 }} wrap="wrap">
              <OverviewCard label="Current Streak" value={streaks.currentStreak} color="orange" suffix=" days" />
              <OverviewCard label="Longest Streak" value={streaks.longestStreak} color="yellow" suffix=" days" />
              <OverviewCard label="Active Days" value={streaks.totalActiveDays} color="blue" />
            </Flex>
          )}
        </>
      )}

      {/* Category breakdown */}
      {categories.some((c) => c.total > 0) && (
        <>
          <Heading size="md" mb={4}>By Category</Heading>
          <VStack gap={3} align="stretch" mb={8}>
            {categories.filter((c) => c.total > 0).map((cat) => (
              <Box key={cat.category} p={{ base: 3, md: 4 }} borderWidth="1px" borderRadius="md">
                <Flex justify="space-between" align="center" mb={2}>
                  <Badge colorPalette={CATEGORY_COLOR[cat.category] || 'gray'}>
                    {CATEGORY_LABEL[cat.category as keyof typeof CATEGORY_LABEL] || cat.category}
                  </Badge>
                  <Text fontSize="sm" color="fg.muted">
                    {cat.completed}/{cat.total} ({cat.completionRate}%)
                  </Text>
                </Flex>
                <Progress.Root value={cat.completionRate} size="sm" colorPalette={CATEGORY_COLOR[cat.category] || 'gray'}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Flex gap={{ base: 2, md: 3 }} mt={2} wrap="wrap">
                  <Text fontSize="xs" color="fg.muted">{cat.pending} pending</Text>
                  <Text fontSize="xs" color="fg.muted">{cat.in_progress} in progress</Text>
                  <Text fontSize="xs" color="fg.muted">{cat.completed} done</Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </>
      )}

      {/* Difficulty breakdown */}
      {difficulties.some((d) => d.total > 0) && (
        <>
          <Heading size="md" mb={4}>By Difficulty</Heading>
          <VStack gap={3} align="stretch" mb={8}>
            {difficulties.filter((d) => d.total > 0).map((diff) => (
              <Box key={diff.difficulty} p={{ base: 3, md: 4 }} borderWidth="1px" borderRadius="md">
                <Flex justify="space-between" align="center" mb={2}>
                  <Badge colorPalette={DIFFICULTY_COLOR[diff.difficulty] || 'gray'}>
                    {diff.difficulty}
                  </Badge>
                  <Text fontSize="sm" color="fg.muted">
                    {diff.completed}/{diff.total} ({diff.completionRate}%)
                  </Text>
                </Flex>
                <Progress.Root value={diff.completionRate} size="sm" colorPalette={DIFFICULTY_COLOR[diff.difficulty] || 'gray'}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            ))}
          </VStack>
        </>
      )}
    </Box>
  )
}

const OverviewCard = ({
  label,
  value,
  color,
  suffix = '',
}: {
  label: string
  value: number
  color: string
  suffix?: string
}) => (
  <Box flex="1" minW={{ base: '0', sm: '130px' }} p={{ base: 3, md: 4 }} borderWidth="1px" borderRadius="lg" textAlign="center">
    <Text fontWeight="bold" fontSize={{ base: 'lg', md: '2xl' }} color={`${color}.500`}>
      {value}{suffix}
    </Text>
    <Text fontSize="xs" color="fg.muted">{label}</Text>
  </Box>
)

export default Stats
