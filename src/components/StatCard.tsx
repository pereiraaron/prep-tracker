interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  suffix?: string
}

const StatCard = ({ icon, label, value, color, suffix = '' }: StatCardProps) => (
  <div className="glass-card rounded-xl p-4 md:p-5 relative overflow-hidden">
    <div className="flex justify-between items-start">
      <p className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
        {label}
      </p>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center bg-(--muted) shrink-0"
        style={{ color }}
      >
        {icon}
      </div>
    </div>
    <p className="font-bold text-2xl md:text-3xl mt-2">
      {value}{suffix}
    </p>
  </div>
)

export default StatCard
