import { AUTH_BASE_URL, authHeaders, handleResponse } from './client'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username?: string
    role: string
  }
}

interface RegisterResponse {
  message: string
  user: {
    email: string
    _id: string
  }
}

interface UserProfileResponse {
  _id: string
  email: string
  username?: string
  isActive: boolean
}

export const auth = {
  register: async (email: string, password: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<RegisterResponse>(res)
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<LoginResponse>(res)
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: authHeaders(token),
    })
    return handleResponse<UserProfileResponse>(res)
  },
}
