import { create } from 'zustand'
import { entriesApi } from '@api/entries'
import type {
  Entry,
  CreateEntryBody,
  UpdateEntryBody,
  EntriesFilter,
  PaginatedEntries,
  TodayResponse,
  UpdateTaskStatusBody,
  TaskCompletion,
} from '@api/entries'

interface EntryState {
  entries: Entry[]
  pagination: PaginatedEntries['pagination'] | null
  today: TodayResponse | null
  isLoading: boolean
  error: string | null

  fetchEntries: (filter?: EntriesFilter) => Promise<void>
  createEntry: (body: CreateEntryBody) => Promise<Entry>
  updateEntry: (id: string, body: UpdateEntryBody) => Promise<Entry>
  deleteEntry: (id: string) => Promise<void>
  fetchToday: () => Promise<void>
  updateTaskStatus: (body: UpdateTaskStatusBody) => Promise<TaskCompletion>
  clearError: () => void
}

export const useEntryStore = create<EntryState>((set) => ({
  entries: [],
  pagination: null,
  today: null,
  isLoading: false,
  error: null,

  fetchEntries: async (filter?: EntriesFilter) => {
    set({ isLoading: true, error: null })
    try {
      const { entries, pagination } = await entriesApi.getAll(filter)
      set({ entries, pagination, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch entries',
      })
    }
  },

  createEntry: async (body) => {
    set({ isLoading: true, error: null })
    try {
      const created = await entriesApi.create(body)
      set((state) => ({
        entries: [created, ...state.entries],
        isLoading: false,
      }))
      return created
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create entry',
      })
      throw err
    }
  },

  updateEntry: async (id, body) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await entriesApi.update(id, body)
      set((state) => ({
        entries: state.entries.map((e) => (e._id === id ? updated : e)),
        isLoading: false,
      }))
      return updated
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update entry',
      })
      throw err
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await entriesApi.delete(id)
      set((state) => ({
        entries: state.entries.filter((e) => e._id !== id),
        isLoading: false,
      }))
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete entry',
      })
      throw err
    }
  },

  fetchToday: async () => {
    set({ isLoading: true, error: null })
    try {
      const today = await entriesApi.getToday()
      set({ today, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch today's tasks",
      })
    }
  },

  updateTaskStatus: async (body) => {
    set({ error: null })
    try {
      const completion = await entriesApi.updateTaskStatus(body)
      return completion
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update task status',
      })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
