import { Box, Flex, Text, Badge, IconButton, HStack } from '@chakra-ui/react'
import {
  LuStar,
  LuCircleCheck,
  LuRotateCcw,
  LuPencil,
  LuTrash2,
  LuExternalLink,
} from 'react-icons/lu'
import type { Question } from '@api/questions'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  DIFFICULTY_COLOR,
  SOURCE_LABEL,
  STATUS_COLOR,
} from '@api/types'

interface QuestionListCardProps {
  question: Question
  onStar: () => void
  onSolve: () => void
  onReset: () => void
  onEdit: () => void
  onDelete: () => void
}

const QuestionListCard = ({
  question,
  onStar,
  onSolve,
  onReset,
  onEdit,
  onDelete,
}: QuestionListCardProps) => (
  <Flex
    gap={{ base: 2, md: 3 }}
    p={{ base: 3, md: 4 }}
    borderWidth="1px"
    borderColor="border.card"
    borderRadius="lg"
    bg="bg.card"
    borderLeftWidth="3px"
    borderLeftColor={
      question.category
        ? `${CATEGORY_COLOR[question.category]}.500`
        : 'gray.400'
    }
    _hover={{ borderColor: 'purple.500/30' }}
  >
    {/* Star button */}
    <IconButton
      aria-label={question.starred ? 'Unstar' : 'Star'}
      variant="ghost"
      size="xs"
      color={question.starred ? 'yellow.500' : 'fg.muted'}
      onClick={(e) => {
        e.stopPropagation()
        onStar()
      }}
      mt={0.5}
      flexShrink={0}
    >
      <LuStar fill={question.starred ? 'currentColor' : 'none'} />
    </IconButton>

    {/* Content */}
    <Box flex="1" minW={0}>
      <Flex align="center" gap={1.5}>
        <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
          {question.title}
        </Text>
        {question.url && (
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Box color="blue.500" flexShrink={0}>
              <LuExternalLink size={14} />
            </Box>
          </a>
        )}
      </Flex>

      <Flex gap={1.5} mt={1.5} wrap="wrap" align="center">
        {question.category && (
          <Badge
            size="sm"
            colorPalette={CATEGORY_COLOR[question.category] || 'gray'}
          >
            {CATEGORY_LABEL[question.category] || question.category}
          </Badge>
        )}
        {question.difficulty && (
          <Badge
            size="sm"
            colorPalette={DIFFICULTY_COLOR[question.difficulty] || 'gray'}
          >
            {question.difficulty}
          </Badge>
        )}
        <Badge
          size="sm"
          variant="outline"
          colorPalette={STATUS_COLOR[question.status] || 'gray'}
        >
          {question.status}
        </Badge>
        {question.source && (
          <Text fontSize="xs" color="fg.muted">
            {SOURCE_LABEL[question.source] || question.source}
          </Text>
        )}
        {question.topic && (
          <Badge size="sm" variant="outline">
            {question.topic}
          </Badge>
        )}
      </Flex>

      {(question.tags.length > 0 || question.companyTags.length > 0) && (
        <Flex gap={1} mt={1.5} wrap="wrap">
          {question.companyTags.map((tag) => (
            <Badge key={`c-${tag}`} size="sm" variant="subtle" colorPalette="blue">
              {tag}
            </Badge>
          ))}
          {question.tags.map((tag) => (
            <Badge key={`t-${tag}`} size="sm" variant="subtle">
              {tag}
            </Badge>
          ))}
        </Flex>
      )}

      {question.solvedAt && (
        <Text fontSize="xs" color="fg.muted" mt={1}>
          Solved {new Date(question.solvedAt).toLocaleDateString()}
        </Text>
      )}
    </Box>

    {/* Actions */}
    <HStack gap={0} flexShrink={0}>
      {question.status === 'pending' ? (
        <IconButton
          aria-label="Mark solved"
          variant="ghost"
          size="xs"
          colorPalette="green"
          onClick={(e) => {
            e.stopPropagation()
            onSolve()
          }}
        >
          <LuCircleCheck />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Reset to pending"
          variant="ghost"
          size="xs"
          colorPalette="orange"
          onClick={(e) => {
            e.stopPropagation()
            onReset()
          }}
        >
          <LuRotateCcw />
        </IconButton>
      )}
      <IconButton
        aria-label="Edit"
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
        aria-label="Delete"
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
    </HStack>
  </Flex>
)

export default QuestionListCard
