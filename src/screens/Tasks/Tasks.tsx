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
} from '@chakra-ui/react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '@store/useTaskStore'
import { PREP_CATEGORIES, TASK_STATUSES, CATEGORY_LABEL, CATEGORY_COLOR } from '@api/types'
import type { PrepCategory, TaskStatus } from '@api/tasks'

const Tasks = () => {
  const navigate = useNavigate()
  const { tasks, pagination, fetchTasks, deleteTask, isLoading } = useTaskStore()

  const [category, setCategory] = useState<PrepCategory | ''>('')
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [recurring, setRecurring] = useState<string>('')

  useEffect(() => {
    fetchTasks({
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(recurring ? { isRecurring: recurring === 'yes' } : {}),
    })
  }, [category, status, recurring, fetchTasks])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteTask(id)
  }

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>All Tasks</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => navigate('/tasks/new')}>
          <LuPlus /> New Task
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={2} mb={{ base: 4, md: 6 }} wrap="wrap" direction={{ base: 'column', sm: 'row' }}>
        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field value={category} onChange={(e) => setCategory(e.target.value as PrepCategory | '')}>
            <option value="">All Categories</option>
            {PREP_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | '')}>
            <option value="">All Statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field value={recurring} onChange={(e) => setRecurring(e.target.value)}>
            <option value="">All Types</option>
            <option value="yes">Recurring</option>
            <option value="no">One-time</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      {/* Loading */}
      {isLoading && tasks.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty */}
      {!isLoading && tasks.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {category || status || recurring ? 'No tasks match the selected filters' : 'No tasks yet'}
          </Text>
          {category || status || recurring ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCategory('')
                setStatus('')
                setRecurring('')
              }}
            >
              Clear filters
            </Button>
          ) : (
            <Button colorPalette="blue" onClick={() => navigate('/tasks/new')}>
              <LuPlus /> Create your first task
            </Button>
          )}
        </VStack>
      )}

      {/* Task list */}
      <VStack gap={2} align="stretch">
        {tasks.map((task) => (
          <Flex
            key={task._id}
            align="center"
            gap={{ base: 2, md: 3 }}
            p={{ base: 2, md: 3 }}
            borderWidth="1px"
            borderRadius="md"
            _hover={{ bg: 'bg.subtle' }}
            cursor="pointer"
            onClick={() => navigate(`/tasks/${task._id}`)}
          >
            <Box flex="1" minW={0}>
              <Text fontSize="sm" fontWeight="medium">{task.name}</Text>
              <Flex gap={2} mt={1} wrap="wrap" align="center">
                <Badge size="sm" colorPalette={CATEGORY_COLOR[task.category] || 'gray'}>
                  {CATEGORY_LABEL[task.category] || task.category}
                </Badge>
                <Text fontSize="xs" color="fg.muted">
                  {task.targetQuestionCount} question{task.targetQuestionCount !== 1 ? 's' : ''}/day
                </Text>
                {task.isRecurring && task.recurrence && (
                  <Badge size="sm" variant="outline" display={{ base: 'none', sm: 'inline-flex' }}>
                    {task.recurrence.frequency}
                  </Badge>
                )}
              </Flex>
            </Box>

            <Badge
              size="sm"
              variant="outline"
              colorPalette={task.status === 'active' ? 'green' : 'gray'}
            >
              {task.status}
            </Badge>

            <Button
              variant="ghost"
              size="xs"
              colorPalette="red"
              onClick={(e) => handleDelete(task._id, e)}
            >
              <LuTrash2 />
            </Button>
          </Flex>
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
    </PageContainer>
  )
}

export default Tasks
