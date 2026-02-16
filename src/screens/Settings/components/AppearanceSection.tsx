import { Box, Flex, Heading, Text, IconButton } from '@chakra-ui/react'
import { LuSun, LuMoon } from 'react-icons/lu'
import { useColorMode } from '@hooks/useColorMode'

const AppearanceSection = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box>
      <Heading size="sm" mb={3}>Appearance</Heading>
      <Box
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
      >
        {/* Color Mode */}
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" fontWeight="medium">Color Mode</Text>
            <Text fontSize="xs" color="fg.muted">
              {colorMode === 'light' ? 'Light' : 'Dark'} mode is active
            </Text>
          </Box>
          <Flex
            bg={colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'}
            borderRadius="full"
            p={1}
            gap={1}
          >
            <IconButton
              aria-label="Light mode"
              size="sm"
              borderRadius="full"
              variant={colorMode === 'light' ? 'solid' : 'ghost'}
              colorPalette={colorMode === 'light' ? 'yellow' : undefined}
              onClick={colorMode === 'dark' ? toggleColorMode : undefined}
            >
              <LuSun />
            </IconButton>
            <IconButton
              aria-label="Dark mode"
              size="sm"
              borderRadius="full"
              variant={colorMode === 'dark' ? 'solid' : 'ghost'}
              colorPalette={colorMode === 'dark' ? 'purple' : undefined}
              onClick={colorMode === 'light' ? toggleColorMode : undefined}
            >
              <LuMoon />
            </IconButton>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default AppearanceSection
