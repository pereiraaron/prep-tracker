import { Box } from '@chakra-ui/react'

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <Box maxW="75rem" mx="auto" w="full" px={{ base: 4, md: 6 }} pt={{ base: 6, md: 10 }} pb={{ base: 4, md: 8 }}>
    {children}
  </Box>
)

export default PageContainer
