import { Box, Flex, Text, Badge, Checkbox, IconButton } from '@chakra-ui/react'
import { LuExternalLink, LuTrash2 } from 'react-icons/lu'
import type { Question } from '@api/questions'
import { DIFFICULTY_COLOR, CATEGORY_COLOR, CATEGORY_LABEL } from '@api/types'

interface QuestionCardProps {
  question: Question
  isSelected: boolean
  onToggle: () => void
  onDelete: () => void
}

const QuestionCard = ({ question, isSelected, onToggle, onDelete }: QuestionCardProps) => (
  <Flex
    align={{ base: 'flex-start', sm: 'center' }}
    gap={{ base: 2, md: 3 }}
    p={{ base: 3, md: 4 }}
    borderWidth="1px"
    borderColor={isSelected ? 'blue.500/40' : 'border.card'}
    borderRadius="lg"
    bg={isSelected ? 'blue.500/5' : 'bg.card'}
    _hover={{ borderColor: 'blue.500/30' }}
  >
    <Checkbox.Root
      size="sm"
      checked={isSelected}
      onCheckedChange={onToggle}
      mt={{ base: 0.5, sm: 0 }}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
    </Checkbox.Root>

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

      <Flex gap={2} mt={1.5} wrap="wrap" align="center">
        {question.difficulty && (
          <Badge
            size="sm"
            colorPalette={DIFFICULTY_COLOR[question.difficulty] || 'gray'}
          >
            {question.difficulty}
          </Badge>
        )}
        {question.topic && (
          <Badge
            size="sm"
            colorPalette={CATEGORY_COLOR[question.topic] || 'gray'}
          >
            {CATEGORY_LABEL[question.topic as keyof typeof CATEGORY_LABEL] || question.topic}
          </Badge>
        )}
        {question.source && (
          <Text fontSize="xs" color="fg.muted">
            {question.source === 'leetcode' ? 'LeetCode' : question.source === 'greatfrontend' ? 'GreatFrontend' : question.source}
          </Text>
        )}
      </Flex>
    </Box>

    <IconButton
      aria-label="Delete question"
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
)

export default QuestionCard
