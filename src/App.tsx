import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@components/ui/toaster";
import { Toaster as Sonner } from "@components/ui/sonner";
import { TooltipProvider } from "@components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import ErrorBoundary from "@components/ErrorBoundary";
import { Loader2 } from "lucide-react";

const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const QuestionsPage = lazy(() => import("@pages/QuestionsPage"));
const QuestionDetailPage = lazy(() => import("@pages/QuestionDetailPage"));
const NewQuestionPage = lazy(() => import("@pages/NewQuestionPage"));
const BacklogPage = lazy(() => import("@pages/BacklogPage"));
const StatsPage = lazy(() => import("@pages/StatsPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));
const LoginPage = lazy(() => import("@pages/LoginPage"));
const RegisterPage = lazy(() => import("@pages/RegisterPage"));
const AuthCallbackPage = lazy(() => import("@pages/AuthCallbackPage"));
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
  <ErrorBoundary>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
            <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><NewQuestionPage /></ProtectedRoute>} />
            <Route path="/backlog" element={<ProtectedRoute><BacklogPage /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
