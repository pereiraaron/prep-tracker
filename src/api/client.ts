import { useAuthStore } from '@store/useAuthStore'

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

export const handleResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 401) {
    useAuthStore.getState().logout()
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data as T
}
