import type { PrepCategory } from './entries'

export interface CategoryInfo {
  value: PrepCategory
  label: string
  description: string
}

export const PREP_CATEGORIES: CategoryInfo[] = [
  {
    value: 'dsa',
    label: 'Data Structures & Algorithms',
    description: 'Coding problems, algorithmic thinking, and data structure usage',
  },
  {
    value: 'system_design',
    label: 'System Design',
    description: 'Designing scalable systems, architecture, and trade-off analysis',
  },
  {
    value: 'behavioral',
    label: 'Behavioral',
    description: 'Behavioral and situational interview questions',
  },
  {
    value: 'machine_coding',
    label: 'Machine Coding',
    description: 'Live coding rounds building small applications or features',
  },
  {
    value: 'language_framework',
    label: 'Language & Framework',
    description: 'Language-specific and framework-specific knowledge',
  },
]

export const CATEGORY_LABEL: Record<PrepCategory, string> = Object.fromEntries(
  PREP_CATEGORIES.map((c) => [c.value, c.label])
) as Record<PrepCategory, string>

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const

export const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const
