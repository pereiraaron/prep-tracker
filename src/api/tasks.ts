import { API_BASE_URL, apiFetch } from './client'
import type { Question } from './questions'

// ---- Enums ----

export type PrepCategory = 'dsa' | 'system_design' | 'behavioral' | 'machine_coding' | 'language_framework'
export type TaskStatus = 'active' | 'completed'
export type DailyTaskStatus = 'pending' | 'incomplete' | 'in_progress' | 'completed'
export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom'
export type Difficulty = 'easy' | 'medium' | 'hard'

// ---- Recurrence ----

export interface Recurrence {
  frequency: RecurrenceFrequency
  daysOfWeek?: number[]
  interval?: number
  startDate: string
}

// ---- Task ----

export interface Task {
  id: string
  name: string
  userId: string
  category: PrepCategory
  targetQuestionCount: number
  isRecurring: boolean
  recurrence?: Recurrence
  endDate?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTaskBody {
  name: string
  category: PrepCategory
  targetQuestionCount: number
  isRecurring?: boolean
  recurrence?: Omit<Recurrence, 'startDate'> & { startDate?: string }
  endDate?: string
}

export interface UpdateTaskBody {
  name?: string
  category?: PrepCategory
  targetQuestionCount?: number
  isRecurring?: boolean
  recurrence?: Omit<Recurrence, 'startDate'> & { startDate?: string }
  endDate?: string
}

export interface TasksFilter {
  category?: PrepCategory
  status?: TaskStatus
  isRecurring?: boolean
  page?: number
  limit?: number
}

export interface PaginatedTasks {
  data: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ---- DailyTask ----

export interface DailyTask {
  id: string
  task: string
  userId: string
  date: string
  taskName: string
  category: string
  targetQuestionCount: number
  addedQuestionCount: number
  solvedQuestionCount: number
  status: DailyTaskStatus
  questions?: Question[]
  createdAt: string
  updatedAt: string
}

// ---- Today / History ----

export interface TaskSummary {
  total: number
  completed: number
  incomplete: number
  in_progress: number
  pending: number
}

export interface TaskGroup {
  category: string
  summary: TaskSummary
  dailyTasks: DailyTask[]
}

export interface TodayResponse {
  date: string
  summary: TaskSummary
  groups: TaskGroup[]
}

export interface HistoryDayResponse {
  date: string
  summary: TaskSummary
  groups: TaskGroup[]
}

export interface HistoryRangeResponse {
  from: string
  to: string
  days: HistoryDayResponse[]
}

// ---- API ----

export const tasksApi = {
  getAll: async (filter?: TasksFilter) => {
    const params = new URLSearchParams()
    if (filter?.category) params.set('category', filter.category)
    if (filter?.status) params.set('status', filter.status)
    if (filter?.isRecurring !== undefined) params.set('isRecurring', String(filter.isRecurring))
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    return apiFetch<PaginatedTasks>(`${API_BASE_URL}/tasks${query}`)
  },

  getById: async (id: string) =>
    apiFetch<Task>(`${API_BASE_URL}/tasks/${id}`),

  create: async (body: CreateTaskBody) =>
    apiFetch<Task>(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: async (id: string, body: UpdateTaskBody) =>
    apiFetch<Task>(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: async (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    }),

  getToday: async () =>
    apiFetch<TodayResponse>(`${API_BASE_URL}/tasks/today`),

  getHistory: async (params: { date: string } | { from: string; to: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    if ('date' in params) return apiFetch<HistoryDayResponse>(`${API_BASE_URL}/tasks/history?${query}`)
    return apiFetch<HistoryRangeResponse>(`${API_BASE_URL}/tasks/history?${query}`)
  },

  getDailyTaskById: async (id: string) =>
    apiFetch<DailyTask>(`${API_BASE_URL}/tasks/daily/${id}`),
}
