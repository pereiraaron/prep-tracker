import usePageTitle from "@hooks/usePageTitle";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Mail, Lock, ArrowRight, Zap, Loader2, Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import GoogleSignInButton from "@components/GoogleSignInButton";

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none fixed right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-stat-purple/5 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-2">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground/70 text-sm">Sign in to your interview prep tracker</p>
        </div>

        <Card className="glass-card border-border/50 shadow-lg shadow-black/[0.03]">
          <CardHeader className="pb-4">
            <h2 className="text-base font-display font-semibold text-center">Login</h2>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive animate-slide-up">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                    disabled={isLoading}
                    onFocus={clearError}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-xs font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    disabled={isLoading}
                    onFocus={clearError}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98]" disabled={isLoading}>
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
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-card px-3 text-muted-foreground/50">or continue with</span>
              </div>
            </div>

            <div className="space-y-2">
              <GoogleSignInButton label="Sign in with Google" disabled={isLoading} />
              <Button variant="outline" className="w-full gap-2 active:scale-[0.98] transition-all" disabled={isLoading} onClick={() => passkeyLogin()}>
                <Fingerprint className="w-4 h-4" />
                Sign in with Passkey
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground/70">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
