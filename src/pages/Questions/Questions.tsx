import { useCallback, useEffect, useRef, useState } from 'react'
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
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-bold">Questions</h1>
          {!loading && (
            <span className="inline-flex rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-xs font-medium">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <button
            aria-label="Toggle filters"
            className={`p-1.5 rounded-lg transition-colors md:hidden ${
              hasFilters
                ? 'bg-(--color-primary) text-white'
                : 'border border-(--border) hover:bg-(--secondary)'
            }`}
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            <LuFilter size={16} />
          </button>

          <button
            className="btn-primary text-sm hidden md:inline-flex"
            onClick={() => navigate('/questions/new')}
          >
            <LuPlus /> New Question
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-3 md:mb-4 glass-card rounded-lg px-3 py-1">
        <LuSearch size={16} className="text-(--muted-foreground) shrink-0" />
        <input
          placeholder="Search questions..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 text-sm border-none outline-none bg-transparent text-inherit py-1"
        />
      </div>

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
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
        </div>
      )}

      {/* Error */}
      {!loading && error && <ErrorState onRetry={fetchQuestions} />}

      {/* Empty */}
      {!loading && !error && questions.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-(--muted-foreground) text-lg">
            {hasFilters ? 'No questions match your filters' : 'No questions yet'}
          </p>
          {hasFilters ? (
            <button className="btn-outline text-sm" onClick={clearFilters}>
              Clear filters
            </button>
          ) : (
            <button
              className="btn-primary text-sm"
              onClick={() => navigate('/questions/new')}
            >
              Add your first question
            </button>
          )}
        </div>
      )}

      {/* Question list */}
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <QuestionListCard
            key={q.id}
            question={q}
            onStar={() => handleStar(q.id)}
            onDelete={() => handleDelete(q.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Mobile FAB */}
      <button
        aria-label="Add question"
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full bg-(--color-primary) text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        onClick={() => navigate('/questions/new')}
      >
        <LuPlus size={20} />
      </button>
    </PageContainer>
  )
}

export default Questions
