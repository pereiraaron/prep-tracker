import { API_BASE_URL, apiHeaders, handleResponse } from './client'
import type { Difficulty, PrepCategory } from './tasks'

// ---- Enums ----

export type QuestionStatus = 'pending' | 'in_progress' | 'solved'
export type QuestionSource = 'leetcode' | 'greatfrontend' | 'other'

// ---- Question ----

export interface Question {
  _id: string
  taskInstance: string | null
  task: string | null
  userId: string
  title: string
  notes?: string
  solution?: string
  status: QuestionStatus
  difficulty?: Difficulty
  topic?: string
  source?: QuestionSource
  url?: string
  tags: string[]
  solvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionBody {
  taskInstanceId: string
  title: string
  notes?: string
  solution?: string
  difficulty?: Difficulty
  topic?: string
  source?: QuestionSource
  url?: string
  tags?: string[]
}

export interface CreateBacklogQuestionBody {
  title: string
  notes?: string
  solution?: string
  difficulty?: Difficulty
  topic?: string
  source?: QuestionSource
  url?: string
  tags?: string[]
}

export interface UpdateQuestionBody {
  title?: string
  notes?: string
  solution?: string
  difficulty?: Difficulty
  topic?: string
  source?: QuestionSource
  url?: string
  tags?: string[]
}

export interface QuestionsFilter {
  task?: string
  taskInstance?: string
  status?: QuestionStatus
  difficulty?: Difficulty
  topic?: string
  source?: string
  tag?: string
  backlog?: 'true' | 'all'
  page?: number
  limit?: number
}

export interface PaginatedQuestions {
  questions: Question[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ---- Aggregations ----

export interface TagCount { tag: string; count: number }
export interface TopicCount { topic: string; count: number }
export interface SourceCount { source: string; count: number }

// ---- API ----

export const questionsApi = {
  getAll: async (filter?: QuestionsFilter) => {
    const params = new URLSearchParams()
    if (filter?.task) params.set('task', filter.task)
    if (filter?.taskInstance) params.set('taskInstance', filter.taskInstance)
    if (filter?.status) params.set('status', filter.status)
    if (filter?.difficulty) params.set('difficulty', filter.difficulty)
    if (filter?.topic) params.set('topic', filter.topic)
    if (filter?.source) params.set('source', filter.source)
    if (filter?.tag) params.set('tag', filter.tag)
    if (filter?.backlog) params.set('backlog', filter.backlog)
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    const res = await fetch(`${API_BASE_URL}/questions${query}`, { headers: apiHeaders() })
    return handleResponse<PaginatedQuestions>(res)
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/questions/${id}`, { headers: apiHeaders() })
    return handleResponse<Question>(res)
  },

  create: async (body: CreateQuestionBody) => {
    const res = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Question>(res)
  },

  update: async (id: string, body: UpdateQuestionBody) => {
    const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Question>(res)
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    })
    return handleResponse<{ message: string }>(res)
  },

  solve: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/questions/${id}/solve`, {
      method: 'PATCH',
      headers: apiHeaders(),
    })
    return handleResponse<Question>(res)
  },

  search: async (q: string, filters?: { status?: QuestionStatus; difficulty?: Difficulty }) => {
    const params = new URLSearchParams({ q })
    if (filters?.status) params.set('status', filters.status)
    if (filters?.difficulty) params.set('difficulty', filters.difficulty)
    const res = await fetch(`${API_BASE_URL}/questions/search?${params}`, { headers: apiHeaders() })
    return handleResponse<Question[]>(res)
  },

  getTags: async () => {
    const res = await fetch(`${API_BASE_URL}/questions/tags`, { headers: apiHeaders() })
    return handleResponse<TagCount[]>(res)
  },

  getTopics: async (category?: PrepCategory) => {
    const query = category ? `?category=${category}` : ''
    const res = await fetch(`${API_BASE_URL}/questions/topics${query}`, { headers: apiHeaders() })
    return handleResponse<TopicCount[]>(res)
  },

  getSources: async () => {
    const res = await fetch(`${API_BASE_URL}/questions/sources`, { headers: apiHeaders() })
    return handleResponse<SourceCount[]>(res)
  },

  bulkDelete: async (ids: string[]) => {
    const res = await fetch(`${API_BASE_URL}/questions/bulk-delete`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ ids }),
    })
    return handleResponse<{ message: string; deletedCount: number }>(res)
  },

  // ---- Backlog ----

  getBacklog: async (filter?: Omit<QuestionsFilter, 'task' | 'taskInstance' | 'backlog'>) => {
    const params = new URLSearchParams()
    if (filter?.status) params.set('status', filter.status)
    if (filter?.difficulty) params.set('difficulty', filter.difficulty)
    if (filter?.topic) params.set('topic', filter.topic)
    if (filter?.source) params.set('source', filter.source)
    if (filter?.tag) params.set('tag', filter.tag)
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    const res = await fetch(`${API_BASE_URL}/questions/backlog${query}`, { headers: apiHeaders() })
    return handleResponse<PaginatedQuestions>(res)
  },

  createBacklog: async (body: CreateBacklogQuestionBody) => {
    const res = await fetch(`${API_BASE_URL}/questions/backlog`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse<Question>(res)
  },

  moveToInstance: async (id: string, taskInstanceId: string) => {
    const res = await fetch(`${API_BASE_URL}/questions/${id}/move`, {
      method: 'PATCH',
      headers: apiHeaders(),
      body: JSON.stringify({ taskInstanceId }),
    })
    return handleResponse<Question>(res)
  },

  bulkMove: async (questionIds: string[], taskInstanceId: string) => {
    const res = await fetch(`${API_BASE_URL}/questions/bulk-move`, {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ questionIds, taskInstanceId }),
    })
    return handleResponse<{ movedCount: number; skippedCount: number }>(res)
  },
}
