import { useEffect, useState } from 'react'
import PageContainer from '@components/PageContainer'
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  Spinner,
  NativeSelect,
  Checkbox,
  Textarea,
} from '@chakra-ui/react'
import { LuPlus, LuTrash2, LuArrowRight } from 'react-icons/lu'
import { questionsApi } from '@api/questions'
import type { Question, CreateBacklogQuestionBody, QuestionSource } from '@api/questions'
import { useTaskStore } from '@store/useTaskStore'
import { DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import type { Difficulty } from '@api/tasks'
import Input from '@components/Input'

const Backlog = () => {
  const { today, fetchToday } = useTaskStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('')
  const [source, setSource] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [moveTarget, setMoveTarget] = useState('')
  const [moving, setMoving] = useState(false)

  const fetchBacklog = async () => {
    setLoading(true)
    try {
      const data = await questionsApi.getBacklog({
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(source ? { source } : {}),
      })
      setQuestions(data.questions)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBacklog()
    fetchToday()
  }, [difficulty, source, fetchToday])

  const handleCreate = async (body: CreateBacklogQuestionBody) => {
    await questionsApi.createBacklog(body)
    setShowForm(false)
    fetchBacklog()
  }

  const handleDelete = async (id: string) => {
    await questionsApi.delete(id)
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    fetchBacklog()
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkMove = async () => {
    if (!moveTarget || selected.size === 0) return
    setMoving(true)
    try {
      await questionsApi.bulkMove(Array.from(selected), moveTarget)
      setSelected(new Set())
      setMoveTarget('')
      fetchBacklog()
      fetchToday()
    } finally {
      setMoving(false)
    }
  }

  const todayInstances = today?.groups.flatMap((g) => g.instances) || []

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>Backlog</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => setShowForm(true)}>
          <LuPlus /> Add to Backlog
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={2} mb={{ base: 4, md: 6 }} wrap="wrap" direction={{ base: 'column', sm: 'row' }}>
        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All Sources</option>
            {QUESTION_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      {/* Bulk move bar */}
      {selected.size > 0 && (
        <Flex
          gap={2}
          mb={4}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          bg="bg.subtle"
          align="center"
          wrap="wrap"
        >
          <Text fontSize="sm" fontWeight="medium">
            {selected.size} selected
          </Text>
          <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }} flex={{ sm: '1' }}>
            <NativeSelect.Field value={moveTarget} onChange={(e) => setMoveTarget(e.target.value)}>
              <option value="">Move to...</option>
              {todayInstances.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.taskName} ({inst.category})
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Button
            size="sm"
            colorPalette="blue"
            disabled={!moveTarget}
            loading={moving}
            onClick={handleBulkMove}
          >
            <LuArrowRight /> Move
          </Button>
        </Flex>
      )}

      {/* Add form */}
      {showForm && (
        <BacklogForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {/* Loading */}
      {loading && questions.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty */}
      {!loading && questions.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {difficulty || source ? 'No backlog questions match the filters' : 'Backlog is empty'}
          </Text>
          {difficulty || source ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDifficulty('')
                setSource('')
              }}
            >
              Clear filters
            </Button>
          ) : (
            <Text color="fg.muted" fontSize="sm">
              Save questions here for later and move them to active tasks when ready.
            </Text>
          )}
        </VStack>
      )}

      {/* Question list */}
      <VStack gap={2} align="stretch">
        {questions.map((q) => (
          <Flex
            key={q._id}
            align="center"
            gap={{ base: 2, md: 3 }}
            p={{ base: 2, md: 3 }}
            borderWidth="1px"
            borderRadius="md"
          >
            <Checkbox.Root
              size="sm"
              checked={selected.has(q._id)}
              onCheckedChange={() => toggleSelect(q._id)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>

            <Box flex="1" minW={0}>
              <Text fontSize="sm" fontWeight="medium">{q.title}</Text>
              <Flex gap={2} mt={1} wrap="wrap" align="center">
                {q.topic && <Text fontSize="xs" color="fg.muted">{q.topic}</Text>}
                {q.source && (
                  <Badge size="sm" variant="outline" display={{ base: 'none', sm: 'inline-flex' }}>
                    {q.source}
                  </Badge>
                )}
                {q.url && (
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'inline' }}
                  >
                    <Text fontSize="xs" color="blue.500" display={{ base: 'none', sm: 'inline' }}>
                      link
                    </Text>
                  </a>
                )}
              </Flex>
            </Box>

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

            <Button
              variant="ghost"
              size="xs"
              colorPalette="red"
              onClick={() => handleDelete(q._id)}
            >
              <LuTrash2 />
            </Button>
          </Flex>
        ))}
      </VStack>
    </PageContainer>
  )
}

const BacklogForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (body: CreateBacklogQuestionBody) => Promise<void>
  onCancel: () => void
}) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        title: title.trim(),
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(topic.trim() ? { topic: topic.trim() } : {}),
        ...(source ? { source: source as QuestionSource } : {}),
        ...(url.trim() ? { url: url.trim() } : {}),
        ...(tags.trim()
          ? { tags: tags.split(',').map((t) => t.trim()).filter(Boolean) }
          : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      mb={4}
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      borderRadius="md"
    >
      <VStack gap={3} align="stretch">
        <Input
          label="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Flex gap={2} direction={{ base: 'column', sm: 'row' }}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={1}>Difficulty</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">None</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={1}>Source</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">None</option>
                {QUESTION_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </Flex>

        <Flex gap={2} direction={{ base: 'column', sm: 'row' }}>
          <Box flex="1">
            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Box>
          <Box flex="1">
            <Input
              label="URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
        </Flex>

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
            rows={2}
            placeholder="Add notes..."
            size="sm"
          />
        </Box>

        <Flex gap={2} justify="flex-end">
          <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button size="sm" colorPalette="blue" type="submit" loading={saving}>
            Add to Backlog
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}

export default Backlog
