import { useEffect, useState } from 'react'
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
import { useEntryStore } from '@store/useEntryStore'
import { PREP_CATEGORIES, DIFFICULTIES, STATUSES } from '@api/types'
import { CATEGORY_LABEL } from '@api/types'
import type { EntriesFilter, PrepCategory, Difficulty, EntryStatus } from '@api/entries'

const CATEGORY_COLOR: Record<string, string> = {
  dsa: 'purple',
  system_design: 'blue',
  behavioral: 'green',
  machine_coding: 'orange',
  language_framework: 'teal',
}

const Entries = () => {
  const navigate = useNavigate()
  const { entries, pagination, fetchEntries, deleteEntry, isLoading } = useEntryStore()

  const [category, setCategory] = useState<PrepCategory | ''>('')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [status, setStatus] = useState<EntryStatus | ''>('')

  useEffect(() => {
    const filter: EntriesFilter = {}
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    if (status) filter.status = status
    fetchEntries(filter)
  }, [category, difficulty, status, fetchEntries])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteEntry(id)
  }

  return (
    <Box maxW="900px" mx="auto" w="full" p={{ base: 4, md: 6 }} pt={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Heading size={{ base: 'md', md: 'lg' }}>All Entries</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => navigate('/entries/new')}>
          <LuPlus /> Add Entry
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={2} mb={{ base: 4, md: 6 }} wrap="wrap" direction={{ base: 'column', sm: 'row' }}>
        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field
            value={category}
            onChange={(e) => setCategory(e.target.value as PrepCategory | '')}
          >
            <option value="">All Categories</option>
            {PREP_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root size="sm" w={{ base: 'full', sm: 'auto' }}>
          <NativeSelect.Field
            value={status}
            onChange={(e) => setStatus(e.target.value as EntryStatus | '')}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      {/* Loading */}
      {isLoading && entries.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty */}
      {!isLoading && entries.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {category || difficulty || status
              ? 'No entries match the selected filters'
              : 'No entries yet'}
          </Text>
          {category || difficulty || status ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCategory('')
                setDifficulty('')
                setStatus('')
              }}
            >
              Clear filters
            </Button>
          ) : (
            <Button colorPalette="blue" onClick={() => navigate('/entries/new')}>
              <LuPlus /> Create your first entry
            </Button>
          )}
        </VStack>
      )}

      {/* Entry list */}
      <VStack gap={2} align="stretch">
        {entries.map((entry) => (
          <Flex
            key={entry._id}
            align="center"
            gap={{ base: 2, md: 3 }}
            p={{ base: 2, md: 3 }}
            borderWidth="1px"
            borderRadius="md"
            _hover={{ bg: 'bg.subtle' }}
            cursor="pointer"
            onClick={() => navigate(`/entries/${entry._id}`)}
          >
            <Box flex="1" minW={0}>
              <Text fontSize="sm" fontWeight="medium">
                {entry.title}
              </Text>
              <Flex gap={2} mt={1} wrap="wrap" align="center">
                <Badge size="sm" colorPalette={CATEGORY_COLOR[entry.category] || 'gray'}>
                  {CATEGORY_LABEL[entry.category] || entry.category}
                </Badge>
                {entry.topic && (
                  <Text fontSize="xs" color="fg.muted">{entry.topic}</Text>
                )}
                {entry.source && (
                  <Text fontSize="xs" color="fg.muted" display={{ base: 'none', sm: 'block' }}>via {entry.source}</Text>
                )}
              </Flex>
            </Box>

            {entry.difficulty && (
              <Badge
                size="sm"
                display={{ base: 'none', sm: 'inline-flex' }}
                colorPalette={
                  entry.difficulty === 'easy'
                    ? 'green'
                    : entry.difficulty === 'medium'
                      ? 'yellow'
                      : 'red'
                }
              >
                {entry.difficulty}
              </Badge>
            )}

            <Badge
              size="sm"
              variant="outline"
              colorPalette={
                entry.status === 'completed'
                  ? 'green'
                  : entry.status === 'in_progress'
                    ? 'yellow'
                    : 'gray'
              }
            >
              {entry.status === 'in_progress' ? 'In Progress' : entry.status}
            </Badge>

            <Button
              variant="ghost"
              size="xs"
              colorPalette="red"
              onClick={(e) => handleDelete(entry._id, e)}
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
          </Text>
        </Flex>
      )}
    </Box>
  )
}

export default Entries
