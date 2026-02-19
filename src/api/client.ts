import { useAuthStore } from '@store/useAuthStore'
import { auth } from './auth'

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL
const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export { AUTH_BASE_URL, API_BASE_URL }

export const authHeaders = (token?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-api-key': AUTH_API_KEY,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

export const apiHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/** Unwrap backend envelope: { success, data, ...rest } → { data, ...rest } or just data */
const unwrapEnvelope = <T>(raw: any): T => {
  if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
    const { success: _, data, ...rest } = raw
    // Paginated responses have sibling fields like `pagination`
    if (Object.keys(rest).length > 0) return { data, ...rest } as T
    return data as T
  }
  return raw as T
}

/** For auth endpoints (login, register, passkey login) — no auto-logout on 401. */
export const handleAuthResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Something went wrong')
  return data as T
}

// Mutex to prevent concurrent refresh attempts
let refreshPromise: Promise<boolean> | null = null

const tryRefresh = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise

  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) return false

  refreshPromise = (async () => {
    try {
      const data = await auth.refresh(refreshToken)
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * For protected endpoints — auto-refreshes token on 401, retries once.
 * Falls back to logout + redirect if refresh fails.
 */
export const handleResponse = async <T>(
  res: Response,
  retryRequest?: () => Promise<Response>,
): Promise<T> => {
  if (res.status === 401 && retryRequest) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const retryRes = await retryRequest()
      if (retryRes.ok) {
        const data = await retryRes.json()
        return unwrapEnvelope<T>(data)
      }
    }
    useAuthStore.getState().logout()
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  if (res.status === 401) {
    useAuthStore.getState().logout()
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || data.message || 'Something went wrong')
  return unwrapEnvelope<T>(data)
}

/**
 * Fetch wrapper for protected API endpoints.
 * Automatically attaches auth headers and retries on 401 after token refresh.
 */
export const apiFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, { ...init, headers: apiHeaders() })
  return handleResponse<T>(res, () =>
    fetch(url, { ...init, headers: apiHeaders() })
  )
}
