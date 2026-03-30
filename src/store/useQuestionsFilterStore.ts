import { create } from "zustand";
import type { PrepCategory, Difficulty } from "@api/types";

interface QuestionsFilterState {
  search: string;
  categoryFilter: PrepCategory | "";
  difficultyFilter: Difficulty | "";
  currentPage: number;
  showFilters: boolean;
  sort: string;
  setSearch: (val: string) => void;
  setCategoryFilter: (val: PrepCategory | "") => void;
  setDifficultyFilter: (val: Difficulty | "") => void;
  setCurrentPage: (page: number) => void;
  setShowFilters: (val: boolean) => void;
  setSort: (val: string) => void;
  clearAll: () => void;
}

export const useQuestionsFilterStore = create<QuestionsFilterState>((set) => ({
  search: "",
  categoryFilter: "",
  difficultyFilter: "",
  currentPage: 1,
  showFilters: false,
  sort: "-solvedAt",
  setSearch: (val) => set({ search: val, currentPage: 1 }),
  setCategoryFilter: (val) => set({ categoryFilter: val, currentPage: 1 }),
  setDifficultyFilter: (val) => set({ difficultyFilter: val, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setShowFilters: (val) => set({ showFilters: val }),
  setSort: (val) => set({ sort: val, currentPage: 1 }),
  clearAll: () => set({ search: "", categoryFilter: "", difficultyFilter: "", currentPage: 1 }),
}));
