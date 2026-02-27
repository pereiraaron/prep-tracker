import { useState } from "react";
import { Box, Flex, Text, Badge, IconButton, NativeSelect, HStack } from "@chakra-ui/react";
import { LuExternalLink, LuTrash2, LuStar, LuCircleCheck } from "react-icons/lu";
import type { Question } from "@api/questions";
import { DIFFICULTY_COLOR, PREP_CATEGORIES } from "@api/types";
import type { PrepCategory } from "@api/types";

interface QuestionCardProps {
  question: Question;
  onDelete: () => void;
  onStar: () => void;
  onSolve: (category: PrepCategory) => void;
}

const QuestionCard = ({ question, onDelete, onStar, onSolve }: QuestionCardProps) => {
  const [showSolve, setShowSolve] = useState(false);

  return (
    <Flex
      align={{ base: "flex-start", sm: "center" }}
      gap={{ base: 2, md: 3 }}
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      borderColor="border.card"
      borderRadius="lg"
      bg="bg.card"
      _hover={{ borderColor: "purple.500/30" }}
    >
      {/* Star */}
      <IconButton
        aria-label={question.starred ? "Unstar" : "Star"}
        variant="ghost"
        size="xs"
        color={question.starred ? "yellow.500" : "fg.muted"}
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
        flexShrink={0}
      >
        <LuStar fill={question.starred ? "currentColor" : "none"} />
      </IconButton>

      {/* Content */}
      <Box flex="1" minW={0}>
        <Flex align="center" gap={1.5}>
          <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
            {question.title}
          </Text>
          {question.url && (
            <a href={question.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Box color="blue.500" flexShrink={0}>
                <LuExternalLink size={14} />
              </Box>
            </a>
          )}
        </Flex>

        <Flex gap={2} mt={1.5} wrap="wrap" align="center">
          {question.difficulty && (
            <Badge size="sm" colorPalette={DIFFICULTY_COLOR[question.difficulty] || "gray"}>
              {question.difficulty}
            </Badge>
          )}
          {question.topic && (
            <Badge size="sm" variant="outline">
              {question.topic}
            </Badge>
          )}
          {question.source && (
            <Text fontSize="xs" color="fg.muted">
              {question.source}
            </Text>
          )}
        </Flex>

        {/* Inline solve picker */}
        {showSolve && (
          <HStack gap={2} mt={2}>
            <NativeSelect.Root size="sm" flex="1">
              <NativeSelect.Field
                id={`solve-category-${question.id}`}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    onSolve(e.target.value as PrepCategory);
                    setShowSolve(false);
                  }
                }}
              >
                <option value="">Pick a category...</option>
                {PREP_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <IconButton
              aria-label="Cancel"
              variant="ghost"
              size="xs"
              onClick={() => setShowSolve(false)}
            >
              ✕
            </IconButton>
          </HStack>
        )}
      </Box>

      {/* Actions */}
      <HStack gap={0} flexShrink={0}>
        <IconButton
          aria-label="Solve"
          variant="ghost"
          size="xs"
          colorPalette="green"
          onClick={(e) => {
            e.stopPropagation();
            setShowSolve((v) => !v);
          }}
        >
          <LuCircleCheck />
        </IconButton>
        <IconButton
          aria-label="Delete question"
          variant="ghost"
          size="xs"
          colorPalette="red"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 />
        </IconButton>
      </HStack>
    </Flex>
  );
};

export default QuestionCard;
