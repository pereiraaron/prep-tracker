import { Box, Flex, HStack, Text, Button, Spacer } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import Logo from './Logo'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex={10}
      bg="bg"
      borderBottomWidth="1px"
      px={{ base: 4, md: 6 }}
      py={3}
    >
      <Flex align="center" maxW="1200px" mx="auto">
        <Link to="/">
          <HStack gap={2}>
            <Logo />
            <Text fontWeight="bold" fontSize="lg">
              Prep Tracker
            </Text>
          </HStack>
        </Link>

        <Spacer />

        {isAuthenticated && (
          <HStack gap={3}>
            <Text fontSize="sm" color="fg.muted" display={{ base: 'none', md: 'block' }}>
              {user?.username || user?.email}
            </Text>
            <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  )
}

export default Navbar
