import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'
import { useAuthStore } from '@store/useAuthStore'
import Login from '@screens/Login/Login'
import Dashboard from '@screens/Dashboard/Dashboard'
import Navbar from '@components/Navbar'
import ColorModeToggle from '@components/ColorModeToggle'

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
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1" direction="column">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Flex>

      <ColorModeToggle />
    </Flex>
  )
}

export default App
