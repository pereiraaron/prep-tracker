interface ProgressBarProps {
  value: number
  color: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-2.5',
  lg: 'h-3.5',
}

const ProgressBar = ({ value, color, size = 'sm', className = '' }: ProgressBarProps) => (
  <div className={`w-full rounded-full bg-(--secondary) ${sizeMap[size]} ${className}`}>
    <div
      className="h-full rounded-full transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
    />
  </div>
)

export default ProgressBar
