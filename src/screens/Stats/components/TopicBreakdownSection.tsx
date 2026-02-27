import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, GridItem, Heading, NativeSelect, Spinner, Text, VStack } from '@chakra-ui/react'
import { statsApi, type TopicBreakdown } from '@api/stats'
import { PREP_CATEGORIES } from '@api/types'
import type { PrepCategory } from '@api/types'
import Card from '@components/Card'
import ProgressBar from '@components/ProgressBar'

const TopicBreakdownSection = () => {
  const [category, setCategory] = useState('')
  const [topics, setTopics] = useState<TopicBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTopics = useCallback(async () => {
    setLoading(true)
    try {
      const data = await statsApi.getTopicBreakdown(
        category ? (category as PrepCategory) : undefined,
      )
      setTopics(data)
    } catch {
      setTopics([])
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  return (
    <GridItem>
      <Flex justify="space-between" align="center" mb={3} gap={2}>
        <Heading size="sm">Topic Breakdown</Heading>
        <NativeSelect.Root size="sm" w="auto">
          <NativeSelect.Field
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {PREP_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>
      <Card>
        {loading ? (
          <Flex justify="center" py={4}>
            <Spinner size="sm" />
          </Flex>
        ) : topics.length === 0 ? (
          <Text fontSize="sm" color="fg.muted">
            No topic data available
          </Text>
        ) : (
          <VStack gap={5} align="stretch">
            {topics.map((t) => (
              <Box key={t.topic}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    {t.topic}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    {t.solved}/{t.total}
                  </Text>
                </Flex>
                <ProgressBar value={t.completionRate} color="purple" />
              </Box>
            ))}
          </VStack>
        )}
      </Card>
    </GridItem>
  )
}

export default TopicBreakdownSection
