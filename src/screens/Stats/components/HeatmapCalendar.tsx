import { Box, Flex, Text } from '@chakra-ui/react'
import Card from '@components/Card'

interface HeatmapCalendarProps {
  data: Record<string, number>
  year?: number
}

const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getColor = (count: number): string => {
  if (count === 0) return 'var(--chakra-colors-bg-muted, #2d2d2d)'
  if (count <= 2) return '#c4b5fd'
  if (count <= 5) return '#8b5cf6'
  return '#6d28d9'
}

const HeatmapCalendar = ({ data, year }: HeatmapCalendarProps) => {
  const currentYear = year || new Date().getFullYear()

  // Build weeks grid
  const startDate = new Date(currentYear, 0, 1)
  const startDay = startDate.getDay() // 0=Sun
  // Adjust to start on Monday
  const offset = startDay === 0 ? 6 : startDay - 1

  const weeks: { date: string; count: number }[][] = []
  let currentWeek: { date: string; count: number }[] = []

  // Fill empty cells for the first partial week
  for (let i = 0; i < offset; i++) {
    currentWeek.push({ date: '', count: -1 })
  }

  const endDate = new Date(currentYear, 11, 31)
  const d = new Date(startDate)

  while (d <= endDate) {
    const dateStr = d.toISOString().split('T')[0]
    currentWeek.push({ date: dateStr, count: data[dateStr] || 0 })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    d.setDate(d.getDate() + 1)
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1 })
    }
    weeks.push(currentWeek)
  }

  // Month labels
  const monthPositions: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, col) => {
    for (const cell of week) {
      if (cell.date) {
        const month = new Date(cell.date).getMonth()
        if (month !== lastMonth) {
          monthPositions.push({ label: MONTHS[month], col })
          lastMonth = month
        }
        break
      }
    }
  })

  return (
    <Card>
      <Text fontSize="sm" fontWeight="semibold" mb={4}>
        Activity Heatmap — {currentYear}
      </Text>
      <Box overflowX="auto" pb={2}>
        <Flex gap={0}>
          {/* Day labels */}
          <Flex direction="column" gap="2px" mr={2} pt="18px">
            {DAYS.map((day, i) => (
              <Text key={i} fontSize="10px" color="fg.muted" h="12px" lineHeight="12px">
                {day}
              </Text>
            ))}
          </Flex>

          {/* Grid */}
          <Box>
            {/* Month labels */}
            <Flex gap="2px" mb={1} h="14px">
              {weeks.map((_, col) => {
                const mp = monthPositions.find((m) => m.col === col)
                return (
                  <Box key={col} w="12px" flexShrink={0}>
                    {mp && (
                      <Text fontSize="10px" color="fg.muted" lineHeight="14px">
                        {mp.label}
                      </Text>
                    )}
                  </Box>
                )
              })}
            </Flex>

            {/* Cells */}
            <Flex gap="2px">
              {weeks.map((week, col) => (
                <Flex key={col} direction="column" gap="2px">
                  {week.map((cell, row) => (
                    <Box
                      key={`${col}-${row}`}
                      w="12px"
                      h="12px"
                      borderRadius="2px"
                      bg={cell.count < 0 ? 'transparent' : getColor(cell.count)}
                      title={cell.date ? `${cell.date}: ${cell.count} solved` : ''}
                    />
                  ))}
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* Legend */}
        <Flex align="center" gap={1} mt={3} justify="flex-end">
          <Text fontSize="10px" color="fg.muted">Less</Text>
          {[0, 1, 3, 6].map((count) => (
            <Box
              key={count}
              w="12px"
              h="12px"
              borderRadius="2px"
              bg={getColor(count)}
            />
          ))}
          <Text fontSize="10px" color="fg.muted">More</Text>
        </Flex>
      </Box>
    </Card>
  )
}

export default HeatmapCalendar
