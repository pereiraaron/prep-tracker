import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { useAuthStore } from "@store/useAuthStore";
import {
  AUTH_BASE_URL,
  authHeaders,
  handleAuthResponse,
  handleResponse,
} from "./client";

const BASE = `${AUTH_BASE_URL}/auth/passkey`;

const bearerHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token;
  return authHeaders(token ?? undefined);
};

const passkeyFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, { ...init, headers: bearerHeaders() });
  return handleResponse<T>(res, () =>
    fetch(url, { ...init, headers: bearerHeaders() }),
  );
};

// ---- Types ----

export interface PasskeyCredential {
  id: string;
  name: string;
  deviceType: string;
  backedUp: boolean;
  createdAt: string;
}

export interface RegistrationOptionsResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
  challengeId: string;
}

export interface AuthenticationOptionsResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
  challengeId: string;
}

interface LoginVerifyResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username?: string;
    role: string;
  };
}

interface RegisterVerifyResponse {
  message: string;
  credential: PasskeyCredential;
}

// ---- API ----

export const passkeyApi = {
  // Login (API key auth, no bearer token)
  getLoginOptions: async (email?: string, signal?: AbortSignal) => {
    const res = await fetch(`${BASE}/login/options`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(email ? { email } : {}),
      signal,
    });
    return handleAuthResponse<AuthenticationOptionsResponse>(res);
  },

  verifyLogin: async (
    challengeId: string,
    credential: unknown,
    signal?: AbortSignal,
  ) => {
    const res = await fetch(`${BASE}/login/verify`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ challengeId, credential }),
      signal,
    });
    return handleAuthResponse<LoginVerifyResponse>(res);
  },

  // Registration (Bearer token required)
  getRegisterOptions: async () =>
    passkeyFetch<RegistrationOptionsResponse>(`${BASE}/register/options`, {
      method: "POST",
    }),

  verifyRegister: async (
    challengeId: string,
    credential: unknown,
    name?: string,
  ) =>
    passkeyFetch<RegisterVerifyResponse>(`${BASE}/register/verify`, {
      method: "POST",
      body: JSON.stringify({ challengeId, credential, name }),
    }),

  // Credential management (Bearer token required)
  listCredentials: async () =>
    passkeyFetch<{ credentials: PasskeyCredential[] }>(`${BASE}/credentials`),

  renameCredential: async (id: string, name: string) =>
    passkeyFetch<{ credential: PasskeyCredential }>(
      `${BASE}/credentials/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      },
    ),

  deleteCredential: async (id: string) => {
    const res = await fetch(`${BASE}/credentials/${id}`, {
      method: "DELETE",
      headers: bearerHeaders(),
    });
    if (res.status === 204) return;
    return handleResponse<void>(res, () =>
      fetch(`${BASE}/credentials/${id}`, {
        method: "DELETE",
        headers: bearerHeaders(),
      }),
    );
  },

  optOut: async () =>
    passkeyFetch<{ message: string }>(`${BASE}/opt-out`, {
      method: "POST",
    }),
};
