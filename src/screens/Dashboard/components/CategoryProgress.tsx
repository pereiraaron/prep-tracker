import { Box, Flex, Text, Badge, Circle } from '@chakra-ui/react'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@api/types'
import ProgressBar from '@components/ProgressBar'

interface CategoryProgressProps {
  category: string
  solved: number
  total: number
  status: string
  onClick?: () => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'green' },
  in_progress: { label: 'In Progress', color: 'yellow' },
  incomplete: { label: 'Incomplete', color: 'orange' },
  pending: { label: 'Pending', color: 'gray' },
}

const CategoryProgress = ({ category, solved, total, status, onClick }: CategoryProgressProps) => {
  const categoryColor = CATEGORY_COLOR[category] || 'gray'
  const progress = total > 0 ? Math.round((solved / total) * 100) : 0
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <Flex
      bg="bg.card"
      borderWidth="1px"
      borderColor="border.card"
      borderRadius="lg"
      borderLeftWidth="4px"
      borderLeftColor={`${categoryColor}.500`}
      p={{ base: 3, md: 4 }}
      align="center"
      gap={{ base: 3, md: 4 }}
      cursor={onClick ? 'pointer' : undefined}
      _hover={onClick ? { borderColor: `${categoryColor}.500/40` } : undefined}
      onClick={onClick}
    >
      <Box flex="1" minW={0}>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          {CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] || category}
        </Text>
        <ProgressBar value={progress} color={categoryColor} size="sm" />
        <Text fontSize="xs" color="fg.muted" mt={1.5}>
          {solved}/{total} questions
        </Text>
      </Box>

      <Badge
        size="sm"
        variant="outline"
        colorPalette={statusInfo.color}
        display="flex"
        alignItems="center"
        gap={1.5}
        flexShrink={0}
      >
        <Circle size="6px" bg={`${statusInfo.color}.500`} />
        {statusInfo.label}
      </Badge>
    </Flex>
  )
}

export default CategoryProgress
