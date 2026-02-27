import { Box, Flex, GridItem, Heading, Text, VStack } from '@chakra-ui/react'
import type { SourceBreakdown } from '@api/stats'
import { SOURCE_LABEL, SOURCE_COLOR } from '@api/types'
import Card from '@components/Card'
import ProgressBar from '@components/ProgressBar'

interface SourceBreakdownSectionProps {
  data: SourceBreakdown[]
}

const SourceBreakdownSection = ({ data }: SourceBreakdownSectionProps) => {
  if (data.length === 0) return null

  return (
    <GridItem>
      <Heading size="sm" mb={3}>
        Source Breakdown
      </Heading>
      <Card>
        <VStack gap={5} align="stretch">
          {data.map((item) => (
            <Box key={item.source}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {SOURCE_LABEL[item.source] || item.source}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {item.solved}/{item.total}
                </Text>
              </Flex>
              <ProgressBar
                value={item.completionRate}
                color={SOURCE_COLOR[item.source] || 'gray'}
              />
            </Box>
          ))}
        </VStack>
      </Card>
    </GridItem>
  )
}

export default SourceBreakdownSection
