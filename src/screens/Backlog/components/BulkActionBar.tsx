import { Flex, Text, Button, NativeSelect, Box } from '@chakra-ui/react'
import { LuArrowRight } from 'react-icons/lu'
import type { TaskInstance } from '@api/tasks'

interface BulkActionBarProps {
  selectedCount: number
  todayInstances: TaskInstance[]
  moveTarget: string
  onMoveTargetChange: (value: string) => void
  onMove: () => void
  moving: boolean
}

const BulkActionBar = ({
  selectedCount,
  todayInstances,
  moveTarget,
  onMoveTargetChange,
  onMove,
  moving,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      bg="bg.card"
      borderTopWidth="1px"
      borderColor="border.card"
      px={{ base: 4, md: 6 }}
      py={3}
    >
      <Flex
        maxW="75rem"
        mx="auto"
        align="center"
        gap={{ base: 2, md: 3 }}
        wrap="wrap"
      >
        <Text fontSize="sm" fontWeight="medium" flexShrink={0}>
          {selectedCount} selected
        </Text>

        <NativeSelect.Root size="sm" flex="1" maxW={{ md: '280px' }}>
          <NativeSelect.Field value={moveTarget} onChange={(e) => onMoveTargetChange(e.target.value)}>
            <option value="">Move to Task...</option>
            {todayInstances.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.taskName} ({inst.category})
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <Button
          size="sm"
          colorPalette="blue"
          disabled={!moveTarget}
          loading={moving}
          onClick={onMove}
          flexShrink={0}
        >
          <LuArrowRight />
          <Box as="span" display={{ base: 'none', sm: 'inline' }}>Move Selected</Box>
          <Box as="span" display={{ base: 'inline', sm: 'none' }}>Move</Box>
        </Button>
      </Flex>
    </Box>
  )
}

export default BulkActionBar
