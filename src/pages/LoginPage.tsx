import usePageTitle from "@hooks/usePageTitle";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Mail, Lock, ArrowRight, Loader2, Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import GoogleSignInButton from "@components/GoogleSignInButton";
import AuthShell from "@components/AuthShell";

const LoginPage = () => {
  usePageTitle("Login");
  const navigate = useNavigate();
  const { login, passkeyLogin, isLoading, error, isAuthenticated, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await login(email, password);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your interview prep"
      footer={
        <p className="text-center text-sm text-muted-foreground/75">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      }
    >
      <Card className="glass-card rounded-2xl border-border/40 shadow-none">
        <CardHeader className="pb-3 pt-6">
          <h2 className="text-sm font-display font-semibold text-center tracking-tight text-muted-foreground">
            Login
          </h2>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive animate-slide-up">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 rounded-xl"
                  required
                  disabled={isLoading}
                  onFocus={clearError}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-xs font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 rounded-xl"
                  required
                  disabled={isLoading}
                  onFocus={clearError}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/70" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.14em]">
              <span className="bg-transparent px-3 text-muted-foreground/50 backdrop-blur-sm">
                or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <GoogleSignInButton label="Sign in with Google" disabled={isLoading} />
            <Button
              variant="outline"
              className="w-full gap-2 rounded-xl active:scale-[0.98] transition-all"
              disabled={isLoading}
              onClick={() => passkeyLogin()}
            >
              <Fingerprint className="w-4 h-4" />
              Sign in with Passkey
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
};

export default LoginPage;
