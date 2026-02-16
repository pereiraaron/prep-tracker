import { Box, Flex, Heading, Text, Avatar } from '@chakra-ui/react'
import { LuMail, LuUser } from 'react-icons/lu'
import { useAuthStore } from '@store/useAuthStore'

const ProfileSection = () => {
  const { user } = useAuthStore()

  if (!user) return null

  const displayName = user.username || user.email
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Box>
      <Heading size="sm" mb={3}>Profile</Heading>
      <Box
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'center', sm: 'center' }}
          gap={4}
          textAlign={{ base: 'center', sm: 'left' }}
        >
          <Avatar.Root size="xl" colorPalette="purple">
            <Avatar.Fallback name={displayName}>{initials}</Avatar.Fallback>
          </Avatar.Root>

          <Box flex="1" minW={0}>
            <Text fontWeight="semibold" fontSize="lg">
              {user.username || 'User'}
            </Text>

            <Flex align="center" gap={1.5} mt={1} color="fg.muted" justify={{ base: 'center', sm: 'flex-start' }}>
              <LuMail size={14} />
              <Text fontSize="sm">{user.email}</Text>
            </Flex>

            <Flex align="center" gap={1.5} mt={1} color="fg.muted" justify={{ base: 'center', sm: 'flex-start' }}>
              <LuUser size={14} />
              <Text fontSize="sm" textTransform="capitalize">{user.role}</Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default ProfileSection
