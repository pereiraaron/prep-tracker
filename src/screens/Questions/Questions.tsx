import { useCallback, useEffect, useRef, useState } from 'react'
import { Flex, Heading, Text, Badge, Button, VStack, Spinner, IconButton } from '@chakra-ui/react'
import { LuPlus, LuFilter, LuSearch } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { questionsApi } from '@api/questions'
import type { Question, QuestionsFilter, QuestionStatus } from '@api/questions'
import type { Difficulty, PrepCategory } from '@api/types'
import PageContainer from '@components/PageContainer'
import { ErrorState } from '@components/EmptyState'
import Pagination from '@components/Pagination'
import QuestionsFilters from './components/QuestionsFilters'
import QuestionListCard from './components/QuestionListCard'

const Questions = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Filters
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [source, setSource] = useState('')
  const [starred, setStarred] = useState('')
  const [sort, setSort] = useState('')

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // UI
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value)
      setPage(1)
    }, 300)
  }

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      let data
      if (searchQuery.trim()) {
        data = await questionsApi.search(searchQuery.trim(), {
          status: status ? (status as QuestionStatus) : undefined,
          difficulty: difficulty ? (difficulty as Difficulty) : undefined,
          page,
          limit: 20,
        })
      } else {
        const filter: QuestionsFilter = { page, limit: 20 }
        if (category) filter.category = category as PrepCategory
        if (status) filter.status = status as QuestionStatus
        if (difficulty) filter.difficulty = difficulty as Difficulty
        if (source) filter.source = source
        if (starred) filter.starred = true
        if (sort) filter.sort = sort
        data = await questionsApi.getAll(filter)
      }
      setQuestions(data.data)
      setTotalCount(data.pagination.total)
      setTotalPages(data.pagination.totalPages)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, status, difficulty, source, starred, sort, page])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const handleStar = async (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
    )
    try {
      await questionsApi.star(id)
    } catch {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
      )
    }
  }

  const handleSolve = async (id: string) => {
    try {
      await questionsApi.solve(id)
      fetchQuestions()
    } catch { /* stays in list */ }
  }

  const handleReset = async (id: string) => {
    try {
      await questionsApi.reset(id)
      fetchQuestions()
    } catch { /* stays in list */ }
  }

  const handleDelete = async (id: string) => {
    try {
      await questionsApi.delete(id)
      fetchQuestions()
    } catch { /* stays in list */ }
  }

  const clearFilters = () => {
    setCategory('')
    setStatus('')
    setDifficulty('')
    setSource('')
    setStarred('')
    setSort('')
    setSearchInput('')
    setSearchQuery('')
    setPage(1)
  }

  const hasFilters = !!(category || status || difficulty || source || starred || sort || searchQuery)

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={2}>
          <Heading size={{ base: 'md', md: 'lg' }}>Questions</Heading>
          {!loading && (
            <Badge variant="subtle" size="sm" colorPalette="purple">
              {totalCount}
            </Badge>
          )}
        </Flex>

        <Flex gap={2} align="center">
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

          <Button
            colorPalette="purple"
            size="sm"
            onClick={() => navigate('/questions/new')}
            display={{ base: 'none', md: 'flex' }}
          >
            <LuPlus /> New Question
          </Button>
        </Flex>
      </Flex>

      {/* Search */}
      <Flex
        align="center"
        gap={2}
        mb={{ base: 3, md: 4 }}
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="lg"
        px={3}
        py={1}
      >
        <LuSearch size={16} color="var(--chakra-colors-fg-muted)" />
        <input
          placeholder="Search questions..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            flex: 1,
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
            padding: '4px 0',
          }}
        />
      </Flex>

      {/* Filters */}
      <QuestionsFilters
        category={category}
        status={status}
        difficulty={difficulty}
        source={source}
        starred={starred}
        sort={sort}
        onCategoryChange={(v) => { setCategory(v); setPage(1) }}
        onStatusChange={(v) => { setStatus(v); setPage(1) }}
        onDifficultyChange={(v) => { setDifficulty(v); setPage(1) }}
        onSourceChange={(v) => { setSource(v); setPage(1) }}
        onStarredChange={(v) => { setStarred(v); setPage(1) }}
        onSortChange={(v) => { setSort(v); setPage(1) }}
        showMobile={showMobileFilters}
      />

      {/* Loading */}
      {loading && questions.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error */}
      {!loading && error && <ErrorState onRetry={fetchQuestions} />}

      {/* Empty */}
      {!loading && !error && questions.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {hasFilters ? 'No questions match your filters' : 'No questions yet'}
          </Text>
          {hasFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button
              colorPalette="purple"
              size="sm"
              onClick={() => navigate('/questions/new')}
            >
              Add your first question
            </Button>
          )}
        </VStack>
      )}

      {/* Question list */}
      <VStack gap={2} align="stretch">
        {questions.map((q) => (
          <QuestionListCard
            key={q.id}
            question={q}
            onStar={() => handleStar(q.id)}
            onSolve={() => handleSolve(q.id)}
            onReset={() => handleReset(q.id)}
            onEdit={() => navigate(`/questions/${q.id}`)}
            onDelete={() => handleDelete(q.id)}
          />
        ))}
      </VStack>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Mobile FAB */}
      <IconButton
        aria-label="Add question"
        colorPalette="purple"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        display={{ base: 'flex', md: 'none' }}
        boxShadow="lg"
        onClick={() => navigate('/questions/new')}
      >
        <LuPlus />
      </IconButton>
    </PageContainer>
  )
}

export default Questions
