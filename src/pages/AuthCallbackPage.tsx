import usePageTitle from "@hooks/usePageTitle";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { Loader2 } from "lucide-react";

const REDIRECT_URI = `${window.location.origin}/auth/callback`;

const AuthCallbackPage = () => {
  usePageTitle("Signing in...");
  const navigate = useNavigate();
  const { socialLogin, isAuthenticated, error } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/auth/login", { replace: true });
      return;
    }

    socialLogin("google", code, REDIRECT_URI);
  }, [socialLogin, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      navigate("/auth/login", { replace: true });
    }
  }, [error, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
