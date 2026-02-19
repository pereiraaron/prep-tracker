import { Flex, Text, Badge } from '@chakra-ui/react'
import { LuPlus, LuCircleCheck } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import type { DailyTask } from '@api/tasks'
import { INSTANCE_STATUS_COLOR } from '@api/types'

interface DailyTaskCardProps {
  dailyTask: DailyTask
}

const DailyTaskCard = ({ dailyTask }: DailyTaskCardProps) => {
  const navigate = useNavigate()
  const needsQuestions = dailyTask.addedQuestionCount < dailyTask.targetQuestionCount
  const remaining = dailyTask.targetQuestionCount - dailyTask.addedQuestionCount
  const statusColor = INSTANCE_STATUS_COLOR[dailyTask.status] || 'gray'

  return (
    <Flex
      align="center"
      gap={3}
      py={2.5}
      px={{ base: 3, md: 4 }}
      ml={{ base: 3, md: 4 }}
      borderLeftWidth="2px"
      borderColor={`${statusColor}.500/30`}
      cursor="pointer"
      _hover={{ bg: 'bg.subtle' }}
      onClick={() => navigate(`/tasks/daily/${dailyTask.id}/add-questions`)}
      borderRadius="sm"
    >
      <Flex flex="1" direction="column" gap={0.5} minW={0}>
        <Text fontSize="sm" lineClamp={1}>
          {dailyTask.taskName}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {dailyTask.addedQuestionCount}/{dailyTask.targetQuestionCount} questions added
        </Text>
      </Flex>

      {needsQuestions ? (
        <Badge size="sm" colorPalette="purple" variant="subtle" display="flex" alignItems="center" gap={1}>
          <LuPlus size={12} />
          Add {remaining}
        </Badge>
      ) : (
        <Badge size="sm" colorPalette="green" variant="subtle" display="flex" alignItems="center" gap={1}>
          <LuCircleCheck size={12} />
          Added
        </Badge>
      )}
    </Flex>
  )
}

export default DailyTaskCard
