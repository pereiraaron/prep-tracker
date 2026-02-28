import { create } from "zustand";
import {
  questionsApi,
  type Question,
  type PaginatedQuestions,
  type QuestionsFilter,
  type CreateQuestionBody,
  type UpdateQuestionBody,
} from "@api/questions";
import { useStatsStore } from "./useStatsStore";

interface FetchParams extends QuestionsFilter {
  search?: string;
}

interface QuestionsState {
  questions: Question[];
  pagination: PaginatedQuestions["pagination"] | null;
  listLoading: boolean;
  listError: string | null;

  currentQuestion: Question | null;
  detailLoading: boolean;
  detailError: string | null;

  recentSolved: Question[];
  recentLoading: boolean;

  mutating: boolean;

  fetchQuestions: (params: FetchParams) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  fetchRecent: () => Promise<void>;
  createQuestion: (body: CreateQuestionBody) => Promise<void>;
  updateQuestion: (id: string, body: UpdateQuestionBody) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  starQuestion: (id: string) => Promise<void>;
  reset: () => void;
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  questions: [],
  pagination: null,
  listLoading: false,
  listError: null,

  currentQuestion: null,
  detailLoading: false,
  detailError: null,

  recentSolved: [],
  recentLoading: false,

  mutating: false,

  fetchQuestions: async ({ search, ...filter }) => {
    set({ listLoading: true, listError: null });
    try {
      const result = search
        ? await questionsApi.search(search, {
            difficulty: filter.difficulty,
            page: filter.page,
            limit: filter.limit,
          })
        : await questionsApi.getAll(filter);
      set({
        questions: result.data,
        pagination: result.pagination,
        listLoading: false,
      });
    } catch (err) {
      set({
        listLoading: false,
        listError:
          err instanceof Error ? err.message : "Failed to load questions",
      });
    }
  },

  fetchById: async (id) => {
    set({ detailLoading: true, detailError: null });
    try {
      const question = await questionsApi.getById(id);
      set({ currentQuestion: question, detailLoading: false });
    } catch (err) {
      set({
        detailLoading: false,
        detailError:
          err instanceof Error ? err.message : "Failed to load question",
      });
    }
  },

  fetchRecent: async () => {
    set({ recentLoading: true });
    try {
      const result = await questionsApi.getAll({
        sort: "-solvedAt",
        limit: 5,
        status: "solved",
      });
      set({ recentSolved: result.data, recentLoading: false });
    } catch {
      set({ recentLoading: false });
    }
  },

  createQuestion: async (body) => {
    set({ mutating: true });
    try {
      await questionsApi.create(body);
      set({ mutating: false });
      useStatsStore.getState().fetchOverview();
    } catch (err) {
      set({ mutating: false });
      throw err;
    }
  },

  updateQuestion: async (id, body) => {
    set({ mutating: true });
    try {
      const updated = await questionsApi.update(id, body);
      set({ currentQuestion: updated, mutating: false });
    } catch (err) {
      set({ mutating: false });
      throw err;
    }
  },

  deleteQuestion: async (id) => {
    await questionsApi.delete(id);
    useStatsStore.getState().fetchOverview();
  },

  starQuestion: async (id) => {
    try {
      const updated = await questionsApi.star(id);
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === id ? { ...q, starred: updated.starred } : q,
        ),
        currentQuestion:
          state.currentQuestion?.id === id
            ? { ...state.currentQuestion, starred: updated.starred }
            : state.currentQuestion,
      }));
    } catch {
      // silent
    }
  },

  reset: () =>
    set({
      questions: [],
      pagination: null,
      listLoading: false,
      listError: null,
      currentQuestion: null,
      detailLoading: false,
      detailError: null,
      recentSolved: [],
      recentLoading: false,
      mutating: false,
    }),
}));
