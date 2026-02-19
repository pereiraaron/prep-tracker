import { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  NativeSelect,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { LuArrowLeft, LuCircleCheck, LuChevronDown, LuChevronUp, LuTrash2 } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { tasksApi } from '@api/tasks'
import type { DailyTask, Difficulty } from '@api/tasks'
import { questionsApi } from '@api/questions'
import type { Question, QuestionSource } from '@api/questions'
import { CATEGORY_LABEL, CATEGORY_COLOR, DIFFICULTIES, QUESTION_SOURCES, DIFFICULTY_COLOR } from '@api/types'
import PageContainer from '@components/PageContainer'
import ProgressBar from '@components/ProgressBar'
import { ErrorState } from '@components/EmptyState'
import Input from '@components/Input'

const AddQuestions = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [dailyTask, setDailyTask] = useState<DailyTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [source, setSource] = useState('')
  const [topic, setTopic] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Question actions state
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editSolution, setEditSolution] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchDailyTask = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(false)
    try {
      const data = await tasksApi.getDailyTaskById(id)
      setDailyTask(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDailyTask()
  }, [fetchDailyTask])

  const resetForm = () => {
    setTitle('')
    setDifficulty('')
    setSource('')
    setTopic('')
    setUrl('')
    setTags('')
    setNotes('')
    setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !id) return
    setSaving(true)
    setFormError('')
    try {
      await questionsApi.create({
        dailyTaskId: id,
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
      resetForm()
      await refetch()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add question')
    } finally {
      setSaving(false)
    }
  }

  const refetch = async () => {
    if (!id) return
    const updated = await tasksApi.getDailyTaskById(id)
    setDailyTask(updated)
  }

  const toggleExpand = (q: Question) => {
    if (expandedId === q.id) {
      setExpandedId(null)
    } else {
      setExpandedId(q.id)
      setEditSolution(q.solution || '')
      setEditNotes(q.notes || '')
    }
  }

  const handleSolve = async (questionId: string) => {
    setActionLoading(questionId)
    try {
      await questionsApi.solve(questionId)
      await refetch()
    } catch {
      // stays in current state
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (questionId: string) => {
    setActionLoading(questionId)
    try {
      await questionsApi.delete(questionId)
      if (expandedId === questionId) setExpandedId(null)
      await refetch()
    } catch {
      // stays in current state
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateQuestion = async (questionId: string) => {
    setActionLoading(questionId)
    try {
      await questionsApi.update(questionId, {
        ...(editSolution.trim() ? { solution: editSolution.trim() } : { solution: '' }),
        ...(editNotes.trim() ? { notes: editNotes.trim() } : { notes: '' }),
      })
      await refetch()
      setExpandedId(null)
    } catch {
      // stays expanded for retry
    } finally {
      setActionLoading(null)
    }
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

  if (error || !dailyTask) {
    return (
      <PageContainer>
        <Button variant="ghost" size="sm" mb={4} onClick={() => navigate('/')}>
          <LuArrowLeft /> Back to Dashboard
        </Button>
        <ErrorState onRetry={fetchDailyTask} />
      </PageContainer>
    )
  }

  const categoryColor = CATEGORY_COLOR[dailyTask.category] || 'gray'
  const categoryLabel = CATEGORY_LABEL[dailyTask.category as keyof typeof CATEGORY_LABEL] || dailyTask.category
  const progress = dailyTask.targetQuestionCount > 0
    ? Math.round((dailyTask.addedQuestionCount / dailyTask.targetQuestionCount) * 100)
    : 0
  const isComplete = dailyTask.addedQuestionCount >= dailyTask.targetQuestionCount
  const remaining = dailyTask.targetQuestionCount - dailyTask.addedQuestionCount
  const questions: Question[] = dailyTask.questions || []

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" mb={4} onClick={() => navigate('/')}>
        <LuArrowLeft /> Back to Dashboard
      </Button>

      {/* Task header */}
      <Box
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="lg"
        borderLeftWidth="4px"
        borderLeftColor={`${categoryColor}.500`}
        bg="bg.card"
        p={{ base: 4, md: 5 }}
        mb={{ base: 5, md: 6 }}
      >
        <Flex justify="space-between" align="start" gap={3} mb={3}>
          <Box>
            <Heading size={{ base: 'sm', md: 'md' }}>{dailyTask.taskName}</Heading>
            <Flex gap={2} mt={2} align="center" wrap="wrap">
              <Badge size="sm" colorPalette={categoryColor}>{categoryLabel}</Badge>
              <Text fontSize="xs" color="fg.muted">
                {new Date(dailyTask.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
            </Flex>
          </Box>
          <Text fontSize="sm" fontWeight="medium" flexShrink={0}>
            {dailyTask.addedQuestionCount}/{dailyTask.targetQuestionCount} added
          </Text>
        </Flex>
        <ProgressBar value={progress} color={categoryColor} size="sm" />
      </Box>

      {/* Completion state */}
      {isComplete && (
        <Flex
          direction="column"
          align="center"
          gap={3}
          py={10}
          mb={{ base: 5, md: 6 }}
          borderWidth="1px"
          borderColor="green.500/20"
          borderRadius="lg"
          bg="green.500/5"
        >
          <LuCircleCheck size={32} color="var(--chakra-colors-green-500)" />
          <Text fontWeight="medium" color="green.600">All questions added</Text>
          <Text fontSize="sm" color="fg.muted">
            You've added all {dailyTask.targetQuestionCount} question{dailyTask.targetQuestionCount !== 1 ? 's' : ''} for this task.
          </Text>
        </Flex>
      )}

      {/* Add question form */}
      {!isComplete && (
        <>
          <Heading size="sm" mb={3}>
            Add Question ({remaining} remaining)
          </Heading>
          <Box
            as="form"
            onSubmit={handleSubmit}
            mb={{ base: 5, md: 6 }}
            p={{ base: 3, md: 4 }}
            borderWidth="1px"
            borderColor="border.card"
            borderRadius="lg"
            bg="bg.card"
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

              {formError && (
                <Text color="red.500" fontSize="sm">{formError}</Text>
              )}

              <Flex justify="flex-end">
                <Button size="sm" colorPalette="purple" type="submit" loading={saving}>
                  Add Question
                </Button>
              </Flex>
            </VStack>
          </Box>
        </>
      )}

      {/* Added questions list */}
      {questions.length > 0 && (
        <>
          <Heading size="sm" mb={3}>
            Added Questions
          </Heading>
          <VStack gap={0} align="stretch">
            {questions.map((q) => {
              const isExpanded = expandedId === q.id
              const isBusy = actionLoading === q.id

              return (
                <Box
                  key={q.id}
                  borderBottomWidth="1px"
                  borderColor="border.card"
                  _first={{ borderTopWidth: '1px' }}
                >
                  {/* Question row */}
                  <Flex
                    align="center"
                    gap={2}
                    py={3}
                    px={{ base: 3, md: 4 }}
                    cursor="pointer"
                    onClick={() => toggleExpand(q)}
                    _hover={{ bg: 'bg.subtle' }}
                  >
                    {isExpanded ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
                    <Text fontSize="sm" flex="1" lineClamp={1}>{q.title}</Text>
                    {q.difficulty && (
                      <Badge size="sm" colorPalette={DIFFICULTY_COLOR[q.difficulty] || 'gray'}>
                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                      </Badge>
                    )}
                    <Badge size="sm" variant="outline" colorPalette={q.status === 'solved' ? 'green' : 'gray'}>
                      {q.status === 'solved' ? 'Solved' : q.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </Flex>

                  {/* Expanded actions */}
                  {isExpanded && (
                    <Box px={{ base: 3, md: 4 }} pb={3}>
                      <VStack gap={3} align="stretch">
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1}>Solution</Text>
                          <Textarea
                            value={editSolution}
                            onChange={(e) => setEditSolution(e.target.value)}
                            rows={3}
                            placeholder="Write your solution..."
                            size="sm"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1}>Notes</Text>
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={2}
                            placeholder="Add notes..."
                            size="sm"
                          />
                        </Box>
                        <Flex gap={2} justify="space-between" align="center">
                          <Flex gap={2}>
                            {q.status !== 'solved' && (
                              <Button
                                size="xs"
                                colorPalette="green"
                                variant="outline"
                                loading={isBusy}
                                onClick={() => handleSolve(q.id)}
                              >
                                <LuCircleCheck /> Mark Solved
                              </Button>
                            )}
                            <IconButton
                              aria-label="Delete question"
                              size="xs"
                              variant="ghost"
                              colorPalette="red"
                              loading={isBusy}
                              onClick={() => handleDelete(q.id)}
                            >
                              <LuTrash2 />
                            </IconButton>
                          </Flex>
                          <Button
                            size="xs"
                            colorPalette="purple"
                            loading={isBusy}
                            onClick={() => handleUpdateQuestion(q.id)}
                          >
                            Save
                          </Button>
                        </Flex>
                      </VStack>
                    </Box>
                  )}
                </Box>
              )
            })}
          </VStack>
        </>
      )}
    </PageContainer>
  )
}

export default AddQuestions
