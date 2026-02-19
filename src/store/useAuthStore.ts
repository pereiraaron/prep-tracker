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
  refreshToken: string | null
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
  setTokens: (accessToken: string, refreshToken: string) => void
}

const getStorage = () => {
  const remember = localStorage.getItem('remember') !== 'false'
  return remember ? localStorage : sessionStorage
}

const persistTokens = (accessToken: string, refreshToken: string, userData: User, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem('token', accessToken)
  storage.setItem('refreshToken', refreshToken)
  storage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('remember', String(rememberMe))
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string, rememberMe = true) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, refreshToken, user } = await auth.login(email, password)
      const userData = { id: user.id, email, username: user.username, role: user.role }
      persistTokens(accessToken, refreshToken, userData, rememberMe)
      set({
        token: accessToken,
        refreshToken,
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
      const { accessToken, refreshToken, user } = await passkeyApi.verifyLogin(challengeId, credential)
      const userData = { id: user.id, email: email || '', username: user.username, role: user.role }
      persistTokens(accessToken, refreshToken, userData, rememberMe)
      set({
        token: accessToken,
        refreshToken,
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
      const { accessToken, refreshToken, user } = await passkeyApi.verifyLogin(challengeId, credential, signal)
      const userData = { id: user.id, email: '', username: user.username, role: user.role }
      persistTokens(accessToken, refreshToken, userData, rememberMe)
      set({
        token: accessToken,
        refreshToken,
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
      const { accessToken, refreshToken, user } = await auth.login(email, password)
      const userData = { id: user.id, email, username: user.username, role: user.role }
      persistTokens(accessToken, refreshToken, userData, rememberMe)
      set({
        token: accessToken,
        refreshToken,
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
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),

  setTokens: (accessToken: string, refreshToken: string) => {
    const storage = getStorage()
    storage.setItem('token', accessToken)
    storage.setItem('refreshToken', refreshToken)
    set({ token: accessToken, refreshToken })
  },

  hydrate: () => {
    const storage = getStorage()
    const token = storage.getItem('token')
    const refreshToken = storage.getItem('refreshToken')
    const userJson = storage.getItem('user')
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User
        set({ token, refreshToken, user, isAuthenticated: true, isHydrated: true })
        return
      } catch {
        // corrupted data, fall through to clear
      }
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
    set({ isHydrated: true })
  },
}))
