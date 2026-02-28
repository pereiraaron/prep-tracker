import { AUTH_BASE_URL, authHeaders, handleAuthResponse } from "./client";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username?: string;
    role: string;
  };
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

interface RegisterResponse {
  message: string;
  user: {
    email: string;
    id: string;
  };
}

interface UserProfileResponse {
  id: string;
  email: string;
  username?: string;
  isActive: boolean;
}

export const auth = {
  register: async (email: string, password: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleAuthResponse<RegisterResponse>(res);
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleAuthResponse<LoginResponse>(res);
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/users/profile`, {
      method: "GET",
      headers: authHeaders(token),
    });
    return handleAuthResponse<UserProfileResponse>(res);
  },

  refresh: async (refreshToken: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    return handleAuthResponse<RefreshResponse>(res);
  },

  socialLogin: async (provider: string, code: string, redirectUri: string) => {
    const res = await fetch(`${AUTH_BASE_URL}/auth/social/login`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ provider, code, redirectUri }),
    });
    return handleAuthResponse<LoginResponse>(res);
  },
};
