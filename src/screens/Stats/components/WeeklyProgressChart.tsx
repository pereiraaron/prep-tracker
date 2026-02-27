import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts'
import { Text } from '@chakra-ui/react'
import type { WeeklyProgress } from '@api/stats'
import Card from '@components/Card'

interface WeeklyProgressChartProps {
  data: WeeklyProgress[]
}

const formatWeek = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const WeeklyProgressChart = ({ data }: WeeklyProgressChartProps) => {
  if (data.length === 0) return null

  return (
    <Card>
      <Text fontSize="sm" fontWeight="semibold" mb={4}>
        Weekly Progress (Last 12 Weeks)
      </Text>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="startDate"
            tickFormatter={formatWeek}
            fontSize={11}
            tick={{ fill: 'var(--chakra-colors-fg-muted)' }}
          />
          <YAxis
            fontSize={11}
            tick={{ fill: 'var(--chakra-colors-fg-muted)' }}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(val) => `Week of ${formatWeek(val as string)}`}
            contentStyle={{
              background: 'var(--chakra-colors-bg-card)',
              border: '1px solid var(--chakra-colors-border-card)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          />
          <Bar dataKey="solved" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default WeeklyProgressChart
