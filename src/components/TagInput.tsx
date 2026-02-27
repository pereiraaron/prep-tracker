import { useState, useRef } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  max?: number
}

const TagInput = ({ label, value, onChange, placeholder = 'Type and press Enter', max = 20 }: TagInputProps) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (!trimmed || value.includes(trimmed) || value.length >= max) return
    onChange([...value, trimmed])
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
      setInput('')
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={1.5}>
        {label}
      </Text>
      <Flex
        wrap="wrap"
        gap={1.5}
        p={2}
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="md"
        minH="40px"
        alignItems="center"
        cursor="text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="subtle"
            colorPalette="purple"
            size="sm"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
          >
            {tag}
            <Box as="span" ml={1} display="inline-flex">
              <LuX size={10} />
            </Box>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            flex: 1,
            minWidth: '80px',
            fontSize: '0.875rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
          }}
        />
      </Flex>
    </Box>
  )
}

export default TagInput
