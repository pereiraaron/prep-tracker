import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={6}>
          <VStack gap={4} textAlign="center">
            <Heading size="lg">Something went wrong</Heading>
            <Text color="fg.muted">An unexpected error occurred. Please try reloading the page.</Text>
            <Button colorPalette="blue" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
