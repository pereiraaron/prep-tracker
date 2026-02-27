import { /* useEffect, useRef, */ useState } from 'react'
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
      <div className="flex flex-col gap-5 pt-3">
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

        <label className="flex items-center gap-2 self-start">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-(--color-primary)"
          />
          <span className="text-sm">Remember me</span>
        </label>

        {error && (
          <p className="text-sm text-red-500">
            {error}
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
            'Log In'
          )}
        </button>

        {webAuthnSupported && (
          <>
            <div className="flex w-full items-center gap-3">
              <hr className="flex-1 border-(--border)" />
              <span className="shrink-0 text-xs text-(--muted-foreground)">
                or
              </span>
              <hr className="flex-1 border-(--border)" />
            </div>

            <button
              type="button"
              className="btn-outline w-full justify-center py-3 text-base"
              disabled={isLoading}
              onClick={handlePasskeyClick}
            >
              <LuFingerprint />
              Sign in with Passkey
            </button>
          </>
        )}

        <p className="text-sm text-(--muted-foreground)">
          Don't have an account?{' '}
          <Link to="/login?mode=signup">
            <span className="cursor-pointer text-blue-500">
              Sign up
            </span>
          </Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
