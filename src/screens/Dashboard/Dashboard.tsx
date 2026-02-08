import { Box, Heading, Text } from '@chakra-ui/react'

const Dashboard = () => {
  return (
    <Box flex="1" display="flex" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Heading size="xl">Dashboard</Heading>
        <Text color="fg.muted" mt={2}>Welcome to Prep Tracker</Text>
      </Box>
    </Box>
  )
}

export default Dashboard
