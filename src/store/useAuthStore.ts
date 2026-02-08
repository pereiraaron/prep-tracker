import { create } from 'zustand'
import { auth } from '@api/auth'

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
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, rememberMe?: boolean, captchaToken?: string) => Promise<void>
  signup: (email: string, password: string, rememberMe?: boolean, captchaToken?: string) => Promise<void>
  logout: () => void
  clearError: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string, rememberMe = true, captchaToken?: string) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, user } = await auth.login(email, password, captchaToken)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', accessToken)
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: { id: user.id, email, username: user.username, role: user.role },
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

  signup: async (email: string, password: string, rememberMe = true, captchaToken?: string) => {
    set({ isLoading: true, error: null })
    try {
      await auth.register(email, password, captchaToken)
      const { accessToken, user } = await auth.login(email, password, captchaToken)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', accessToken)
      localStorage.setItem('remember', String(rememberMe))
      set({
        token: accessToken,
        user: { id: user.id, email, username: user.username, role: user.role },
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
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    const remember = localStorage.getItem('remember') !== 'false'
    const storage = remember ? localStorage : sessionStorage
    const token = storage.getItem('token')
    if (!token) return
    auth
      .getProfile(token)
      .then((profile) => {
        set({
          token,
          user: {
            id: profile._id,
            email: profile.email,
            username: profile.username,
            role: '',
          },
          isAuthenticated: true,
        })
      })
      .catch(() => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        localStorage.removeItem('remember')
      })
  },
}))
