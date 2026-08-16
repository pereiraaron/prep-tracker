import { API_BASE_URL, apiFetch } from "./client";
import type { Difficulty, PrepCategory } from "./types";

// ---- Enums ----

export type QuestionStatus = "pending" | "solved";
export type QuestionSource =
  | "leetcode"
  | "greatfrontend"
  | "minichallenges"
  | "geeksforgeeks"
  | "linkedin"
  | "medium"
  | "namastedsa"
  | "fmc"
  | "other";

// ---- Solution ----

export interface Solution {
  label?: string;
  content: string;
}

// ---- Question ----

/** Fields included in list/search/backlog responses */
export interface QuestionListItem {
  id: string;
  userId: string;
  category: PrepCategory | null;
  title: string;
  status: QuestionStatus;
  difficulty?: Difficulty;
  topics: string[];
  source?: QuestionSource;
  url?: string;
  tags: string[];
  companyTags: string[];
  starred: boolean;
  solvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Full question from GET /questions/:id */
export interface Question extends QuestionListItem {
  notes?: string;
  solutions?: Solution[];
}

export interface SuggestionsResponse {
  topicsByCategory: Record<string, string[]>;
  tagsByCategory: Record<string, string[]>;
  tags: string[];
  companyTags: string[];
}

export interface CreateQuestionBody {
  title: string;
  solutions?: Solution[];
  category: PrepCategory;
  notes?: string;
  difficulty?: Difficulty;
  topics?: string[];
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
  topics?: string[];
  source?: QuestionSource;
  tags?: string[];
  companyTags?: string[];
}

export interface UpdateQuestionBody {
  title?: string;
  notes?: string;
  solutions?: Solution[];
  difficulty?: Difficulty | null;
  topics?: string[] | null;
  source?: QuestionSource | null;
  url?: string;
  tags?: string[];
  companyTags?: string[];
  category?: PrepCategory | null;
}

export interface SolveQuestionBody {
  solutions?: Solution[];
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
  data: QuestionListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ListQueryParams = QuestionsFilter & { search?: string };

type SearchFilters = {
  status?: QuestionStatus;
  difficulty?: Difficulty;
  category?: PrepCategory;
  sort?: string;
  page?: number;
  limit?: number;
};

const buildFilterParams = (filter?: QuestionsFilter, opts?: { includeBacklog?: boolean }) => {
  const params = new URLSearchParams();
  if (filter?.category) params.set("category", filter.category);
  if (filter?.status) params.set("status", filter.status);
  if (filter?.difficulty) params.set("difficulty", filter.difficulty);
  if (filter?.topic) params.set("topic", filter.topic);
  if (filter?.source) params.set("source", filter.source);
  if (filter?.tag) params.set("tag", filter.tag);
  if (filter?.companyTag) params.set("companyTag", filter.companyTag);
  if (filter?.starred) params.set("starred", "true");
  if (opts?.includeBacklog && filter?.backlog) params.set("backlog", filter.backlog);
  if (filter?.solvedAfter) params.set("solvedAfter", filter.solvedAfter);
  if (filter?.solvedBefore) params.set("solvedBefore", filter.solvedBefore);
  if (filter?.createdAfter) params.set("createdAfter", filter.createdAfter);
  if (filter?.createdBefore) params.set("createdBefore", filter.createdBefore);
  if (filter?.sort) params.set("sort", filter.sort);
  if (filter?.page) params.set("page", String(filter.page));
  if (filter?.limit) params.set("limit", String(filter.limit));
  return params;
};

// ---- API ----

export const questionsApi = {
  getAll: async (filter?: QuestionsFilter, init?: RequestInit) => {
    const params = buildFilterParams(filter, { includeBacklog: true });
    const query = params.toString() ? `?${params}` : "";
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions${query}`, init);
  },

  getById: async (id: string, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}`, init),

  create: async (body: CreateQuestionBody, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions`, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: async (id: string, body: UpdateQuestionBody, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}`, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: async (id: string, init?: RequestInit) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/questions/${id}`, {
      ...init,
      method: "DELETE",
    }),

  solve: async (id: string, body?: SolveQuestionBody, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/solve`, {
      ...init,
      method: "PATCH",
      ...(body?.solutions?.length ? { body: JSON.stringify(body) } : {}),
    }),

  reset: async (id: string, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/reset`, {
      ...init,
      method: "PATCH",
    }),

  star: async (id: string, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/${id}/star`, {
      ...init,
      method: "PATCH",
    }),

  search: async (q: string, filters?: SearchFilters, init?: RequestInit) => {
    const params = new URLSearchParams({ q });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.difficulty) params.set("difficulty", filters.difficulty);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/search?${params}`, init);
  },

  bulkDelete: async (ids: string[], init?: RequestInit) =>
    apiFetch<{ message: string; deletedCount: number }>(`${API_BASE_URL}/questions/bulk-delete`, {
      ...init,
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  // ---- Backlog ----

  getBacklog: async (filter?: Omit<QuestionsFilter, "backlog">, init?: RequestInit) => {
    const params = buildFilterParams(filter);
    const query = params.toString() ? `?${params}` : "";
    return apiFetch<PaginatedQuestions>(`${API_BASE_URL}/questions/backlog${query}`, init);
  },

  createBacklog: async (body: CreateBacklogQuestionBody, init?: RequestInit) =>
    apiFetch<Question>(`${API_BASE_URL}/questions/backlog`, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ---- Suggestions ----

  getSuggestions: async (init?: RequestInit) =>
    apiFetch<SuggestionsResponse>(`${API_BASE_URL}/questions/suggestions`, init),
};

/** Shared list fetcher — search vs getAll in one place for list/infinite/prefetch. */
export const fetchQuestionsList = (
  params: ListQueryParams = {},
  init?: RequestInit,
): Promise<PaginatedQuestions> => {
  const { search, ...filter } = params;
  if (search) {
    return questionsApi.search(
      search,
      {
        status: filter.status,
        difficulty: filter.difficulty,
        category: filter.category,
        sort: filter.sort,
        page: filter.page,
        limit: filter.limit,
      },
      init,
    );
  }
  return questionsApi.getAll(filter, init);
};

/** Shared backlog fetcher — search (pending) vs getBacklog. */
export const fetchBacklogList = (
  params: ListQueryParams = {},
  init?: RequestInit,
): Promise<PaginatedQuestions> => {
  const { search, ...filter } = params;
  if (search) {
    return questionsApi.search(
      search,
      {
        status: "pending",
        difficulty: filter.difficulty,
        category: filter.category,
        sort: filter.sort,
        page: filter.page,
        limit: filter.limit,
      },
      init,
    );
  }
  return questionsApi.getBacklog(filter, init);
};
