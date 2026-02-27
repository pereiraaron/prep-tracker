import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from 'recharts'
import { Text } from '@chakra-ui/react'
import type { ProgressDay } from '@api/stats'
import Card from '@components/Card'

interface DailyProgressChartProps {
  data: ProgressDay[]
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const DailyProgressChart = ({ data }: DailyProgressChartProps) => {
  if (data.length === 0) return null

  return (
    <Card>
      <Text fontSize="sm" fontWeight="semibold" mb={4}>
        Daily Progress (Last 30 Days)
      </Text>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            fontSize={11}
            tick={{ fill: 'var(--chakra-colors-fg-muted)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            fontSize={11}
            tick={{ fill: 'var(--chakra-colors-fg-muted)' }}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(val) => formatDate(String(val))}
            contentStyle={{
              background: 'var(--chakra-colors-bg-card)',
              border: '1px solid var(--chakra-colors-border-card)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="solved"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#7c3aed' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default DailyProgressChart
