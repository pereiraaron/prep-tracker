import { useRef, useState } from 'react'
import { Box, Flex, HStack, VStack, Text, Button, IconButton, Avatar } from '@chakra-ui/react'
import { LuMenu, LuX, LuLogOut, LuSettings } from 'react-icons/lu'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/questions', label: 'Questions' },
  { to: '/backlog', label: 'Backlog' },
  { to: '/stats', label: 'Stats' },
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
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    closeMenu()
    setAvatarMenuOpen(false)
    logout()
  }

  const displayName = user?.username || user?.email || ''
  const displayEmail = user?.email || ''

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

        {/* Desktop nav links */}
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

        {/* Desktop avatar menu */}
        {isAuthenticated && (
          <Box position="relative" display={{ base: 'none', md: 'block' }} ref={avatarMenuRef}>
            <Box
              cursor="pointer"
              onClick={() => setAvatarMenuOpen((v) => !v)}
            >
              <Avatar.Root size="sm" colorPalette="purple">
                <Avatar.Fallback name={displayName} />
              </Avatar.Root>
            </Box>

            {avatarMenuOpen && (
              <>
                <Box
                  position="fixed"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  onClick={() => setAvatarMenuOpen(false)}
                  zIndex={10}
                />
                <Box
                  position="absolute"
                  top="100%"
                  right={0}
                  mt={2}
                  bg="bg.card"
                  borderWidth="1px"
                  borderColor="border.card"
                  borderRadius="lg"
                  boxShadow="lg"
                  minW="200px"
                  zIndex={11}
                  py={1}
                >
                  <Box px={3} py={2} borderBottomWidth="1px" borderColor="border.card">
                    <Text fontSize="sm" fontWeight="medium">
                      {displayName}
                    </Text>
                    {displayEmail && displayEmail !== displayName && (
                      <Text fontSize="xs" color="fg.muted">
                        {displayEmail}
                      </Text>
                    )}
                  </Box>
                  <Box px={1} py={1}>
                    <Button
                      variant="ghost"
                      size="sm"
                      w="full"
                      justifyContent="flex-start"
                      onClick={() => {
                        setAvatarMenuOpen(false)
                        navigate('/settings')
                      }}
                    >
                      <LuSettings />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      w="full"
                      justifyContent="flex-start"
                      colorPalette="red"
                      onClick={handleLogout}
                    >
                      <LuLogOut />
                      Logout
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
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
            <Flex align="center" gap={2} mb={3}>
              <Avatar.Root size="sm" colorPalette="purple">
                <Avatar.Fallback name={displayName} />
              </Avatar.Root>
              <Box>
                <Text fontSize="sm" fontWeight="medium">
                  {displayName}
                </Text>
                {displayEmail && displayEmail !== displayName && (
                  <Text fontSize="xs" color="fg.muted">
                    {displayEmail}
                  </Text>
                )}
              </Box>
            </Flex>
            <Flex gap={2}>
              <Button
                size="sm"
                variant="outline"
                flex="1"
                onClick={() => {
                  closeMenu()
                  navigate('/settings')
                }}
              >
                <LuSettings />
                Settings
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                flex="1"
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
