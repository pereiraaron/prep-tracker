import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import Input from "@components/Input";

const SignUpForm = () => {
  const { signup, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    signup(email, password, rememberMe);
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5 pt-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label className="flex items-center gap-2 self-start">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-(--color-primary)"
          />
          <span className="text-sm">Remember me</span>
        </label>

        {displayError && (
          <p className="text-sm text-red-500">
            {displayError}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full justify-center py-3 text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="text-sm text-(--muted-foreground)">
          Already have an account?{" "}
          <Link to="/login">
            <span className="cursor-pointer text-blue-500">
              Log in
            </span>
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
