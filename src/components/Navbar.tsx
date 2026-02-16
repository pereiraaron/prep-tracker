import { useState } from 'react'
import { Box, Flex, HStack, VStack, Text, Button, IconButton, Avatar } from '@chakra-ui/react'
import { LuMenu, LuX, LuLogOut } from 'react-icons/lu'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/backlog', label: 'Backlog' },
  { to: '/stats', label: 'Stats' },
  { to: '/settings', label: 'Settings' },
]

const NavLink = ({
  to,
  children,
  onClick,
}: {
  to: string
  children: React.ReactNode
  onClick?: () => void
}) => {
  const { pathname } = useLocation()
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <Link to={to} onClick={onClick}>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color={isActive ? 'brand.fg' : 'fg.muted'}
        bg={isActive ? 'brand.muted' : 'transparent'}
        borderRadius="md"
        px={3}
        py={1.5}
        _hover={{ color: 'brand.fg', bg: 'brand.muted' }}
      >
        {children}
      </Text>
    </Link>
  )
}

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout()
  }

  const displayName = user?.username || user?.email || ''

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex={10}
      bg="bg.card"
      borderBottomWidth="1px"
      borderColor="border.card"
    >
      <Flex
        align="center"
        maxW="75rem"
        mx="auto"
        px={{ base: 4, md: 6 }}
        h={16}
      >
        {/* Logo */}
        <Link to="/" onClick={closeMenu}>
          <HStack gap={2}>
            <Text fontSize="xl">🧠</Text>
            <Text fontWeight="bold" fontSize="lg">
              Prep Tracker
            </Text>
          </HStack>
        </Link>

        <Box flex="1" />

        {/* Desktop nav links — centered */}
        {isAuthenticated && (
          <HStack gap={1} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </HStack>
        )}

        <Box flex="1" />

        {/* Desktop user info + logout */}
        {isAuthenticated && (
          <HStack gap={3} display={{ base: 'none', md: 'flex' }}>
            <HStack gap={2}>
              <Avatar.Root size="sm" colorPalette="purple">
                <Avatar.Fallback name={displayName} />
              </Avatar.Root>
              <Text fontSize="sm" fontWeight="medium">
                {displayName}
              </Text>
            </HStack>
            <Button
              size="sm"
              variant="outline"
              onClick={logout}
            >
              <LuLogOut />
              Logout
            </Button>
          </HStack>
        )}

        {/* Mobile hamburger */}
        {isAuthenticated && (
          <IconButton
            aria-label="Toggle menu"
            variant="ghost"
            size="sm"
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <LuX /> : <LuMenu />}
          </IconButton>
        )}
      </Flex>

      {/* Mobile dropdown menu */}
      {isAuthenticated && menuOpen && (
        <Box
          display={{ base: 'block', md: 'none' }}
          borderTopWidth="1px"
          borderColor="border.card"
          px={4}
          pb={3}
        >
          <VStack align="stretch" gap={1} py={2}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={closeMenu}>
                {item.label}
              </NavLink>
            ))}
          </VStack>

          <Box borderTopWidth="1px" borderColor="border.card" pt={3}>
            <Flex align="center" justify="space-between">
              <HStack gap={2}>
                <Avatar.Root size="sm" colorPalette="purple">
                  <Avatar.Fallback name={displayName} />
                </Avatar.Root>
                <Text fontSize="sm" fontWeight="medium">
                  {displayName}
                </Text>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
              >
                <LuLogOut />
                Logout
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Navbar
