import type {
  OverviewResponse,
  CategoryBreakdown,
  DifficultyBreakdown,
  StreaksResponse,
} from '@api/stats'

export const MOCK_OVERVIEW: OverviewResponse = {
  total: 35,
  backlogCount: 8,
  byStatus: { solved: 15, in_progress: 12, pending: 8 },
  byCategory: { dsa: 30, system_design: 10, behavioral: 10 },
  byDifficulty: { easy: 25, medium: 15, hard: 10 },
}

export const MOCK_CATEGORIES: CategoryBreakdown[] = [
  { category: 'dsa', total: 30, solved: 25, in_progress: 3, pending: 2, completionRate: 83 },
  { category: 'system_design', total: 10, solved: 5, in_progress: 3, pending: 2, completionRate: 50 },
  { category: 'behavioral', total: 10, solved: 9, in_progress: 1, pending: 0, completionRate: 90 },
]

export const MOCK_DIFFICULTIES: DifficultyBreakdown[] = [
  { difficulty: 'easy', total: 25, solved: 20, in_progress: 3, pending: 2, completionRate: 80 },
  { difficulty: 'medium', total: 15, solved: 10, in_progress: 3, pending: 2, completionRate: 67 },
  { difficulty: 'hard', total: 10, solved: 5, in_progress: 3, pending: 2, completionRate: 50 },
]

export const MOCK_STREAKS: StreaksResponse = {
  currentStreak: 5,
  longestStreak: 12,
  totalActiveDays: 28,
}
