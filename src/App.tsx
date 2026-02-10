import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Flex, Spinner } from '@chakra-ui/react'
import { useAuthStore } from '@store/useAuthStore'
import Navbar from '@components/Navbar'
import ColorModeToggle from '@components/ColorModeToggle'
import ErrorBoundary from '@components/ErrorBoundary'

const Login = lazy(() => import('@screens/Login/Login'))
const Dashboard = lazy(() => import('@screens/Dashboard/Dashboard'))
const Entries = lazy(() => import('@screens/Entries/Entries'))
const EntryForm = lazy(() => import('@screens/Entries/EntryForm'))
const Stats = lazy(() => import('@screens/Stats/Stats'))

const PageLoader = () => (
  <Flex justify="center" align="center" flex="1" py={20}>
    <Spinner size="lg" />
  </Flex>
)

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

const App = () => {
  const hydrate = useAuthStore((s) => s.hydrate)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  useEffect(() => { hydrate() }, [hydrate])

  if (!isHydrated) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Spinner size="lg" />
      </Flex>
    )
  }

  return (
    <ErrorBoundary>
      <Flex direction="column" minH="100vh">
        <Navbar />
        <Flex flex="1" direction="column">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entries"
                element={
                  <ProtectedRoute>
                    <Entries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entries/new"
                element={
                  <ProtectedRoute>
                    <EntryForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entries/:id"
                element={
                  <ProtectedRoute>
                    <EntryForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Flex>

        <ColorModeToggle />
      </Flex>
    </ErrorBoundary>
  )
}

export default App
