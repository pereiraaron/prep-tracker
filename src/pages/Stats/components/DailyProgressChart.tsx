import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts'
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
      <p className="text-sm font-semibold mb-4">
        Daily Activity (14 days)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            fontSize={11}
            tick={{ fill: 'var(--muted-foreground)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            fontSize={11}
            tick={{ fill: 'var(--muted-foreground)' }}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(val) => formatDate(String(val))}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          />
          <Area
            type="monotone"
            dataKey="solved"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#solvedGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#7c3aed' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default DailyProgressChart
