import { API_BASE_URL, apiHeaders, handleResponse } from './client'
import type { Question } from './questions'

// ---- Enums ----

export type PrepCategory = 'dsa' | 'system_design' | 'behavioral' | 'machine_coding' | 'language_framework'
export type TaskStatus = 'active' | 'completed'
export type TaskInstanceStatus = 'pending' | 'incomplete' | 'in_progress' | 'completed'
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
  _id: string
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
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ---- TaskInstance ----

export interface TaskInstance {
  _id: string
  task: string
  userId: string
  date: string
  taskName: string
  category: string
  targetQuestionCount: number
  addedQuestionCount: number
  solvedQuestionCount: number
  status: TaskInstanceStatus
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
  instances: TaskInstance[]
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
    const res = await fetch(`${API_BASE_URL}/tasks${query}`, { headers: apiHeaders() })
    return handleResponse<PaginatedTasks>(res)
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { headers: apiHeaders() })
    return handleResponse<Task>(res)
  },

  create: async (body: CreateTaskBody) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Task>(res)
  },

  update: async (id: string, body: UpdateTaskBody) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Task>(res)
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    })
    return handleResponse<{ message: string }>(res)
  },

  getToday: async () => {
    const res = await fetch(`${API_BASE_URL}/tasks/today`, { headers: apiHeaders() })
    return handleResponse<TodayResponse>(res)
  },

  getHistory: async (params: { date: string } | { from: string; to: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE_URL}/tasks/history?${query}`, { headers: apiHeaders() })
    if ('date' in params) return handleResponse<HistoryDayResponse>(res)
    return handleResponse<HistoryRangeResponse>(res)
  },

  getInstanceById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/instances/${id}`, { headers: apiHeaders() })
    return handleResponse<TaskInstance>(res)
  },
}
