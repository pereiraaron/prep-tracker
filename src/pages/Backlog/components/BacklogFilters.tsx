import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import type { QuestionStatus } from '@api/questions'

const STATUS_OPTIONS: { value: QuestionStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'solved', label: 'Solved' },
]

interface BacklogFiltersProps {
  category: string
  difficulty: string
  status: string
  source: string
  onCategoryChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSourceChange: (value: string) => void
  showMobile: boolean
}

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  options: readonly { value: string; label: string }[]
  fullWidth?: boolean
}

const FilterSelect = ({ value, onChange, label, placeholder, options, fullWidth }: FilterSelectProps) => (
  <div className={fullWidth ? 'w-full' : ''}>
    <p className="text-xs font-medium text-(--muted-foreground) mb-1 block md:hidden">
      {label}
    </p>
    <select
      className="select-base"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
)

const BacklogFilters = ({
  category,
  difficulty,
  status,
  source,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
  onSourceChange,
  showMobile,
}: BacklogFiltersProps) => {
  const filters = [
    { value: category, onChange: onCategoryChange, label: 'Category', placeholder: 'All Categories', options: PREP_CATEGORIES },
    { value: difficulty, onChange: onDifficultyChange, label: 'Difficulty', placeholder: 'All Difficulties', options: DIFFICULTIES },
    { value: status, onChange: onStatusChange, label: 'Status', placeholder: 'All Statuses', options: STATUS_OPTIONS },
    { value: source, onChange: onSourceChange, label: 'Source', placeholder: 'All Sources', options: QUESTION_SOURCES },
  ] as const

  return (
    <div className="mb-4 md:mb-6">
      {/* Desktop filters */}
      <div className="hidden md:flex gap-2">
        {filters.map((f) => (
          <FilterSelect
            key={f.placeholder}
            value={f.value}
            onChange={f.onChange}
            label={f.label}
            placeholder={f.placeholder}
            options={f.options}
          />
        ))}
      </div>

      {/* Mobile filters (controlled by parent) */}
      {showMobile && (
        <div className="block md:hidden glass-card rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3">
            {filters.map((f) => (
              <FilterSelect
                key={f.placeholder}
                value={f.value}
                onChange={f.onChange}
                label={f.label}
                placeholder={f.placeholder}
                options={f.options}
                fullWidth
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BacklogFilters
