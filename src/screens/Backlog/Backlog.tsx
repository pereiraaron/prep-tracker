import { useEffect, useState } from 'react'
import {
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  Spinner,
  IconButton,
} from '@chakra-ui/react'
import { LuPlus, LuFilter } from 'react-icons/lu'
import { questionsApi } from '@api/questions'
import type { Question, CreateBacklogQuestionBody, QuestionStatus } from '@api/questions'
import type { Difficulty } from '@api/tasks'
import { useTaskStore } from '@store/useTaskStore'
import PageContainer from '@components/PageContainer'
import BacklogFilters from './components/BacklogFilters'
import QuestionCard from './components/QuestionCard'
import BulkActionBar from './components/BulkActionBar'
import BacklogForm from './components/BacklogForm'
import { MOCK_BACKLOG } from './mockData'

const Backlog = () => {
  const { today, fetchToday } = useTaskStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Filters
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false)
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
        ...(status ? { status: status as QuestionStatus } : {}),
        ...(category ? { topic: category } : {}),
      })
      setQuestions(data.questions)
      setTotalCount(data.pagination.total)
    } catch {
      if (import.meta.env.DEV) {
        setQuestions(MOCK_BACKLOG)
        setTotalCount(MOCK_BACKLOG.length)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBacklog()
    fetchToday()
  }, [category, difficulty, status, source, fetchToday])

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

  const clearFilters = () => {
    setCategory('')
    setDifficulty('')
    setStatus('')
    setSource('')
  }

  const hasFilters = !!(category || difficulty || status || source)
  const todayInstances = today?.groups.flatMap((g) => g.instances) || []

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={2}>
          <Heading size={{ base: 'md', md: 'lg' }}>Backlog</Heading>
          {!loading && (
            <Badge variant="subtle" size="sm" colorPalette="purple">
              {totalCount} Question{totalCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </Flex>

        <Flex gap={2} align="center">
          {/* Mobile filter toggle */}
          <IconButton
            aria-label="Toggle filters"
            variant={hasFilters ? 'solid' : 'outline'}
            colorPalette={hasFilters ? 'purple' : undefined}
            size="sm"
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            <LuFilter />
          </IconButton>

          {/* Desktop add button */}
          <Button
            colorPalette="purple"
            size="sm"
            onClick={() => setShowForm(true)}
            display={{ base: 'none', md: 'flex' }}
          >
            <LuPlus /> New Question
          </Button>
        </Flex>
      </Flex>

      {/* Filters */}
      <BacklogFilters
        category={category}
        difficulty={difficulty}
        status={status}
        source={source}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        showMobile={showMobileFilters}
      />

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

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {hasFilters ? 'No questions match the filters' : 'Backlog is empty'}
          </Text>
          {hasFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
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
      <VStack gap={2} align="stretch" pb={selected.size > 0 ? 20 : 0}>
        {questions.map((q) => (
          <QuestionCard
            key={q._id}
            question={q}
            isSelected={selected.has(q._id)}
            onToggle={() => toggleSelect(q._id)}
            onDelete={() => handleDelete(q._id)}
          />
        ))}
      </VStack>

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selected.size}
        todayInstances={todayInstances}
        moveTarget={moveTarget}
        onMoveTargetChange={setMoveTarget}
        onMove={handleBulkMove}
        moving={moving}
      />

      {/* Mobile FAB */}
      <IconButton
        aria-label="Add question"
        colorPalette="purple"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={selected.size > 0 ? 20 : 6}
        right={6}
        display={{ base: 'flex', md: 'none' }}
        boxShadow="lg"
        onClick={() => setShowForm(true)}
      >
        <LuPlus />
      </IconButton>
    </PageContainer>
  )
}

export default Backlog
