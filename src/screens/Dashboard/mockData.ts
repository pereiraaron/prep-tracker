import type { TodayResponse } from '@api/tasks'
import type { StreaksResponse } from '@api/stats'

export const MOCK_TODAY: TodayResponse = {
  date: new Date().toISOString(),
  summary: {
    total: 3,
    completed: 1,
    incomplete: 0,
    in_progress: 1,
    pending: 1,
  },
  groups: [
    {
      category: 'dsa',
      summary: { total: 1, completed: 0, incomplete: 0, in_progress: 1, pending: 0 },
      instances: [
        {
          _id: 'mock-inst-1',
          task: 'mock-task-1',
          userId: 'mock-user',
          date: new Date().toISOString(),
          taskName: 'Daily DSA Practice',
          category: 'dsa',
          targetQuestionCount: 3,
          addedQuestionCount: 2,
          solvedQuestionCount: 1,
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      category: 'system_design',
      summary: { total: 1, completed: 1, incomplete: 0, in_progress: 0, pending: 0 },
      instances: [
        {
          _id: 'mock-inst-2',
          task: 'mock-task-2',
          userId: 'mock-user',
          date: new Date().toISOString(),
          taskName: 'System Design Weekly',
          category: 'system_design',
          targetQuestionCount: 2,
          addedQuestionCount: 2,
          solvedQuestionCount: 2,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      category: 'behavioral',
      summary: { total: 1, completed: 0, incomplete: 0, in_progress: 0, pending: 1 },
      instances: [
        {
          _id: 'mock-inst-3',
          task: 'mock-task-3',
          userId: 'mock-user',
          date: new Date().toISOString(),
          taskName: 'Behavioral Prep',
          category: 'behavioral',
          targetQuestionCount: 1,
          addedQuestionCount: 0,
          solvedQuestionCount: 0,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ],
}

export const MOCK_STREAKS: StreaksResponse = {
  currentStreak: 5,
  longestStreak: 12,
  totalActiveDays: 28,
}
