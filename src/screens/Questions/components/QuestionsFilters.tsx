import { Flex, Box, Grid, NativeSelect, Text } from '@chakra-ui/react'
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES, QUESTION_STATUSES } from '@api/types'

interface QuestionsFiltersProps {
  category: string
  status: string
  difficulty: string
  source: string
  starred: string
  sort: string
  onCategoryChange: (v: string) => void
  onStatusChange: (v: string) => void
  onDifficultyChange: (v: string) => void
  onSourceChange: (v: string) => void
  onStarredChange: (v: string) => void
  onSortChange: (v: string) => void
  showMobile: boolean
}

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: '-solvedAt', label: 'Recently Solved' },
  { value: '-updatedAt', label: 'Recently Updated' },
] as const

const STARRED_OPTIONS = [
  { value: 'true', label: 'Starred Only' },
] as const

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  options: readonly { value: string; label: string }[]
  fullWidth?: boolean
}

const FilterSelect = ({ value, onChange, label, placeholder, options, fullWidth }: FilterSelectProps) => (
  <Box w={fullWidth ? 'full' : 'auto'}>
    <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={1} display={{ base: 'block', md: 'none' }}>
      {label}
    </Text>
    <NativeSelect.Root size="sm" w="full">
      <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  </Box>
)

const QuestionsFilters = ({
  category, status, difficulty, source, starred, sort,
  onCategoryChange, onStatusChange, onDifficultyChange, onSourceChange, onStarredChange, onSortChange,
  showMobile,
}: QuestionsFiltersProps) => {
  const filters = [
    { value: category, onChange: onCategoryChange, label: 'Category', placeholder: 'All Categories', options: PREP_CATEGORIES },
    { value: status, onChange: onStatusChange, label: 'Status', placeholder: 'All Statuses', options: QUESTION_STATUSES },
    { value: difficulty, onChange: onDifficultyChange, label: 'Difficulty', placeholder: 'All Difficulties', options: DIFFICULTIES },
    { value: source, onChange: onSourceChange, label: 'Source', placeholder: 'All Sources', options: QUESTION_SOURCES },
    { value: starred, onChange: onStarredChange, label: 'Starred', placeholder: 'All Questions', options: STARRED_OPTIONS },
    { value: sort, onChange: onSortChange, label: 'Sort', placeholder: 'Sort by', options: SORT_OPTIONS },
  ] as const

  return (
    <Box mb={{ base: 4, md: 6 }}>
      <Flex gap={2} display={{ base: 'none', md: 'flex' }}>
        {filters.map((f) => (
          <FilterSelect
            key={f.placeholder}
            value={f.value}
            onChange={f.onChange}
            label={f.label}
            placeholder={f.placeholder}
            options={f.options}
          />
        ))}
      </Flex>

      {showMobile && (
        <Box
          display={{ base: 'block', md: 'none' }}
          bg="bg.card"
          borderWidth="1px"
          borderColor="border.card"
          borderRadius="lg"
          p={3}
        >
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            {filters.map((f) => (
              <FilterSelect
                key={f.placeholder}
                value={f.value}
                onChange={f.onChange}
                label={f.label}
                placeholder={f.placeholder}
                options={f.options}
                fullWidth
              />
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default QuestionsFilters
