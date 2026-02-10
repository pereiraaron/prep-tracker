import { useAuthStore } from '@store/useAuthStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const headers = (): HeadersInit => {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data as T
}

// ---- Response types ----

export interface OverviewResponse {
  total: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byDifficulty: Record<string, number>
}

export interface CategoryBreakdown {
  category: string
  total: number
  completed: number
  in_progress: number
  pending: number
  completionRate: number
}

export interface DifficultyBreakdown {
  difficulty: string
  total: number
  completed: number
  in_progress: number
  pending: number
  completionRate: number
}

export interface StreaksResponse {
  currentStreak: number
  longestStreak: number
  totalActiveDays: number
}

export interface ProgressDay {
  date: string
  completed: number
}

// ---- API ----

export const statsApi = {
  getOverview: async () => {
    const res = await fetch(`${BASE_URL}/stats/overview`, { headers: headers() })
    return handleResponse<OverviewResponse>(res)
  },

  getCategoryBreakdown: async () => {
    const res = await fetch(`${BASE_URL}/stats/categories`, { headers: headers() })
    return handleResponse<CategoryBreakdown[]>(res)
  },

  getDifficultyBreakdown: async () => {
    const res = await fetch(`${BASE_URL}/stats/difficulties`, { headers: headers() })
    return handleResponse<DifficultyBreakdown[]>(res)
  },

  getStreaks: async () => {
    const res = await fetch(`${BASE_URL}/stats/streaks`, { headers: headers() })
    return handleResponse<StreaksResponse>(res)
  },

  getProgress: async (days = 30) => {
    const res = await fetch(`${BASE_URL}/stats/progress?days=${days}`, { headers: headers() })
    return handleResponse<ProgressDay[]>(res)
  },
}
