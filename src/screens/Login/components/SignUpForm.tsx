import { useState } from "react";
import { Button, Checkbox, Text, VStack } from "@chakra-ui/react";
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
      <VStack gap={5} pt={3}>
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

        <Checkbox.Root
          size="sm"
          checked={rememberMe}
          onCheckedChange={(e) => setRememberMe(!!e.checked)}
          alignSelf="flex-start"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontSize="sm">Remember me</Checkbox.Label>
        </Checkbox.Root>

        {displayError && (
          <Text color="red.500" fontSize="sm">
            {displayError}
          </Text>
        )}

        <Button
          type="submit"
          colorPalette="blue"
          width="full"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign Up
        </Button>

        <Text fontSize="sm" color="fg.muted">
          Already have an account?{" "}
          <Link to="/login">
            <Text as="span" color="blue.500" cursor="pointer">
              Log in
            </Text>
          </Link>
        </Text>
      </VStack>
    </form>
  );
};

export default SignUpForm;
