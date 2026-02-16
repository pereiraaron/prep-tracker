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
  NativeSelect,
  Progress,
} from '@chakra-ui/react'
import {
  LuPlus,
  LuFlame,
  LuTrophy,
  LuCalendar,
  LuChevronDown,
  LuChevronRight,
  LuCheck,
} from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { questionsApi } from '@api/questions'
import type { CreateQuestionBody } from '@api/questions'
import { statsApi, type StreaksResponse } from '@api/stats'
import { CATEGORY_LABEL, CATEGORY_COLOR, INSTANCE_STATUS_COLOR, DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import type { TaskInstance } from '@api/tasks'
import Input from '@components/Input'
import PageContainer from '@components/PageContainer'
import StatCard from '@components/StatCard'

const Dashboard = () => {
  const navigate = useNavigate()
  const { today, fetchToday, isLoading } = useTaskStore()
  const [streaks, setStreaks] = useState<StreaksResponse | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [addingTo, setAddingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchToday()
    statsApi.getStreaks().then(setStreaks).catch(() => {})
  }, [fetchToday])

  const toggleExpand = (instanceId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(instanceId)) next.delete(instanceId)
      else next.add(instanceId)
      return next
    })
  }

  const handleSolve = async (questionId: string) => {
    await questionsApi.solve(questionId)
    fetchToday()
  }

  const handleAddQuestion = async (instanceId: string, body: Omit<CreateQuestionBody, 'taskInstanceId'>) => {
    await questionsApi.create({ ...body, taskInstanceId: instanceId })
    setAddingTo(null)
    fetchToday()
  }

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>Today's Prep</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => navigate('/tasks/new')}>
          <LuPlus /> New Task
        </Button>
      </Flex>

      {/* Streak cards */}
      {streaks && (
        <Flex gap={{ base: 2, md: 4 }} mb={{ base: 4, md: 6 }} wrap="wrap">
          <Box flex="1" minW={{ base: '0', sm: '140px' }}>
            <StatCard
              icon={<LuFlame />}
              label="Current Streak"
              value={streaks.currentStreak}
              suffix={` day${streaks.currentStreak !== 1 ? 's' : ''}`}
              color="orange.500"
            />
          </Box>
          <Box flex="1" minW={{ base: '0', sm: '140px' }}>
            <StatCard
              icon={<LuTrophy />}
              label="Longest Streak"
              value={streaks.longestStreak}
              suffix={` day${streaks.longestStreak !== 1 ? 's' : ''}`}
              color="yellow.500"
            />
          </Box>
          <Box flex="1" minW={{ base: '0', sm: '140px' }}>
            <StatCard
              icon={<LuCalendar />}
              label="Active Days"
              value={streaks.totalActiveDays}
              color="blue.500"
            />
          </Box>
        </Flex>
      )}

      {/* Today's summary */}
      {today && today.summary.total > 0 && (
        <Flex gap={2} mb={{ base: 4, md: 6 }} wrap="wrap">
          <Badge size={{ base: 'md', md: 'lg' }} variant="outline">
            {today.summary.total} total
          </Badge>
          <Badge size={{ base: 'md', md: 'lg' }} colorPalette="green" variant="outline">
            {today.summary.completed} completed
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
            Create recurring tasks to see them here each day.
          </Text>
          <Button colorPalette="blue" onClick={() => navigate('/tasks/new')}>
            <LuPlus /> Create your first task
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
            {group.instances.map((instance) => (
              <InstanceCard
                key={instance._id}
                instance={instance}
                isExpanded={expanded.has(instance._id)}
                onToggle={() => toggleExpand(instance._id)}
                onSolve={handleSolve}
                isAdding={addingTo === instance._id}
                onStartAdd={() => setAddingTo(instance._id)}
                onCancelAdd={() => setAddingTo(null)}
                onAdd={(body) => handleAddQuestion(instance._id, body)}
              />
            ))}
          </VStack>
        </Box>
      ))}
    </PageContainer>
  )
}

const InstanceCard = ({
  instance,
  isExpanded,
  onToggle,
  onSolve,
  isAdding,
  onStartAdd,
  onCancelAdd,
  onAdd,
}: {
  instance: TaskInstance
  isExpanded: boolean
  onToggle: () => void
  onSolve: (questionId: string) => void
  isAdding: boolean
  onStartAdd: () => void
  onCancelAdd: () => void
  onAdd: (body: Omit<CreateQuestionBody, 'taskInstanceId'>) => void
}) => {
  const progress = instance.targetQuestionCount > 0
    ? Math.round((instance.solvedQuestionCount / instance.targetQuestionCount) * 100)
    : 0

  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden">
      {/* Instance header */}
      <Flex
        align="center"
        gap={{ base: 2, md: 3 }}
        p={{ base: 2, md: 3 }}
        cursor="pointer"
        _hover={{ bg: 'bg.subtle' }}
        onClick={onToggle}
      >
        <Box color="fg.muted">
          {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
        </Box>

        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight="medium">{instance.taskName}</Text>
          <Flex align="center" gap={2} mt={1}>
            <Progress.Root value={progress} size="xs" flex="1" maxW="120px" colorPalette={INSTANCE_STATUS_COLOR[instance.status] || 'gray'}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text fontSize="xs" color="fg.muted">
              {instance.solvedQuestionCount}/{instance.targetQuestionCount}
            </Text>
          </Flex>
        </Box>

        <Badge
          size="sm"
          variant="outline"
          colorPalette={INSTANCE_STATUS_COLOR[instance.status] || 'gray'}
        >
          <Box display={{ base: 'none', sm: 'inline' }}>{instance.status.replace('_', ' ')}</Box>
          <Box display={{ base: 'inline', sm: 'none' }}>
            {instance.status === 'completed' ? 'Done' : instance.status === 'in_progress' ? 'IP' : instance.status === 'incomplete' ? 'Inc' : '...'}
          </Box>
        </Badge>
      </Flex>

      {/* Expanded: questions list */}
      {isExpanded && (
        <Box borderTopWidth="1px" px={{ base: 2, md: 3 }} py={2}>
          {instance.questions && instance.questions.length > 0 ? (
            <VStack gap={1} align="stretch">
              {instance.questions.map((q) => (
                <Flex key={q._id} align="center" gap={2} py={1}>
                  <Checkbox.Root
                    size="sm"
                    checked={q.status === 'solved'}
                    disabled={q.status === 'solved'}
                    onCheckedChange={() => {
                      if (q.status !== 'solved') onSolve(q._id)
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      {q.status === 'solved' && <LuCheck />}
                    </Checkbox.Control>
                  </Checkbox.Root>

                  <Text
                    flex="1"
                    fontSize="sm"
                    textDecoration={q.status === 'solved' ? 'line-through' : undefined}
                    color={q.status === 'solved' ? 'fg.muted' : undefined}
                  >
                    {q.title}
                  </Text>

                  {q.difficulty && (
                    <Badge
                      size="sm"
                      display={{ base: 'none', sm: 'inline-flex' }}
                      colorPalette={
                        q.difficulty === 'easy' ? 'green' : q.difficulty === 'medium' ? 'yellow' : 'red'
                      }
                    >
                      {q.difficulty}
                    </Badge>
                  )}
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="fg.muted" py={2}>No questions added yet</Text>
          )}

          {/* Add question inline form */}
          {isAdding ? (
            <AddQuestionForm onSubmit={onAdd} onCancel={onCancelAdd} />
          ) : (
            <Button size="xs" variant="ghost" mt={2} onClick={onStartAdd}>
              <LuPlus /> Add Question
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}

const AddQuestionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (body: Omit<CreateQuestionBody, 'taskInstanceId'>) => void
  onCancel: () => void
}) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [source, setSource] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        title: title.trim(),
        ...(difficulty ? { difficulty: difficulty as 'easy' | 'medium' | 'hard' } : {}),
        ...(source ? { source: source as 'leetcode' | 'greatfrontend' | 'other' } : {}),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} mt={2} p={2} borderWidth="1px" borderRadius="md" bg="bg.subtle">
      <VStack gap={2} align="stretch">
        <Input
          label="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="sm"
          required
          autoFocus
        />
        <Flex gap={2}>
          <NativeSelect.Root size="sm" flex="1">
            <NativeSelect.Field value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root size="sm" flex="1">
            <NativeSelect.Field value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Source</option>
              {QUESTION_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
        <Flex gap={2} justify="flex-end">
          <Button size="xs" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button size="xs" colorPalette="blue" type="submit" loading={saving}>Add</Button>
        </Flex>
      </VStack>
    </Box>
  )
}

export default Dashboard
