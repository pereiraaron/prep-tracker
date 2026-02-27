import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts'
import type { CategoryBreakdown } from '@api/stats'
import { CATEGORY_LABEL } from '@api/types'
import Card from '@components/Card'

interface CategoryBarChartProps {
  data: CategoryBreakdown[]
}

const CategoryBarChart = ({ data }: CategoryBarChartProps) => {
  const chartData = data
    .filter((c) => c.total > 0)
    .map((c) => {
      const label = CATEGORY_LABEL[c.category as keyof typeof CATEGORY_LABEL] || c.category
      return {
        name: label.length > 12 ? label.slice(0, 12) + '…' : label,
        solved: c.solved,
        total: c.total,
      }
    })

  if (chartData.length === 0) return null

  return (
    <Card>
      <p className="text-sm font-semibold mb-4">
        By Category
      </p>
      <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 45)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
          <XAxis
            type="number"
            fontSize={10}
            tick={{ fill: 'var(--muted-foreground)' }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            fontSize={11}
            tick={{ fill: 'var(--muted-foreground)' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          />
          <Bar dataKey="solved" fill="#7c3aed" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default CategoryBarChart
