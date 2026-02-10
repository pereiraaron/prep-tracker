import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser'
import { useAuthStore } from '@store/useAuthStore'
import { AUTH_BASE_URL, authHeaders, handleAuthResponse, handleResponse } from './client'

const BASE = `${AUTH_BASE_URL}/auth/passkey`

const bearerHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token
  return authHeaders(token ?? undefined)
}

// ---- Types ----

export interface PasskeyCredential {
  _id: string
  name: string
  deviceType: string
  backedUp: boolean
  createdAt: string
}

export interface RegistrationOptionsResponse {
  options: PublicKeyCredentialCreationOptionsJSON
  challengeId: string
}

export interface AuthenticationOptionsResponse {
  options: PublicKeyCredentialRequestOptionsJSON
  challengeId: string
}

interface LoginVerifyResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username?: string
    role: string
  }
}

interface RegisterVerifyResponse {
  message: string
  credential: PasskeyCredential
}

// ---- API ----

export const passkeyApi = {
  // Login (API key auth, no bearer token)
  getLoginOptions: async (email?: string) => {
    const res = await fetch(`${BASE}/login/options`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(email ? { email } : {}),
    })
    return handleAuthResponse<AuthenticationOptionsResponse>(res)
  },

  verifyLogin: async (challengeId: string, credential: unknown) => {
    const res = await fetch(`${BASE}/login/verify`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ challengeId, credential }),
    })
    return handleAuthResponse<LoginVerifyResponse>(res)
  },

  // Registration (Bearer token required)
  getRegisterOptions: async () => {
    const res = await fetch(`${BASE}/register/options`, {
      method: 'POST',
      headers: bearerHeaders(),
    })
    return handleResponse<RegistrationOptionsResponse>(res)
  },

  verifyRegister: async (challengeId: string, credential: unknown, name?: string) => {
    const res = await fetch(`${BASE}/register/verify`, {
      method: 'POST',
      headers: bearerHeaders(),
      body: JSON.stringify({ challengeId, credential, name }),
    })
    return handleResponse<RegisterVerifyResponse>(res)
  },

  // Credential management (Bearer token required)
  listCredentials: async () => {
    const res = await fetch(`${BASE}/credentials`, {
      headers: bearerHeaders(),
    })
    return handleResponse<{ credentials: PasskeyCredential[] }>(res)
  },

  renameCredential: async (id: string, name: string) => {
    const res = await fetch(`${BASE}/credentials/${id}`, {
      method: 'PATCH',
      headers: bearerHeaders(),
      body: JSON.stringify({ name }),
    })
    return handleResponse<{ credential: PasskeyCredential }>(res)
  },

  deleteCredential: async (id: string) => {
    const res = await fetch(`${BASE}/credentials/${id}`, {
      method: 'DELETE',
      headers: bearerHeaders(),
    })
    if (res.status === 204) return
    return handleResponse<void>(res)
  },

  optOut: async () => {
    const res = await fetch(`${BASE}/opt-out`, {
      method: 'POST',
      headers: bearerHeaders(),
    })
    return handleResponse<{ message: string }>(res)
  },
}
