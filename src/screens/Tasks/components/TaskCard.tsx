import { Box, Flex, Text, Badge, IconButton, Circle } from '@chakra-ui/react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import type { Task } from '@api/tasks'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@api/types'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const categoryColor = CATEGORY_COLOR[task.category] || 'gray'

  return (
    <Flex
      align="center"
      gap={{ base: 3, md: 4 }}
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      borderColor="border.card"
      borderRadius="lg"
      borderLeftWidth="4px"
      borderLeftColor={`${categoryColor}.500`}
      bg="bg.card"
      _hover={{ borderColor: `${categoryColor}.500/40` }}
      cursor="pointer"
      onClick={onEdit}
    >
      <Box flex="1" minW={0}>
        <Text fontSize="sm" fontWeight="semibold" lineClamp={1}>
          {task.name}
        </Text>
        <Flex gap={2} mt={1.5} wrap="wrap" align="center">
          <Badge size="sm" colorPalette={categoryColor}>
            {CATEGORY_LABEL[task.category] || task.category}
          </Badge>
          {task.isRecurring && task.recurrence && (
            <Badge size="sm" variant="outline">
              {task.recurrence.frequency.charAt(0).toUpperCase() + task.recurrence.frequency.slice(1)}
            </Badge>
          )}
          {!task.isRecurring && (
            <Badge size="sm" variant="outline">One-time</Badge>
          )}
          <Text fontSize="xs" color="fg.muted">
            {task.targetQuestionCount} question{task.targetQuestionCount !== 1 ? 's' : ''}/day
          </Text>
        </Flex>
      </Box>

      <Badge
        size="sm"
        variant="outline"
        colorPalette={task.status === 'active' ? 'green' : 'gray'}
        display="flex"
        alignItems="center"
        gap={1.5}
        flexShrink={0}
      >
        <Circle size="6px" bg={task.status === 'active' ? 'green.500' : 'gray.400'} />
        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </Badge>

      <Flex gap={1} flexShrink={0}>
        <IconButton
          aria-label="Edit task"
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <LuPencil />
        </IconButton>
        <IconButton
          aria-label="Delete task"
          variant="ghost"
          size="xs"
          colorPalette="red"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <LuTrash2 />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default TaskCard
