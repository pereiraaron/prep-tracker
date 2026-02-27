import Card from '@components/Card'
import ProgressBar from '@components/ProgressBar'

interface BreakdownItem {
  label: string
  solved: number
  total: number
  completionRate: number
  color: string
}

interface BreakdownSectionProps {
  title: string
  items: BreakdownItem[]
}

const BreakdownSection = ({ title, items }: BreakdownSectionProps) => {
  if (items.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <Card>
        <div className="flex flex-col gap-5">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {item.label}
                </span>
                <span className="text-sm text-(--muted-foreground)">
                  {item.solved}/{item.total}
                </span>
              </div>
              <ProgressBar value={item.completionRate} color={item.color} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default BreakdownSection
