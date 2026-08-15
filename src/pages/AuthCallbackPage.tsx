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
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <div className="app-background" aria-hidden>
        <div className="app-background-orb left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 bg-primary/12" />
      </div>
      <div className="relative glass-card rounded-2xl px-8 py-7 text-center space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground/80">Signing you in…</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
