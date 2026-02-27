import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import Navbar from '@components/Navbar'
import ColorModeToggle from '@components/ColorModeToggle'
import ErrorBoundary from '@components/ErrorBoundary'

const Login = lazy(() => import('@pages/Login/Login'))
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard'))
const Questions = lazy(() => import('@pages/Questions/Questions'))
const QuestionForm = lazy(() => import('@pages/Questions/QuestionForm'))
const QuestionDetail = lazy(() => import('@pages/Questions/QuestionDetail'))
const Backlog = lazy(() => import('@pages/Backlog/Backlog'))
const Stats = lazy(() => import('@pages/Stats/Stats'))
const Settings = lazy(() => import('@pages/Settings/Settings'))

const PageLoader = () => (
  <div className="flex flex-1 items-center justify-center py-20">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
  </div>
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
            <Route path="/questions/new" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
            <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
            <Route path="/backlog" element={<ProtectedRoute><Backlog /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ColorModeToggle />
      </div>
    </ErrorBoundary>
  )
}

export default App
