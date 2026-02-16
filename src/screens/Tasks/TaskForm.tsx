import { useEffect, useState } from 'react'
import PageContainer from '@components/PageContainer'
import {
  Box,
  Button,
  Flex,
  Heading,
  NativeSelect,
  Checkbox,
  VStack,
  Text,
} from '@chakra-ui/react'
import { LuArrowLeft, LuSave } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { tasksApi } from '@api/tasks'
import type { PrepCategory, RecurrenceFrequency } from '@api/tasks'
import { PREP_CATEGORIES } from '@api/types'
import Input from '@components/Input'

const TaskForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { createTask, updateTask } = useTaskStore()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<PrepCategory>('dsa')
  const [targetQuestionCount, setTargetQuestionCount] = useState(3)
  const [isRecurring, setIsRecurring] = useState(true)
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>('daily')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [interval, setInterval] = useState(1)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    tasksApi.getById(id).then((task) => {
      setName(task.name)
      setCategory(task.category)
      setTargetQuestionCount(task.targetQuestionCount)
      setIsRecurring(task.isRecurring)
      if (task.recurrence) {
        setRecurrenceFrequency(task.recurrence.frequency)
        setDaysOfWeek(task.recurrence.daysOfWeek || [])
        if (task.recurrence.interval) setInterval(task.recurrence.interval)
        setStartDate(task.recurrence.startDate.split('T')[0])
      }
      if (task.endDate) setEndDate(task.endDate.split('T')[0])
    }).catch(() => {
      setError('Task not found')
    })
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')

    const body = {
      name: name.trim(),
      category,
      targetQuestionCount,
      isRecurring,
      ...(isRecurring
        ? {
            recurrence: {
              frequency: recurrenceFrequency,
              ...(recurrenceFrequency === 'weekly' || recurrenceFrequency === 'custom'
                ? { daysOfWeek }
                : {}),
              ...(recurrenceFrequency === 'custom' ? { interval } : {}),
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

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" mb={4} onClick={() => navigate(-1)}>
        <LuArrowLeft /> Back
      </Button>

      <Heading size={{ base: 'md', md: 'lg' }} mb={{ base: 4, md: 6 }}>
        {isEdit ? 'Edit Task' : 'New Task'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Input
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Flex gap={{ base: 3, md: 4 }} direction={{ base: 'column', sm: 'row' }}>
            <Box flex="1">
              <Text fontSize="sm" fontWeight="medium" mb={1}>Category</Text>
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

            <Box flex="1">
              <Input
                label="Target Questions/Day"
                type="number"
                value={String(targetQuestionCount)}
                onChange={(e) => setTargetQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                required
              />
            </Box>
          </Flex>

          <Checkbox.Root
            size="sm"
            checked={isRecurring}
            onCheckedChange={(e) => setIsRecurring(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label fontSize="sm">Recurring task</Checkbox.Label>
          </Checkbox.Root>

          {isRecurring && (
            <VStack gap={3} align="stretch" ps={6}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Frequency</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={recurrenceFrequency}
                    onChange={(e) => setRecurrenceFrequency(e.target.value as RecurrenceFrequency)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              {(recurrenceFrequency === 'weekly' || recurrenceFrequency === 'custom') && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Days of Week</Text>
                  <Flex gap={2} wrap="wrap">
                    {DAY_NAMES.map((dayName, i) => (
                      <Button
                        key={i}
                        size={{ base: 'sm', md: 'xs' }}
                        variant={daysOfWeek.includes(i) ? 'solid' : 'outline'}
                        colorPalette={daysOfWeek.includes(i) ? 'blue' : 'gray'}
                        onClick={() => toggleDay(i)}
                      >
                        {dayName}
                      </Button>
                    ))}
                  </Flex>
                </Box>
              )}

              {recurrenceFrequency === 'custom' && (
                <Input
                  label="Interval (days)"
                  type="number"
                  value={String(interval)}
                  onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                />
              )}

              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />

              <Input
                label="End Date (optional)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </VStack>
          )}

          {error && (
            <Text color="red.500" fontSize="sm">{error}</Text>
          )}

          <Button
            type="submit"
            colorPalette="blue"
            size="lg"
            loading={saving}
            w="full"
          >
            <LuSave /> {isEdit ? 'Update' : 'Create'} Task
          </Button>
        </VStack>
      </form>
    </PageContainer>
  )
}

export default TaskForm
