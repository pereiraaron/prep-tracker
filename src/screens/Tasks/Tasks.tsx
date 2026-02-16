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
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import type { PrepCategory, TaskStatus } from '@api/tasks'
import PageContainer from '@components/PageContainer'
import { ErrorState } from '@components/EmptyState'
import TaskFilters from './components/TaskFilters'
import TaskCard from './components/TaskCard'
import { MOCK_TASKS } from './mockData'

const Tasks = () => {
  const navigate = useNavigate()
  const { tasks, pagination, fetchTasks, deleteTask, isLoading, error } = useTaskStore()

  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [recurring, setRecurring] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const fetchWithFilters = () => {
    fetchTasks({
      ...(category ? { category: category as PrepCategory } : {}),
      ...(status ? { status: status as TaskStatus } : {}),
      ...(recurring ? { isRecurring: recurring === 'yes' } : {}),
    }).then(() => setInitialized(true))
  }

  useEffect(() => {
    fetchWithFilters()
  }, [category, status, recurring, fetchTasks])

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
    } catch {
      // Task stays in list, store.error is already set
    }
  }

  const clearFilters = () => {
    setCategory('')
    setStatus('')
    setRecurring('')
  }

  const hasFilters = !!(category || status || recurring)
  const totalCount = pagination?.total ?? tasks.length

  // In dev mode, if error and no tasks loaded, use mock data
  const displayTasks = error && tasks.length === 0 && import.meta.env.DEV ? MOCK_TASKS : tasks

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={2}>
          <Heading size={{ base: 'md', md: 'lg' }}>Tasks</Heading>
          {initialized && !error && (
            <Badge variant="subtle" size="sm" colorPalette="purple">
              {totalCount} Task{totalCount !== 1 ? 's' : ''}
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
            onClick={() => navigate('/tasks/new')}
            display={{ base: 'none', md: 'flex' }}
          >
            <LuPlus /> New Task
          </Button>
        </Flex>
      </Flex>

      {/* Filters */}
      <TaskFilters
        category={category}
        status={status}
        recurring={recurring}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onRecurringChange={setRecurring}
        showMobile={showMobileFilters}
      />

      {/* Loading */}
      {isLoading && tasks.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error state */}
      {!isLoading && error && !import.meta.env.DEV && (
        <ErrorState onRetry={fetchWithFilters} />
      )}

      {/* Empty state */}
      {!isLoading && !error && displayTasks.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {hasFilters ? 'No tasks match the filters' : 'No tasks yet'}
          </Text>
          {hasFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button colorPalette="purple" size="sm" onClick={() => navigate('/tasks/new')}>
              <LuPlus /> Create your first task
            </Button>
          )}
        </VStack>
      )}

      {/* Task list */}
      <VStack gap={3} align="stretch">
        {displayTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => navigate(`/tasks/${task._id}`)}
            onDelete={() => handleDelete(task._id)}
          />
        ))}
      </VStack>

      {/* Pagination info */}
      {pagination && pagination.totalPages > 1 && (
        <Flex justify="center" mt={6}>
          <Text fontSize="sm" color="fg.muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} tasks)
          </Text>
        </Flex>
      )}

      {/* Mobile FAB */}
      <IconButton
        aria-label="New task"
        colorPalette="purple"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        display={{ base: 'flex', md: 'none' }}
        boxShadow="lg"
        onClick={() => navigate('/tasks/new')}
      >
        <LuPlus />
      </IconButton>
    </PageContainer>
  )
}

export default Tasks
