import { API_BASE_URL, apiHeaders, handleResponse } from './client'

// ---- Enums ----

export type EntryStatus = 'pending' | 'in_progress' | 'completed'
export type PrepCategory = 'dsa' | 'system_design' | 'behavioral' | 'machine_coding' | 'language_framework'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type RecurrenceFrequency = 'daily' | 'weekly' | 'custom'

export interface Recurrence {
  frequency: RecurrenceFrequency
  daysOfWeek?: number[]
}

// ---- Entry ----

export interface Entry {
  _id: string
  title: string
  notes?: string
  solution?: string
  status: EntryStatus
  category: PrepCategory
  topic?: string
  difficulty?: Difficulty
  source?: string
  url?: string
  tags: string[]
  userId: string
  deadline: string
  isRecurring: boolean
  recurrence?: Recurrence
  recurringEndDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEntryBody {
  title: string
  notes?: string
  solution?: string
  status?: EntryStatus
  category: PrepCategory
  topic?: string
  difficulty?: Difficulty
  source?: string
  url?: string
  tags?: string[]
  deadline: string
  isRecurring?: boolean
  recurrence?: Recurrence
  recurringEndDate?: string
}

export interface UpdateEntryBody {
  title?: string
  notes?: string
  solution?: string
  status?: EntryStatus
  category?: PrepCategory
  topic?: string
  difficulty?: Difficulty
  source?: string
  url?: string
  tags?: string[]
  deadline?: string
  isRecurring?: boolean
  recurrence?: Recurrence
  recurringEndDate?: string
}

export interface EntriesFilter {
  category?: PrepCategory
  topic?: string
  difficulty?: Difficulty
  status?: EntryStatus
  source?: string
  tag?: string
  date?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface PaginatedEntries {
  entries: Entry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ---- Scheduling ----

export interface TaskSummary {
  total: number
  completed: number
  in_progress: number
  pending: number
}

export interface ResolvedTask extends Entry {
  completionId: string | null
  completionNotes: string | null
}

export interface TaskGroup {
  category: string
  summary: TaskSummary
  tasks: ResolvedTask[]
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

// ---- Task Completion ----

export interface UpdateTaskStatusBody {
  entry: string
  date: string
  status: EntryStatus
  notes?: string
}

export interface TaskCompletion {
  _id: string
  entry: string
  userId: string
  date: string
  status: EntryStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

// ---- Aggregations ----

export interface TagCount { tag: string; count: number }
export interface TopicCount { topic: string; count: number }
export interface SourceCount { source: string; count: number }

// ---- API ----

export const entriesApi = {
  getAll: async (filter?: EntriesFilter) => {
    const params = new URLSearchParams()
    if (filter?.category) params.set('category', filter.category)
    if (filter?.topic) params.set('topic', filter.topic)
    if (filter?.difficulty) params.set('difficulty', filter.difficulty)
    if (filter?.status) params.set('status', filter.status)
    if (filter?.source) params.set('source', filter.source)
    if (filter?.tag) params.set('tag', filter.tag)
    if (filter?.date) params.set('date', filter.date)
    if (filter?.from) params.set('from', filter.from)
    if (filter?.to) params.set('to', filter.to)
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    const res = await fetch(`${API_BASE_URL}/entries${query}`, { headers: apiHeaders() })
    return handleResponse<PaginatedEntries>(res)
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/entries/${id}`, { headers: apiHeaders() })
    return handleResponse<Entry>(res)
  },

  create: async (body: CreateEntryBody) => {
    const res = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Entry>(res)
  },

  update: async (id: string, body: UpdateEntryBody) => {
    const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Entry>(res)
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    })
    return handleResponse<{ message: string }>(res)
  },

  bulkDelete: async (ids: string[]) => {
    const res = await fetch(`${API_BASE_URL}/entries/bulk-delete`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ ids }),
    })
    return handleResponse<{ message: string; deletedCount: number }>(res)
  },

  getToday: async () => {
    const res = await fetch(`${API_BASE_URL}/entries/today`, { headers: apiHeaders() })
    return handleResponse<TodayResponse>(res)
  },

  getHistory: async (params: { date: string } | { from: string; to: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE_URL}/entries/history?${query}`, { headers: apiHeaders() })
    if ('date' in params) return handleResponse<HistoryDayResponse>(res)
    return handleResponse<HistoryRangeResponse>(res)
  },

  updateTaskStatus: async (body: UpdateTaskStatusBody) => {
    const res = await fetch(`${API_BASE_URL}/entries/status`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<TaskCompletion>(res)
  },

  search: async (q: string) => {
    const res = await fetch(`${API_BASE_URL}/entries/search?q=${encodeURIComponent(q)}`, {
      headers: apiHeaders(),
    })
    return handleResponse<Entry[]>(res)
  },

  getTags: async () => {
    const res = await fetch(`${API_BASE_URL}/entries/tags`, { headers: apiHeaders() })
    return handleResponse<TagCount[]>(res)
  },

  getTopics: async (category?: PrepCategory) => {
    const query = category ? `?category=${category}` : ''
    const res = await fetch(`${API_BASE_URL}/entries/topics${query}`, { headers: apiHeaders() })
    return handleResponse<TopicCount[]>(res)
  },

  getSources: async () => {
    const res = await fetch(`${API_BASE_URL}/entries/sources`, { headers: apiHeaders() })
    return handleResponse<SourceCount[]>(res)
  },
}
