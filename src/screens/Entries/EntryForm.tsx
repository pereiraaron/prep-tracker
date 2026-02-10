import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  NativeSelect,
  Textarea,
  Checkbox,
  VStack,
  Text,
} from '@chakra-ui/react'
import { LuArrowLeft, LuSave } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { useEntryStore } from '@store/useEntryStore'
import { entriesApi } from '@api/entries'
import { PREP_CATEGORIES, DIFFICULTIES, STATUSES } from '@api/types'
import type { PrepCategory, Difficulty, EntryStatus, RecurrenceFrequency } from '@api/entries'
import Input from '@components/Input'

const EntryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { createEntry, updateEntry } = useEntryStore()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<PrepCategory>('dsa')
  const [status, setStatus] = useState<EntryStatus>('pending')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [solution, setSolution] = useState('')
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0])
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>('daily')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [recurringEndDate, setRecurringEndDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    entriesApi.getById(id).then((entry) => {
      setTitle(entry.title)
      setCategory(entry.category)
      setStatus(entry.status)
      setDifficulty(entry.difficulty || '')
      setTopic(entry.topic || '')
      setSource(entry.source || '')
      setUrl(entry.url || '')
      setTags(entry.tags.join(', '))
      setNotes(entry.notes || '')
      setSolution(entry.solution || '')
      setDeadline(entry.deadline.split('T')[0])
      setIsRecurring(entry.isRecurring)
      if (entry.recurrence) {
        setRecurrenceFrequency(entry.recurrence.frequency)
        setDaysOfWeek(entry.recurrence.daysOfWeek || [])
      }
      if (entry.recurringEndDate) {
        setRecurringEndDate(entry.recurringEndDate.split('T')[0])
      }
    }).catch(() => {
      setError('Entry not found')
    })
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    const body = {
      title: title.trim(),
      category,
      status,
      ...(difficulty ? { difficulty } : {}),
      ...(topic.trim() ? { topic: topic.trim() } : {}),
      ...(source.trim() ? { source: source.trim() } : {}),
      ...(url.trim() ? { url: url.trim() } : {}),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      ...(solution.trim() ? { solution: solution.trim() } : {}),
      deadline: new Date(deadline).toISOString(),
      isRecurring,
      ...(isRecurring
        ? {
            recurrence: {
              frequency: recurrenceFrequency,
              ...(recurrenceFrequency === 'custom' && daysOfWeek.length > 0
                ? { daysOfWeek }
                : {}),
            },
            ...(recurringEndDate
              ? { recurringEndDate: new Date(recurringEndDate).toISOString() }
              : {}),
          }
        : {}),
    }

    try {
      if (isEdit) {
        await updateEntry(id, body)
      } else {
        await createEntry(body)
      }
      navigate('/entries')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry')
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
    <Box maxW="600px" mx="auto" w="full" p={{ base: 4, md: 6 }} pt={{ base: 4, md: 8 }}>
      <Button variant="ghost" size="sm" mb={4} onClick={() => navigate(-1)}>
        <LuArrowLeft /> Back
      </Button>

      <Heading size={{ base: 'md', md: 'lg' }} mb={{ base: 4, md: 6 }}>
        {isEdit ? 'Edit Entry' : 'New Entry'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              <Text fontSize="sm" fontWeight="medium" mb={1}>Difficulty</Text>
              <NativeSelect.Root size="md">
                <NativeSelect.Field
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
                >
                  <option value="">None</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </Flex>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Status</Text>
            <NativeSelect.Root size="md">
              <NativeSelect.Field
                value={status}
                onChange={(e) => setStatus(e.target.value as EntryStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          <Flex gap={{ base: 3, md: 4 }} direction={{ base: 'column', sm: 'row' }}>
            <Box flex="1">
              <Input
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </Box>
            <Box flex="1">
              <Input
                label="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </Box>
          </Flex>

          <Input
            label="URL"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Input
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Notes</Text>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes..."
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Solution</Text>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={3}
              placeholder="Your solution or approach..."
            />
          </Box>

          <Input
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

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
                    onChange={(e) =>
                      setRecurrenceFrequency(e.target.value as RecurrenceFrequency)
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom days</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              {recurrenceFrequency === 'custom' && (
                <Flex gap={2} wrap="wrap">
                  {DAY_NAMES.map((name, i) => (
                    <Button
                      key={i}
                      size={{ base: 'sm', md: 'xs' }}
                      variant={daysOfWeek.includes(i) ? 'solid' : 'outline'}
                      colorPalette={daysOfWeek.includes(i) ? 'blue' : 'gray'}
                      onClick={() => toggleDay(i)}
                    >
                      {name}
                    </Button>
                  ))}
                </Flex>
              )}

              <Input
                label="End date (optional)"
                type="date"
                value={recurringEndDate}
                onChange={(e) => setRecurringEndDate(e.target.value)}
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
            <LuSave /> {isEdit ? 'Update' : 'Create'} Entry
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default EntryForm
