import { Box, Flex, Heading, Text, VStack, GridItem } from '@chakra-ui/react'
import Card from './Card'
import ProgressBar from '@components/ProgressBar'

interface BreakdownItem {
  label: string
  solved: number
  total: number
  completionRate: number
  color: string
}

interface BreakdownSectionProps {
  title: string
  items: BreakdownItem[]
}

const BreakdownSection = ({ title, items }: BreakdownSectionProps) => {
  if (items.length === 0) return null

  return (
    <GridItem>
      <Heading size="sm" mb={3}>{title}</Heading>
      <Card>
        <VStack gap={5} align="stretch">
          {items.map((item) => (
            <Box key={item.label}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  {item.label}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {item.solved}/{item.total}
                </Text>
              </Flex>
              <ProgressBar value={item.completionRate} color={item.color} />
            </Box>
          ))}
        </VStack>
      </Card>
    </GridItem>
  )
}

export default BreakdownSection
