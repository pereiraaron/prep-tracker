import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import ErrorBoundary from "@components/ErrorBoundary";
import RouteErrorBoundary from "@components/RouteErrorBoundary";
import { Loader2 } from "lucide-react";

const Toaster = lazy(() => import("@components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@components/ui/sonner").then((m) => ({ default: m.Toaster })));
import { TooltipProvider } from "@components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000, // keep unused cache 30 min (default 5 min)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Eagerly load primary pages to avoid lazy-load waterfall on LCP
import DashboardPage from "@pages/DashboardPage";
import LoginPage from "@pages/LoginPage";
import QuestionsPage from "@pages/QuestionsPage";
import StatsPage from "@pages/StatsPage";

// Lazy-load everything else
const QuestionDetailPage = lazy(() => import("@pages/QuestionDetailPage"));
const NewQuestionPage = lazy(() => import("@pages/NewQuestionPage"));
const BacklogPage = lazy(() => import("@pages/BacklogPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));
const RegisterPage = lazy(() => import("@pages/RegisterPage"));
const AuthCallbackPage = lazy(() => import("@pages/AuthCallbackPage"));
const PracticePage = lazy(() => import("@pages/PracticePage"));
const RevisionPage = lazy(() => import("@pages/RevisionPage"));
const NotFound = lazy(() => import("@pages/NotFound"));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        {/* Lazy-load toast providers — not needed for initial render */}
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>

        <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <RouteErrorBoundary>
            <Routes>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
              <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
              <Route path="/questions/:id/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
              <Route path="/question/new" element={<ProtectedRoute><NewQuestionPage /></ProtectedRoute>} />
              <Route path="/backlog" element={<ProtectedRoute><BacklogPage /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
              <Route path="/revision" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteErrorBoundary>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
