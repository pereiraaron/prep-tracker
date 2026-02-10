import { useState } from 'react'
import { Box, Flex, HStack, VStack, Text, Button, IconButton, Spacer } from '@chakra-ui/react'
import { LuMenu, LuX } from 'react-icons/lu'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import Logo from './Logo'

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
        fontWeight={isActive ? 'semibold' : 'normal'}
        color={isActive ? 'fg' : 'fg.muted'}
        _hover={{ color: 'fg' }}
        px={2}
        py={2}
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

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex={10}
      bg="bg"
      borderBottomWidth="1px"
      px={{ base: 3, md: 6 }}
      py={3}
    >
      <Flex align="center" maxW="1200px" mx="auto">
        <Link to="/" onClick={closeMenu}>
          <HStack gap={2}>
            <Logo />
            <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
              Prep Tracker
            </Text>
          </HStack>
        </Link>

        {/* Desktop nav links */}
        {isAuthenticated && (
          <HStack gap={1} ms={6} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Today</NavLink>
            <NavLink to="/entries">Entries</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </HStack>
        )}

        <Spacer />

        {/* Desktop user info + logout */}
        {isAuthenticated && (
          <HStack gap={3} display={{ base: 'none', md: 'flex' }}>
            <Text fontSize="sm" color="fg.muted">
              {user?.username || user?.email}
            </Text>
            <Button variant="ghost" size="sm" onClick={logout}>
              Log Out
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
        <VStack
          align="stretch"
          gap={0}
          pt={3}
          pb={2}
          maxW="1200px"
          mx="auto"
          display={{ base: 'flex', md: 'none' }}
        >
          <NavLink to="/" onClick={closeMenu}>Today</NavLink>
          <NavLink to="/entries" onClick={closeMenu}>Entries</NavLink>
          <NavLink to="/stats" onClick={closeMenu}>Stats</NavLink>
          <NavLink to="/settings" onClick={closeMenu}>Settings</NavLink>
          <Box borderTopWidth="1px" mt={2} pt={2}>
            <Text fontSize="xs" color="fg.muted" px={2} mb={1}>
              {user?.username || user?.email}
            </Text>
            <Button variant="ghost" size="sm" w="full" justifyContent="flex-start" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        </VStack>
      )}
    </Box>
  )
}

export default Navbar
