import { LuRefreshCw } from 'react-icons/lu'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    {icon && <p className="text-3xl">{icon}</p>}
    <p className="text-(--muted-foreground) text-lg">{title}</p>
    {description && (
      <p className="text-(--muted-foreground) text-sm max-w-sm">{description}</p>
    )}
    {action && (
      <button className="btn-outline text-sm" onClick={action.onClick}>
        {action.label}
      </button>
    )}
  </div>
)

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center gap-3 py-16 text-center">
    <p className="text-(--muted-foreground) text-lg">{message}</p>
    <p className="text-(--muted-foreground) text-sm">
      Please check your connection and try again.
    </p>
    {onRetry && (
      <button className="btn-outline text-sm" onClick={onRetry}>
        <LuRefreshCw /> Retry
      </button>
    )}
  </div>
)

export default EmptyState
