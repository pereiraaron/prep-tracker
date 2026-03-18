import { API_BASE_URL, apiFetch } from "./client";
import type { Difficulty, PrepCategory } from "./types";

// ---- Enums ----

export type QuestionStatus = "pending" | "solved";
export type QuestionSource = "leetcode" | "greatfrontend" | "minichallenges" | "geeksforgeeks" | "linkedin" | "medium" | "other";

// ---- Question ----

export interface Question {
  id: string;
  userId: string;
  category: PrepCategory | null;
  title: string;
  notes?: string;
  solution?: string;
  status: QuestionStatus;
  difficulty?: Difficulty;
  topic?: string;
  source?: QuestionSource;
  url?: string;
  tags: string[];
  companyTags: string[];
  starred: boolean;
  solvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionBody {
  title: string;
  solution: string;
  category: PrepCategory;
  notes?: string;
  difficulty?: Difficulty;
  topic?: string;
  source?: QuestionSource;
  url?: string;
  tags?: string[];
  companyTags?: string[];
}

export interface CreateBacklogQuestionBody {
  title: string;
  category: PrepCategory;
  url: string;
  notes?: string;
  difficulty?: Difficulty;
  topic?: string;
  source?: QuestionSource;
  tags?: string[];
  companyTags?: string[];
}

export interface UpdateQuestionBody {
  title?: string;
  notes?: string;
  solution?: string;
  difficulty?: Difficulty | null;
  topic?: string | null;
  source?: QuestionSource | null;
  url?: string;
  tags?: string[];
  companyTags?: string[];
  category?: PrepCategory | null;
}

export interface QuestionsFilter {
  category?: PrepCategory;
  status?: QuestionStatus;
  difficulty?: Difficulty;
  topic?: string;
  source?: string;
  tag?: string;
  companyTag?: string;
  starred?: boolean;
  backlog?: "true" | "all";
  solvedAfter?: string;
  solvedBefore?: string;
  createdAfter?: string;
  createdBefore?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedQuestions {
  data: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ---- API ----

export const questionsApi = {
  getAll: async (filter?: QuestionsFilter) => {
    const params = new URLSearchParams();
    if (filter?.category) params.set("category", filter.category);
    if (filter?.status) params.set("status", filter.status);
    if (filter?.difficulty) params.set("difficulty", filter.difficulty);
    if (filter?.topic) params.set("topic", filter.topic);
    if (filter?.source) params.set("source", filter.source);
    if (filter?.tag) params.set("tag", filter.tag);
    if (filter?.companyTag) params.set("companyTag", filter.companyTag);
    if (filter?.starred) params.set("starred", "true");
    if (filter?.backlog) params.set("backlog", filter.backlog);
    if (filter?.solvedAfter) params.set("solvedAfter", filter.solvedAfter);
    if (filter?.solvedBefore) params.set("solvedBefore", filter.solvedBefore);
    if (filter?.createdAfter) params.set("createdAfter", filter.createdAfter);
    if (filter?.createdBefore) params.set("createdBefore", filter.createdBefore);
    if (filter?.sort) params.set("sort", filter.sort);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const query = params.toString() ? `?${params}` : "";
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions${query}`);
  },

  getById: async (id: string) => apiFetch<Question>(`${API_BASE_URL}/questions/${id}`),

  create: async (body: CreateQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: async (id: string, body: UpdateQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: async (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/questions/${id}`, {
      method: "DELETE",
    }),

  solve: async (id: string, body?: { solution: string }) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/solve`, {
      method: "PATCH",
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),

  reset: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/reset`, {
      method: "PATCH",
    }),

  star: async (id: string) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/star`, {
      method: "PATCH",
    }),

  search: async (
    q: string,
    filters?: {
      status?: QuestionStatus;
      difficulty?: Difficulty;
      category?: PrepCategory;
      page?: number;
      limit?: number;
    }
  ) => {
    const params = new URLSearchParams({ q });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.difficulty) params.set("difficulty", filters.difficulty);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/search?${params}`);
  },

  bulkDelete: async (ids: string[]) =>
    apiFetch<{ message: string; deletedCount: number }>(`${API_BASE_URL}/questions/bulk-delete`, {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  // ---- Backlog ----

  getBacklog: async (filter?: Omit<QuestionsFilter, "backlog">) => {
    const params = new URLSearchParams();
    if (filter?.category) params.set("category", filter.category);
    if (filter?.status) params.set("status", filter.status);
    if (filter?.difficulty) params.set("difficulty", filter.difficulty);
    if (filter?.topic) params.set("topic", filter.topic);
    if (filter?.source) params.set("source", filter.source);
    if (filter?.tag) params.set("tag", filter.tag);
    if (filter?.companyTag) params.set("companyTag", filter.companyTag);
    if (filter?.starred) params.set("starred", "true");
    if (filter?.sort) params.set("sort", filter.sort);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const query = params.toString() ? `?${params}` : "";
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/backlog${query}`);
  },

  createBacklog: async (body: CreateBacklogQuestionBody) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/backlog`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
