import Card from '@components/Card'

interface HeatmapCalendarProps {
  data: Record<string, number>
  year?: number
}

const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getColor = (count: number): string => {
  if (count === 0) return 'var(--muted)'
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
      <p className="text-sm font-semibold mb-4">
        Activity Heatmap — {currentYear}
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-2 pt-4.5">
            {DAYS.map((day, i) => (
              <span
                key={i}
                className="text-[10px] text-(--muted-foreground) h-3 leading-3"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="flex gap-0.5 mb-1 h-3.5">
              {weeks.map((_, col) => {
                const mp = monthPositions.find((m) => m.col === col)
                return (
                  <div key={col} className="w-3 shrink-0">
                    {mp && (
                      <span className="text-[10px] text-(--muted-foreground) leading-3.5">
                        {mp.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Cells */}
            <div className="flex gap-0.5">
              {weeks.map((week, col) => (
                <div key={col} className="flex flex-col gap-0.5">
                  {week.map((cell, row) => (
                    <div
                      key={`${col}-${row}`}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: cell.count < 0 ? 'transparent' : getColor(cell.count),
                      }}
                      title={cell.date ? `${cell.date}: ${cell.count} solved` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 justify-end">
          <span className="text-[10px] text-(--muted-foreground)">Less</span>
          {[0, 1, 3, 6].map((count) => (
            <div
              key={count}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(count) }}
            />
          ))}
          <span className="text-[10px] text-(--muted-foreground)">More</span>
        </div>
      </div>
    </Card>
  )
}

export default HeatmapCalendar
