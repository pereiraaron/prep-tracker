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
  signup: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
  clearError: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
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
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Passkey login failed',
      })
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
