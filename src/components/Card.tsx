import { Box, type BoxProps } from '@chakra-ui/react'

const Card = ({ children, ...props }: BoxProps) => (
  <Box
    bg="bg.card"
    borderWidth="1px"
    borderColor="border.card"
    borderRadius="xl"
    p={{ base: 4, md: 5 }}
    {...props}
  >
    {children}
  </Box>
)

export default Card
