import { create } from 'zustand'
import { startAuthentication } from '@simplewebauthn/browser'
import { auth } from '@api/auth'
import { passkeyApi } from '@api/passkey'

interface User {
  id: string
  email: string
  username?: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  passkeyLogin: (email?: string, rememberMe?: boolean) => Promise<void>
  passkeyConditionalLogin: (signal: AbortSignal, rememberMe?: boolean) => Promise<void>
  signup: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
  clearError: () => void
  hydrate: () => void
}

// TODO: Remove mock user before production
const DEV_MOCK_USER: User | null = import.meta.env.DEV
  ? { id: 'mock', email: 'john@example.com', username: 'John Doe', role: 'user' }
  : null

export const useAuthStore = create<AuthState>((set) => ({
  user: DEV_MOCK_USER,
  token: DEV_MOCK_USER ? 'mock-token' : null,
  isAuthenticated: !!DEV_MOCK_USER,
  isHydrated: !!DEV_MOCK_USER,
  isLoading: false,
  error: null,

  login: async (email: string, password: string, rememberMe = true) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, user } = await auth.login(email, password)
      const storage = rememberMe ? localStorage : sessionStorage
      const userData = { id: user.id, email, username: user.username, role: user.role }
      storage.setItem('token', accessToken)
      storage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Login failed',
      })
    }
  },

  passkeyLogin: async (email?: string, rememberMe = true) => {
    set({ isLoading: true, error: null })
    try {
      const { options, challengeId } = await passkeyApi.getLoginOptions(email)
      const credential = await startAuthentication({ optionsJSON: options })
      const { accessToken, user } = await passkeyApi.verifyLogin(challengeId, credential)
      const storage = rememberMe ? localStorage : sessionStorage
      const userData = { id: user.id, email: email || '', username: user.username, role: user.role }
      storage.setItem('token', accessToken)
      storage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        set({ isLoading: false })
        return
      }
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Passkey login failed',
      })
    }
  },

  passkeyConditionalLogin: async (signal: AbortSignal, rememberMe = true) => {
    try {
      const { options, challengeId } = await passkeyApi.getLoginOptions(undefined, signal)
      const credential = await startAuthentication({ optionsJSON: options, useBrowserAutofill: true })
      const { accessToken, user } = await passkeyApi.verifyLogin(challengeId, credential, signal)
      const storage = rememberMe ? localStorage : sessionStorage
      const userData = { id: user.id, email: '', username: user.username, role: user.role }
      storage.setItem('token', accessToken)
      storage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      // Conditional mediation errors are silent — the user either
      // cancelled, the signal was aborted, or autofill isn't available.
    }
  },

  signup: async (email: string, password: string, rememberMe = true) => {
    set({ isLoading: true, error: null })
    try {
      await auth.register(email, password)
      const { accessToken, user } = await auth.login(email, password)
      const storage = rememberMe ? localStorage : sessionStorage
      const userData = { id: user.id, email, username: user.username, role: user.role }
      storage.setItem('token', accessToken)
      storage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Signup failed',
      })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    // Skip hydration when using dev mock user
    if (DEV_MOCK_USER) {
      set({ isHydrated: true })
      return
    }
    const remember = localStorage.getItem('remember') !== 'false'
    const storage = remember ? localStorage : sessionStorage
    const token = storage.getItem('token')
    const userJson = storage.getItem('user')
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User
        set({ token, user, isAuthenticated: true, isHydrated: true })
        return
      } catch {
        // corrupted data, fall through to clear
      }
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    set({ isHydrated: true })
  },
}))
