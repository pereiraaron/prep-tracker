import type { SourceBreakdown } from '@api/stats'
import { SOURCE_LABEL, SOURCE_COLOR } from '@api/types'
import Card from '@components/Card'
import ProgressBar from '@components/ProgressBar'

interface SourceBreakdownSectionProps {
  data: SourceBreakdown[]
}

const SourceBreakdownSection = ({ data }: SourceBreakdownSectionProps) => {
  if (data.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">
        Source Breakdown
      </h3>
      <Card>
        <div className="flex flex-col gap-5">
          {data.map((item) => (
            <div key={item.source}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {SOURCE_LABEL[item.source] || item.source}
                </span>
                <span className="text-sm text-(--muted-foreground)">
                  {item.solved}/{item.total}
                </span>
              </div>
              <ProgressBar
                value={item.completionRate}
                color={SOURCE_COLOR[item.source] || 'gray'}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SourceBreakdownSection
