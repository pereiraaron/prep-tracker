const BASE_URL = "";
const API_KEY = "";

const headers = (token?: string): HeadersInit => ({
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username?: string;
    role: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    email: string;
    _id: string;
  };
}

interface UserProfileResponse {
  _id: string;
  email: string;
  username?: string;
  isActive: boolean;
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data as T;
};

export const auth = {
  register: async (email: string, password: string, captchaToken?: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password, captchaToken }),
    });
    return handleResponse<RegisterResponse>(res);
  },

  login: async (email: string, password: string, captchaToken?: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password, captchaToken }),
    });
    return handleResponse<LoginResponse>(res);
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "GET",
      headers: headers(token),
    });
    return handleResponse<UserProfileResponse>(res);
  },
};
