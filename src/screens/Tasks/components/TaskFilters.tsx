import { Flex, Box, Grid, NativeSelect, Text } from '@chakra-ui/react'
import { PREP_CATEGORIES, TASK_STATUSES } from '@api/types'

const FREQUENCY_OPTIONS = [
  { value: 'yes', label: 'Recurring' },
  { value: 'no', label: 'One-time' },
] as const

interface TaskFiltersProps {
  category: string
  status: string
  recurring: string
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onRecurringChange: (value: string) => void
  showMobile: boolean
}

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

const TaskFilters = ({
  category,
  status,
  recurring,
  onCategoryChange,
  onStatusChange,
  onRecurringChange,
  showMobile,
}: TaskFiltersProps) => {
  const filters = [
    { value: category, onChange: onCategoryChange, label: 'Category', placeholder: 'All Categories', options: PREP_CATEGORIES },
    { value: status, onChange: onStatusChange, label: 'Status', placeholder: 'All Statuses', options: TASK_STATUSES },
    { value: recurring, onChange: onRecurringChange, label: 'Frequency', placeholder: 'All Types', options: FREQUENCY_OPTIONS },
  ] as const

  return (
    <Box mb={{ base: 4, md: 6 }}>
      {/* Desktop filters */}
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

      {/* Mobile filters */}
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

export default TaskFilters
