import { useEffect, useState } from 'react'
import PageContainer from '@components/PageContainer'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  NativeSelect,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LuArrowLeft } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { tasksApi } from '@api/tasks'
import type { PrepCategory } from '@api/tasks'
import { PREP_CATEGORIES } from '@api/types'
import Input from '@components/Input'

type FrequencyOption = 'daily' | 'weekly' | 'one_time' | 'custom'

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
  const [targetQuestionCount, setTargetQuestionCount] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    tasksApi.getById(id).then((task) => {
      setName(task.name)
      setCategory(task.category)
      setTargetQuestionCount(task.targetQuestionCount)
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

              <Input
                label="Target Questions per Day"
                type="number"
                value={String(targetQuestionCount)}
                onChange={(e) => setTargetQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
              />
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
