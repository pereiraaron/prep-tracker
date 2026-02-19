import { API_BASE_URL, apiFetch } from './client'
import type { PrepCategory } from './tasks'

// ---- Response types ----

export interface OverviewResponse {
  total: number
  backlogCount: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byDifficulty: Record<string, number>
}

export interface CategoryBreakdown {
  category: string
  total: number
  solved: number
  in_progress: number
  pending: number
  completionRate: number
}

export interface DifficultyBreakdown {
  difficulty: string
  total: number
  solved: number
  in_progress: number
  pending: number
  completionRate: number
}

export interface TopicBreakdown {
  topic: string
  total: number
  solved: number
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
  solved: number
}

// ---- API ----

export const statsApi = {
  getOverview: async () =>
    apiFetch<OverviewResponse>(`${API_BASE_URL}/stats/overview`),

  getCategoryBreakdown: async () =>
    apiFetch<CategoryBreakdown[]>(`${API_BASE_URL}/stats/categories`),

  getDifficultyBreakdown: async () =>
    apiFetch<DifficultyBreakdown[]>(`${API_BASE_URL}/stats/difficulties`),

  getTopicBreakdown: async (category?: PrepCategory) => {
    const query = category ? `?category=${category}` : ''
    return apiFetch<TopicBreakdown[]>(`${API_BASE_URL}/stats/topics${query}`)
  },

  getStreaks: async () =>
    apiFetch<StreaksResponse>(`${API_BASE_URL}/stats/streaks`),

  getProgress: async (days = 30) =>
    apiFetch<ProgressDay[]>(`${API_BASE_URL}/stats/progress?days=${days}`),
}
