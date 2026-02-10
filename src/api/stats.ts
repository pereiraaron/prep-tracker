import { API_BASE_URL, apiHeaders, handleResponse } from './client'

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
    const res = await fetch(`${API_BASE_URL}/stats/overview`, { headers: apiHeaders() })
    return handleResponse<OverviewResponse>(res)
  },

  getCategoryBreakdown: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/categories`, { headers: apiHeaders() })
    return handleResponse<CategoryBreakdown[]>(res)
  },

  getDifficultyBreakdown: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/difficulties`, { headers: apiHeaders() })
    return handleResponse<DifficultyBreakdown[]>(res)
  },

  getStreaks: async () => {
    const res = await fetch(`${API_BASE_URL}/stats/streaks`, { headers: apiHeaders() })
    return handleResponse<StreaksResponse>(res)
  },

  getProgress: async (days = 30) => {
    const res = await fetch(`${API_BASE_URL}/stats/progress?days=${days}`, { headers: apiHeaders() })
    return handleResponse<ProgressDay[]>(res)
  },
}
