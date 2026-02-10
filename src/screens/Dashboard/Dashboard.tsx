import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Checkbox,
  Spinner,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { LuPlus, LuFlame, LuTrophy, LuCalendar } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useEntryStore } from '@store/useEntryStore'
import { statsApi, type StreaksResponse } from '@api/stats'
import { CATEGORY_LABEL } from '@api/types'
import type { ResolvedTask, EntryStatus } from '@api/entries'

const CATEGORY_COLOR: Record<string, string> = {
  dsa: 'purple',
  system_design: 'blue',
  behavioral: 'green',
  machine_coding: 'orange',
  language_framework: 'teal',
}

const STATUS_LABEL: Record<EntryStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const nextStatus = (current: EntryStatus): EntryStatus => {
  if (current === 'pending') return 'in_progress'
  if (current === 'in_progress') return 'completed'
  return 'pending'
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { today, fetchToday, updateTaskStatus, isLoading } = useEntryStore()
  const [streaks, setStreaks] = useState<StreaksResponse | null>(null)

  useEffect(() => {
    fetchToday()
    statsApi.getStreaks().then(setStreaks).catch(() => {})
  }, [fetchToday])

  const handleStatusToggle = async (task: ResolvedTask) => {
    const newStatus = nextStatus(task.status)
    await updateTaskStatus({
      entry: task._id,
      date: today?.date || new Date().toISOString().split('T')[0],
      status: newStatus,
    })
    fetchToday()
  }

  return (
    <Box maxW="900px" mx="auto" w="full" p={{ base: 4, md: 6 }} pt={{ base: 4, md: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>Today's Prep</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => navigate('/entries/new')}>
          <LuPlus /> Add Entry
        </Button>
      </Flex>

      {/* Streak cards */}
      {streaks && (
        <Flex gap={{ base: 2, md: 4 }} mb={{ base: 4, md: 6 }} wrap="wrap">
          <StatCard
            icon={<LuFlame />}
            label="Current Streak"
            value={`${streaks.currentStreak} day${streaks.currentStreak !== 1 ? 's' : ''}`}
            color="orange"
          />
          <StatCard
            icon={<LuTrophy />}
            label="Longest Streak"
            value={`${streaks.longestStreak} day${streaks.longestStreak !== 1 ? 's' : ''}`}
            color="yellow"
          />
          <StatCard
            icon={<LuCalendar />}
            label="Active Days"
            value={String(streaks.totalActiveDays)}
            color="blue"
          />
        </Flex>
      )}

      {/* Today's summary */}
      {today && today.summary.total > 0 && (
        <Flex gap={2} mb={{ base: 4, md: 6 }} wrap="wrap">
          <Badge size={{ base: 'md', md: 'lg' }} variant="outline">
            {today.summary.total} total
          </Badge>
          <Badge size={{ base: 'md', md: 'lg' }} colorPalette="green" variant="outline">
            {today.summary.completed} done
          </Badge>
          <Badge size={{ base: 'md', md: 'lg' }} colorPalette="yellow" variant="outline">
            {today.summary.in_progress} in progress
          </Badge>
          <Badge size={{ base: 'md', md: 'lg' }} colorPalette="gray" variant="outline">
            {today.summary.pending} pending
          </Badge>
        </Flex>
      )}

      {/* Loading state */}
      {isLoading && !today && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty state */}
      {!isLoading && today && today.summary.total === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            No tasks scheduled for today
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Create entries with deadlines or recurring schedules to see them here.
          </Text>
          <Button colorPalette="blue" onClick={() => navigate('/entries/new')}>
            <LuPlus /> Create your first entry
          </Button>
        </VStack>
      )}

      {/* Task groups by category */}
      {today?.groups.map((group) => (
        <Box key={group.category} mb={6}>
          <HStack mb={3}>
            <Badge colorPalette={CATEGORY_COLOR[group.category] || 'gray'}>
              {CATEGORY_LABEL[group.category as keyof typeof CATEGORY_LABEL] || group.category}
            </Badge>
            <Text fontSize="xs" color="fg.muted">
              {group.summary.completed}/{group.summary.total}
            </Text>
          </HStack>

          <VStack gap={2} align="stretch">
            {group.tasks.map((task) => (
              <Flex
                key={task._id}
                align="center"
                gap={{ base: 2, md: 3 }}
                p={{ base: 2, md: 3 }}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: 'bg.subtle' }}
                cursor="pointer"
                onClick={() => navigate(`/entries/${task._id}`)}
              >
                <Checkbox.Root
                  size="sm"
                  checked={task.status === 'completed'}
                  onCheckedChange={() => handleStatusToggle(task)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>

                <Box flex="1" minW={0}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    textDecoration={task.status === 'completed' ? 'line-through' : undefined}
                    color={task.status === 'completed' ? 'fg.muted' : undefined}
                  >
                    {task.title}
                  </Text>
                  {task.topic && (
                    <Text fontSize="xs" color="fg.muted">
                      {task.topic}
                    </Text>
                  )}
                </Box>

                {task.difficulty && (
                  <Badge
                    size="sm"
                    display={{ base: 'none', sm: 'inline-flex' }}
                    colorPalette={
                      task.difficulty === 'easy'
                        ? 'green'
                        : task.difficulty === 'medium'
                          ? 'yellow'
                          : 'red'
                    }
                  >
                    {task.difficulty}
                  </Badge>
                )}

                <Badge
                  size="sm"
                  variant="outline"
                  colorPalette={
                    task.status === 'completed'
                      ? 'green'
                      : task.status === 'in_progress'
                        ? 'yellow'
                        : 'gray'
                  }
                >
                  <Box display={{ base: 'none', sm: 'inline' }}>{STATUS_LABEL[task.status]}</Box>
                  <Box display={{ base: 'inline', sm: 'none' }}>{task.status === 'completed' ? 'Done' : task.status === 'in_progress' ? 'IP' : '...'}</Box>
                </Badge>
              </Flex>
            ))}
          </VStack>
        </Box>
      ))}
    </Box>
  )
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) => (
  <Box
    flex="1"
    minW={{ base: '0', sm: '140px' }}
    p={{ base: 3, md: 4 }}
    borderWidth="1px"
    borderRadius="lg"
    textAlign="center"
  >
    <Flex justify="center" mb={1} color={`${color}.500`}>
      {icon}
    </Flex>
    <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
      {value}
    </Text>
    <Text fontSize="xs" color="fg.muted">
      {label}
    </Text>
  </Box>
)

export default Dashboard
