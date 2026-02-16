import { /* useEffect, useRef, */ useState } from 'react'
import { Button, Checkbox, Text, VStack, Separator, HStack } from '@chakra-ui/react'
import { LuFingerprint } from 'react-icons/lu'
import {
  browserSupportsWebAuthn,
  // browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import Input from '@components/Input'

const LoginForm = () => {
  const { login, passkeyLogin, /* passkeyConditionalLogin, */ isLoading, error } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  const webAuthnSupported = browserSupportsWebAuthn()
  // const abortRef = useRef<AbortController | null>(null)

  // Start conditional mediation (autofill) on mount
  // useEffect(() => {
  //   if (!webAuthnSupported) return
  //
  //   let controller: AbortController | null = null
  //
  //   browserSupportsWebAuthnAutofill().then((supported) => {
  //     if (!supported) return
  //     controller = new AbortController()
  //     abortRef.current = controller
  //     passkeyConditionalLogin(controller.signal, rememberMe)
  //   })
  //
  //   return () => {
  //     controller?.abort()
  //     abortRef.current = null
  //   }
  //   // Only run on mount
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const abortConditional = () => {
  //   abortRef.current?.abort()
  //   abortRef.current = null
  // }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password, rememberMe)
  }

  const handlePasskeyClick = () => {
    passkeyLogin(email || undefined, rememberMe)
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={5} pt={3}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username webauthn"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
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
          Log In
        </Button>

        {webAuthnSupported && (
          <>
            <HStack width="full" gap={3}>
              <Separator flex="1" />
              <Text fontSize="xs" color="fg.muted" flexShrink={0}>
                or
              </Text>
              <Separator flex="1" />
            </HStack>

            <Button
              type="button"
              variant="outline"
              width="full"
              size="lg"
              disabled={isLoading}
              onClick={handlePasskeyClick}
            >
              <LuFingerprint />
              Sign in with Passkey
            </Button>
          </>
        )}

        <Text fontSize="sm" color="fg.muted">
          Don't have an account?{' '}
          <Link to="/login?mode=signup">
            <Text as="span" color="blue.500" cursor="pointer">
              Sign up
            </Text>
          </Link>
        </Text>
      </VStack>
    </form>
  )
}

export default LoginForm
