import { VStack, Text, Button } from '@chakra-ui/react'
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
  <VStack gap={3} py={16} textAlign="center">
    {icon && <Text fontSize="3xl">{icon}</Text>}
    <Text color="fg.muted" fontSize="lg">{title}</Text>
    {description && (
      <Text color="fg.muted" fontSize="sm" maxW="sm">{description}</Text>
    )}
    {action && (
      <Button variant="outline" size="sm" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </VStack>
)

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => (
  <VStack gap={3} py={16} textAlign="center">
    <Text color="fg.muted" fontSize="lg">{message}</Text>
    <Text color="fg.muted" fontSize="sm">
      Please check your connection and try again.
    </Text>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <LuRefreshCw /> Retry
      </Button>
    )}
  </VStack>
)

export default EmptyState
