import { useEffect, useState } from 'react'
import PageContainer from '@components/PageContainer'
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  NativeSelect,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LuArrowLeft, LuPlus, LuTrash2 } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { tasksApi } from '@api/tasks'
import type { PrepCategory } from '@api/tasks'
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES, DIFFICULTY_COLOR } from '@api/types'
import Input from '@components/Input'

type FrequencyOption = 'daily' | 'weekly' | 'one_time' | 'custom'

interface FormQuestion {
  title: string
  difficulty: string
  source: string
}

const FREQUENCY_OPTIONS: { value: FrequencyOption; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'one_time', label: 'One-time' },
  { value: 'custom', label: 'Custom' },
]

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// Map display index (Mon=0..Sun=6) to JS day index (Mon=1..Sun=0)
const DAY_MAP = [1, 2, 3, 4, 5, 6, 0]

const TaskForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { createTask, updateTask } = useTaskStore()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<PrepCategory>('dsa')
  const [frequency, setFrequency] = useState<FrequencyOption>('daily')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)

  // Questions (visual only)
  const [questions, setQuestions] = useState<FormQuestion[]>([])
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState<FormQuestion>({ title: '', difficulty: '', source: '' })

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    tasksApi.getById(id).then((task) => {
      setName(task.name)
      setCategory(task.category)
      if (!task.isRecurring) {
        setFrequency('one_time')
      } else if (task.recurrence) {
        setFrequency(task.recurrence.frequency === 'daily' ? 'daily'
          : task.recurrence.frequency === 'weekly' ? 'weekly'
          : task.recurrence.frequency === 'custom' ? 'custom'
          : 'daily')
        setDaysOfWeek(task.recurrence.daysOfWeek || [])
        setStartDate(task.recurrence.startDate.split('T')[0])
      }
      if (task.endDate) setEndDate(task.endDate.split('T')[0])
    }).catch(() => {
      setNotFound(true)
    }).finally(() => {
      setLoading(false)
    })
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')

    const isRecurring = frequency !== 'one_time'
    const targetQuestionCount = Math.max(1, questions.length)

    const body = {
      name: name.trim(),
      category,
      targetQuestionCount,
      isRecurring,
      ...(isRecurring
        ? {
            recurrence: {
              frequency: frequency as 'daily' | 'weekly' | 'custom',
              ...((frequency === 'weekly' || frequency === 'custom') && daysOfWeek.length > 0
                ? { daysOfWeek }
                : {}),
              startDate: new Date(startDate).toISOString(),
            },
            ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
          }
        : {}),
    }

    try {
      if (isEdit) {
        await updateTask(id, body)
      } else {
        await createTask(body)
      }
      navigate('/tasks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  const toggleDay = (jsDay: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(jsDay) ? prev.filter((d) => d !== jsDay) : [...prev, jsDay]
    )
  }

  const handleAddQuestion = () => {
    if (!newQuestion.title.trim()) return
    setQuestions((prev) => [...prev, { ...newQuestion, title: newQuestion.title.trim() }])
    setNewQuestion({ title: '', difficulty: '', source: '' })
    setShowAddQuestion(false)
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <PageContainer>
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
      </PageContainer>
    )
  }

  if (notFound) {
    return (
      <PageContainer>
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">Task not found</Text>
          <Text color="fg.muted" fontSize="sm">
            This task may have been deleted or the link is invalid.
          </Text>
          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
            <LuArrowLeft /> Back to Tasks
          </Button>
        </VStack>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" mb={4} onClick={() => navigate(-1)}>
        <LuArrowLeft /> Back
      </Button>

      <Heading size={{ base: 'md', md: 'lg' }} mb={{ base: 6, md: 8 }}>
        {isEdit ? 'Edit Task' : 'New Task'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={{ base: 8, md: 10 }} align="stretch">
          {/* Two-column layout */}
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: 6, md: 10 }} alignItems="start">
            {/* Left column */}
            <VStack gap={5} align="stretch">
              <Input
                label="Task Name"
                placeholder="e.g., Daily DSA Practice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Category</Text>
                <NativeSelect.Root size="md">
                  <NativeSelect.Field
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PrepCategory)}
                  >
                    {PREP_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </VStack>

            {/* Right column */}
            <VStack gap={5} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Frequency</Text>
                <Flex gap={2} wrap="wrap">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={frequency === opt.value ? 'solid' : 'outline'}
                      colorPalette={frequency === opt.value ? 'purple' : 'gray'}
                      onClick={() => setFrequency(opt.value)}
                      type="button"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Flex>
              </Box>

              {(frequency === 'weekly' || frequency === 'custom') && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Days of Week</Text>
                  <Flex gap={2} wrap="wrap">
                    {DAY_NAMES.map((dayName, i) => {
                      const jsDay = DAY_MAP[i]
                      return (
                        <Button
                          key={dayName}
                          size="sm"
                          variant={daysOfWeek.includes(jsDay) ? 'solid' : 'outline'}
                          colorPalette={daysOfWeek.includes(jsDay) ? 'purple' : 'gray'}
                          onClick={() => toggleDay(jsDay)}
                          type="button"
                          px={3}
                        >
                          {dayName}
                        </Button>
                      )
                    })}
                  </Flex>
                </Box>
              )}

              {frequency !== 'one_time' && (
                <>
                  <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <Input
                    label="End Date (Optional)"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </>
              )}
            </VStack>
          </Grid>

          {/* Questions section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="sm" fontWeight="medium">Questions</Text>
              <Button
                size="sm"
                variant="outline"
                colorPalette="purple"
                onClick={() => setShowAddQuestion(true)}
                type="button"
              >
                <LuPlus /> Add Question
              </Button>
            </Flex>

            {showAddQuestion && (
              <Box
                bg="bg.card"
                borderWidth="1px"
                borderColor="border.card"
                borderRadius="lg"
                p={{ base: 3, md: 4 }}
                mb={4}
              >
                <VStack gap={3} align="stretch">
                  <Box>
                    <Input
                      label="Question Title"
                      value={newQuestion.title}
                      onChange={(e) => setNewQuestion((q) => ({ ...q, title: e.target.value }))}
                      size="sm"
                      autoFocus
                    />
                  </Box>
                  <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                    <NativeSelect.Root size="sm" flex="1">
                      <NativeSelect.Field
                        value={newQuestion.difficulty}
                        onChange={(e) => setNewQuestion((q) => ({ ...q, difficulty: e.target.value }))}
                      >
                        <option value="">Difficulty</option>
                        {DIFFICULTIES.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <NativeSelect.Root size="sm" flex="1">
                      <NativeSelect.Field
                        value={newQuestion.source}
                        onChange={(e) => setNewQuestion((q) => ({ ...q, source: e.target.value }))}
                      >
                        <option value="">Source</option>
                        {QUESTION_SOURCES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Flex>
                  <Flex gap={2} justify="flex-end">
                    <Button size="sm" variant="ghost" onClick={() => setShowAddQuestion(false)} type="button">
                      Cancel
                    </Button>
                    <Button size="sm" colorPalette="purple" onClick={handleAddQuestion} type="button">
                      Add
                    </Button>
                  </Flex>
                </VStack>
              </Box>
            )}

            {questions.length > 0 ? (
              <VStack gap={0} align="stretch">
                {questions.map((q, i) => (
                  <Flex
                    key={i}
                    align="center"
                    gap={3}
                    py={3}
                    px={{ base: 3, md: 4 }}
                    borderBottomWidth="1px"
                    borderColor="border.card"
                    _first={{ borderTopWidth: '1px' }}
                  >
                    <Text fontSize="sm" flex="1" lineClamp={1}>{q.title}</Text>
                    {q.difficulty && (
                      <Badge size="sm" colorPalette={DIFFICULTY_COLOR[q.difficulty] || 'gray'}>
                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                      </Badge>
                    )}
                    {q.source && (
                      <Text fontSize="xs" color="fg.muted" flexShrink={0}>
                        {q.source === 'leetcode' ? 'LeetCode' : q.source === 'greatfrontend' ? 'GreatFrontend' : q.source}
                      </Text>
                    )}
                    <IconButton
                      aria-label="Remove question"
                      variant="ghost"
                      size="xs"
                      colorPalette="red"
                      onClick={() => handleRemoveQuestion(i)}
                      type="button"
                    >
                      <LuTrash2 />
                    </IconButton>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text fontSize="sm" color="fg.muted" textAlign="center" py={6}>
                No questions added yet.
              </Text>
            )}
          </Box>

          {error && (
            <Text color="red.500" fontSize="sm">{error}</Text>
          )}

          {/* Bottom buttons */}
          <Flex gap={3} justify="flex-end" pt={{ base: 2, md: 4 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorPalette="purple"
              size="lg"
              loading={saving}
            >
              {isEdit ? 'Update Task' : 'Create Task'}
            </Button>
          </Flex>
        </VStack>
      </form>
    </PageContainer>
  )
}

export default TaskForm
