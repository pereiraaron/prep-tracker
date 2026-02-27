import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { DifficultyBreakdown } from '@api/stats'
import Card from '@components/Card'

interface DifficultyPieChartProps {
  data: DifficultyBreakdown[]
}

const COLORS: Record<string, string> = {
  easy: '#22C55E',
  medium: '#EAB308',
  hard: '#EF4444',
}

const DifficultyPieChart = ({ data }: DifficultyPieChartProps) => {
  const chartData = data
    .filter((d) => d.total > 0)
    .map((d) => ({
      name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
      value: d.total,
      color: COLORS[d.difficulty] || '#9CA3AF',
    }))

  if (chartData.length === 0) return null

  const renderLabel = (props: { name?: string; value?: number }) =>
    `${props.name || ''}: ${props.value || 0}`

  return (
    <Card>
      <p className="text-sm font-semibold mb-4">
        By Difficulty
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            label={renderLabel}
            fontSize={11}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default DifficultyPieChart
