import { create } from 'zustand'
import { tasksApi } from '@api/tasks'
import type {
  Task,
  CreateTaskBody,
  UpdateTaskBody,
  TasksFilter,
  PaginatedTasks,
  TodayResponse,
} from '@api/tasks'

interface TaskState {
  tasks: Task[]
  pagination: PaginatedTasks['pagination'] | null
  today: TodayResponse | null
  isLoading: boolean
  error: string | null

  fetchTasks: (filter?: TasksFilter) => Promise<void>
  createTask: (body: CreateTaskBody) => Promise<Task>
  updateTask: (id: string, body: UpdateTaskBody) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  fetchToday: () => Promise<void>
  clearError: () => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  pagination: null,
  today: null,
  isLoading: false,
  error: null,

  fetchTasks: async (filter?: TasksFilter) => {
    set({ isLoading: true, error: null })
    try {
      const { tasks, pagination } = await tasksApi.getAll(filter)
      set({ tasks, pagination, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
      })
    }
  },

  createTask: async (body) => {
    set({ isLoading: true, error: null })
    try {
      const created = await tasksApi.create(body)
      set((state) => ({
        tasks: [created, ...state.tasks],
        isLoading: false,
      }))
      return created
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create task',
      })
      throw err
    }
  },

  updateTask: async (id, body) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await tasksApi.update(id, body)
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
        isLoading: false,
      }))
      return updated
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update task',
      })
      throw err
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await tasksApi.delete(id)
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        isLoading: false,
      }))
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to delete task',
      })
      throw err
    }
  },

  fetchToday: async () => {
    set({ isLoading: true, error: null })
    try {
      const today = await tasksApi.getToday()
      set({ today, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch today's tasks",
      })
    }
  },

  clearError: () => set({ error: null }),
}))
