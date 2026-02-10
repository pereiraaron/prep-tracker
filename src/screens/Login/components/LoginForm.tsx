import { useState } from 'react'
import { Button, Checkbox, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import Input from '@components/Input'
import Captcha from '@components/Captcha'

const isDev = import.meta.env.DEV

const LoginForm = () => {
  const { login, isLoading, error } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const captchaPassed = isDev || !!captchaToken

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaPassed) return
    login(email, password, rememberMe)
  }

  const handleCaptchaExpire = () => setCaptchaToken(null)

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

        {!isDev && <Captcha onVerify={setCaptchaToken} onExpire={handleCaptchaExpire} />}

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
          disabled={!captchaPassed || isLoading}
        >
          Log In
        </Button>

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
