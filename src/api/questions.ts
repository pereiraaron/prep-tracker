import { API_BASE_URL, apiFetch } from './client'
import type { Difficulty, PrepCategory } from './tasks'

// ---- Enums ----

export type QuestionStatus = 'pending' | 'in_progress' | 'solved'
export type QuestionSource = 'leetcode' | 'greatfrontend' | 'other'

// ---- Question ----

export interface Question {
  id: string
  dailyTask: string | null
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
  starred: boolean
  solvedAt?: string
  reviewCount: number
  nextReviewAt?: string
  lastReviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionBody {
  dailyTaskId: string
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
  dailyTask?: string
  status?: QuestionStatus
  difficulty?: Difficulty
  topic?: string
  source?: string
  tag?: string
  starred?: boolean
  backlog?: 'true' | 'all'
  page?: number
  limit?: number
}

export interface PaginatedQuestions {
  data: Question[]
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

// ---- Revisions ----

export interface Revision {
  notes?: string
  solution?: string
  editedAt: string
}

export interface RevisionsResponse {
  current: { notes?: string; solution?: string }
  revisions: Revision[]
}

// ---- Deduplication ----

export interface DeduplicateResponse {
  message: string
  deleted: number
  groups: { title: string; kept: string; deleted: string[] }[]
}

// ---- API ----

export const questionsApi = {
  getAll: async (filter?: QuestionsFilter) => {
    const params = new URLSearchParams()
    if (filter?.task) params.set('task', filter.task)
    if (filter?.dailyTask) params.set('dailyTask', filter.dailyTask)
    if (filter?.status) params.set('status', filter.status)
    if (filter?.difficulty) params.set('difficulty', filter.difficulty)
    if (filter?.topic) params.set('topic', filter.topic)
    if (filter?.source) params.set('source', filter.source)
    if (filter?.tag) params.set('tag', filter.tag)
    if (filter?.starred) params.set('starred', 'true')
    if (filter?.backlog) params.set('backlog', filter.backlog)
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions${query}`)
  },

  getById: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}`),

  create: async (body: CreateQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: async (id: string, body: UpdateQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: async (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
    }),

  solve: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/solve`, {
      method: 'PATCH',
    }),

  reset: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/reset`, {
      method: 'PATCH',
    }),

  star: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/star`, {
      method: 'PATCH',
    }),

  review: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/review`, {
      method: 'PATCH',
    }),

  getRevisions: async (id: string) =>
    apiFetch<RevisionsResponse>(`${API_BASE_URL}/questions/${id}/revisions`),

  getDueForReview: async (filters?: { topic?: string; difficulty?: Difficulty; page?: number; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters?.topic) params.set('topic', filters.topic)
    if (filters?.difficulty) params.set('difficulty', filters.difficulty)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const query = params.toString() ? `?${params}` : ''
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/due-for-review${query}`)
  },

  search: async (q: string, filters?: { status?: QuestionStatus; difficulty?: Difficulty; page?: number; limit?: number }) => {
    const params = new URLSearchParams({ q })
    if (filters?.status) params.set('status', filters.status)
    if (filters?.difficulty) params.set('difficulty', filters.difficulty)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/search?${params}`)
  },

  getTags: async () =>
    apiFetch<TagCount[]>(`${API_BASE_URL}/questions/tags`),

  getTopics: async (category?: PrepCategory) => {
    const query = category ? `?category=${category}` : ''
    return apiFetch<TopicCount[]>(`${API_BASE_URL}/questions/topics${query}`)
  },

  getSources: async () =>
    apiFetch<SourceCount[]>(`${API_BASE_URL}/questions/sources`),

  bulkDelete: async (ids: string[]) =>
    apiFetch<{ message: string; deletedCount: number }>(`${API_BASE_URL}/questions/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  deduplicate: async () =>
    apiFetch<DeduplicateResponse>(`${API_BASE_URL}/questions/deduplicate`, {
      method: 'POST',
    }),

  // ---- Backlog ----

  getBacklog: async (filter?: Omit<QuestionsFilter, 'task' | 'dailyTask' | 'backlog'>) => {
    const params = new URLSearchParams()
    if (filter?.status) params.set('status', filter.status)
    if (filter?.difficulty) params.set('difficulty', filter.difficulty)
    if (filter?.topic) params.set('topic', filter.topic)
    if (filter?.source) params.set('source', filter.source)
    if (filter?.tag) params.set('tag', filter.tag)
    if (filter?.starred) params.set('starred', 'true')
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))
    const query = params.toString() ? `?${params}` : ''
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/backlog${query}`)
  },

  createBacklog: async (body: CreateBacklogQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/backlog`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  moveToDailyTask: async (id: string, dailyTaskId: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ dailyTaskId }),
    }),

  bulkMove: async (questionIds: string[], dailyTaskId: string) =>
    apiFetch<{ movedCount: number; skippedCount: number }>(`${API_BASE_URL}/questions/bulk-move`, {
      method: 'POST',
      body: JSON.stringify({ questionIds, dailyTaskId }),
    }),
}
