import { LuStar, LuTrash2, LuExternalLink } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import type { Question } from '@api/questions'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  DIFFICULTY_COLOR,
  SOURCE_LABEL,
} from '@api/types'

const BADGE_COLOR_MAP: Record<string, string> = {
  purple: '#9333ea',
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  yellow: '#eab308',
  red: '#ef4444',
  gray: '#6b7280',
}

interface QuestionListCardProps {
  question: Question
  onStar: () => void
  onDelete: () => void
}

const QuestionListCard = ({ question, onStar, onDelete }: QuestionListCardProps) => (
  <div
    className="group flex gap-2 md:gap-3 p-3 md:p-4 border border-(--border) rounded-xl bg-(--card) hover:border-purple-500/20 transition-all"
  >
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <Link to={`/questions/${question.id}`}>
          <span className="text-sm font-semibold line-clamp-1 hover:text-purple-500 transition-colors">
            {question.title}
          </span>
        </Link>
        {question.url && (
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-(--muted-foreground) hover:text-(--foreground) shrink-0 inline-flex">
              <LuExternalLink size={14} />
            </span>
          </a>
        )}
      </div>

      <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
        {question.difficulty && (
          <span
            className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{
              color: BADGE_COLOR_MAP[DIFFICULTY_COLOR[question.difficulty]] || '#6b7280',
              borderColor: `${BADGE_COLOR_MAP[DIFFICULTY_COLOR[question.difficulty]] || '#6b7280'}33`,
              backgroundColor: `${BADGE_COLOR_MAP[DIFFICULTY_COLOR[question.difficulty]] || '#6b7280'}11`,
            }}
          >
            {question.difficulty}
          </span>
        )}
        {question.topic && (
          <span className="inline-flex rounded-md border border-(--border) px-2 py-0.5 text-xs font-medium">
            {question.topic}
          </span>
        )}
        {question.category && (
          <span
            className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{
              color: BADGE_COLOR_MAP[CATEGORY_COLOR[question.category]] || '#6b7280',
              borderColor: `${BADGE_COLOR_MAP[CATEGORY_COLOR[question.category]] || '#6b7280'}33`,
              backgroundColor: `${BADGE_COLOR_MAP[CATEGORY_COLOR[question.category]] || '#6b7280'}11`,
            }}
          >
            {CATEGORY_LABEL[question.category] || question.category}
          </span>
        )}
        {question.source && (
          <span className="text-xs text-(--muted-foreground) font-mono">
            {SOURCE_LABEL[question.source] || question.source}
          </span>
        )}
      </div>

      {question.companyTags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {question.companyTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Actions */}
    <div className="flex shrink-0 items-start">
      <button
        aria-label={question.starred ? 'Unstar' : 'Star'}
        className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors"
        style={{ color: question.starred ? '#eab308' : 'var(--muted-foreground)' }}
        onClick={(e) => {
          e.stopPropagation()
          onStar()
        }}
      >
        <LuStar size={14} fill={question.starred ? 'currentColor' : 'none'} />
      </button>
      <button
        aria-label="Delete"
        className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors text-red-500 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <LuTrash2 size={14} />
      </button>
    </div>
  </div>
)

export default QuestionListCard
