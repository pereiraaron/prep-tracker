import { create } from "zustand";
import {
  questionsApi,
  type Question,
  type CreateBacklogQuestionBody,
} from "@api/questions";
import type { PrepCategory } from "@api/types";
import { useStatsStore } from "./useStatsStore";

interface BacklogState {
  items: Question[];
  isLoading: boolean;
  error: string | null;
  creating: boolean;

  fetchBacklog: () => Promise<void>;
  createBacklogItem: (body: CreateBacklogQuestionBody) => Promise<void>;
  deleteBacklogItem: (id: string) => Promise<void>;
  starBacklogItem: (id: string) => Promise<void>;
  solveBacklogItem: (id: string, category: PrepCategory) => Promise<void>;
  reset: () => void;
}

export const useBacklogStore = create<BacklogState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  creating: false,

  fetchBacklog: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await questionsApi.getBacklog({ limit: 100 });
      set({ items: result.data, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load backlog",
      });
    }
  },

  createBacklogItem: async (body) => {
    set({ creating: true });
    try {
      await questionsApi.createBacklog(body);
      set({ creating: false });
      get().fetchBacklog();
      useStatsStore.getState().fetchOverview();
    } catch (err) {
      set({ creating: false });
      throw err;
    }
  },

  deleteBacklogItem: async (id) => {
    await questionsApi.delete(id);
    get().fetchBacklog();
    useStatsStore.getState().fetchOverview();
  },

  starBacklogItem: async (id) => {
    try {
      const updated = await questionsApi.star(id);
      set((state) => ({
        items: state.items.map((q) =>
          q.id === id ? { ...q, starred: updated.starred } : q,
        ),
      }));
    } catch {
      // silent
    }
  },

  solveBacklogItem: async (id, category) => {
    await questionsApi.update(id, { category });
    await questionsApi.solve(id);
    get().fetchBacklog();
    useStatsStore.getState().fetchOverview();
  },

  reset: () =>
    set({ items: [], isLoading: false, error: null, creating: false }),
}));
