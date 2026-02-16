import { Box, Flex, Text } from '@chakra-ui/react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  suffix?: string
}

const StatCard = ({ icon, label, value, color, suffix = '' }: StatCardProps) => (
  <Box
    bg="bg.card"
    borderWidth="1px"
    borderColor="border.card"
    borderRadius="xl"
    p={{ base: 4, md: 5 }}
    textAlign="center"
  >
    <Flex justify="center" mb={2} color={color}>
      {icon}
    </Flex>
    <Text fontWeight="bold" fontSize={{ base: 'xl', md: '2xl' }} color={color}>
      {value}{suffix}
    </Text>
    <Text fontSize="xs" color="fg.muted" mt={1}>
      {label}
    </Text>
  </Box>
)

export default StatCard
