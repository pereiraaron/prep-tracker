import { useCallback, useEffect, useState } from 'react'
import {
  LuArrowLeft,
  LuStar,
  LuExternalLink,
  LuPencil,
  LuSave,
  LuX,
  LuCalendar,
  LuGlobe,
  LuFileText,
  LuBookOpen,
  LuStickyNote,
  LuTag,
  LuBuilding2,
} from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { questionsApi } from '@api/questions'
import type { Question } from '@api/questions'
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  DIFFICULTY_COLOR,
  SOURCE_LABEL,
} from '@api/types'
import PageContainer from '@components/PageContainer'
import Card from '@components/Card'

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

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Edit state
  const [editing, setEditing] = useState(false)
  const [editSolution, setEditSolution] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchQuestion = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const q = await questionsApi.getById(id)
      setQuestion(q)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  const handleStar = async () => {
    if (!question || !id) return
    setQuestion({ ...question, starred: !question.starred })
    try {
      await questionsApi.star(id)
    } catch {
      setQuestion({ ...question, starred: question.starred })
    }
  }

  const startEditing = () => {
    if (!question) return
    setEditSolution(question.solution || '')
    setEditNotes(question.notes || '')
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await questionsApi.update(id, {
        solution: editSolution || undefined,
        notes: editNotes || undefined,
      })
      setQuestion(updated)
      setEditing(false)
    } catch {
      // stay in edit mode
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--muted) border-t-(--color-primary)" />
        </div>
      </PageContainer>
    )
  }

  if (notFound || !question) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-(--muted-foreground) text-lg">Question not found</p>
          <button className="btn-outline text-sm" onClick={() => navigate('/questions')}>
            Back to Questions
          </button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Back */}
      <button
        className="btn-ghost text-sm mb-6"
        onClick={() => navigate(-1)}
      >
        <LuArrowLeft /> Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-bold leading-tight">
            {question.title}
          </h1>
          <div className="flex gap-2 mt-3 flex-wrap">
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
            {question.status === 'solved' && (
              <span
                className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium"
                style={{
                  color: '#22c55e',
                  borderColor: '#22c55e33',
                  backgroundColor: '#22c55e11',
                }}
              >
                Solved
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          {question.url && (
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-(--border) hover:bg-(--secondary) transition-colors inline-flex items-center justify-center"
            >
              <LuExternalLink size={16} />
            </a>
          )}
          <button
            aria-label={question.starred ? 'Unstar' : 'Star'}
            className="p-1.5 rounded-lg border border-(--border) hover:bg-(--secondary) transition-colors"
            style={{ color: question.starred ? '#eab308' : undefined }}
            onClick={handleStar}
          >
            <LuStar size={16} fill={question.starred ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`text-sm ${editing ? 'btn-primary' : 'btn-outline'}`}
            onClick={editing ? cancelEditing : startEditing}
          >
            {editing ? <><LuX /> Editing</> : <><LuPencil /> Edit</>}
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main content */}
        <div className="flex flex-col gap-6">
          {/* Solution */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-purple-500"><LuBookOpen size={16} /></span>
              <h2 className="text-sm font-bold">Solution</h2>
            </div>
            {editing ? (
              <textarea
                className="textarea-base font-mono text-sm"
                value={editSolution}
                onChange={(e) => setEditSolution(e.target.value)}
                rows={12}
                placeholder="Write your solution..."
              />
            ) : question.solution ? (
              <div className="bg-(--muted) rounded-lg p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {question.solution}
              </div>
            ) : (
              <p className="text-sm text-(--muted-foreground) italic">
                No solution yet. Click Edit to add one.
              </p>
            )}
          </Card>

          {/* Notes */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500"><LuStickyNote size={16} /></span>
              <h2 className="text-sm font-bold">Notes</h2>
            </div>
            {editing ? (
              <>
                <textarea
                  className="textarea-base text-sm"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={5}
                  placeholder="Personal notes, edge cases, tips..."
                />
                <div className="flex gap-2 mt-4 justify-end">
                  <button className="btn-ghost text-sm" onClick={cancelEditing}>
                    <LuX /> Cancel
                  </button>
                  <button
                    className="btn-primary text-sm"
                    disabled={saving}
                    onClick={handleSave}
                  >
                    {saving ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <LuSave />
                    )}
                    Save Changes
                  </button>
                </div>
              </>
            ) : question.notes ? (
              <p className="text-sm leading-relaxed">
                {question.notes}
              </p>
            ) : (
              <p className="text-sm text-(--muted-foreground) italic">
                No notes yet. Click Edit to add some.
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Details */}
          <Card>
            <h2 className="text-sm font-bold mb-4">Details</h2>
            <div className="flex flex-col gap-3">
              {question.topic && (
                <div className="flex items-center gap-3 text-sm">
                  <LuFileText size={14} className="text-(--muted-foreground)" />
                  <span className="text-(--muted-foreground)">Topic</span>
                  <span className="ml-auto font-medium">{question.topic}</span>
                </div>
              )}
              {question.source && (
                <div className="flex items-center gap-3 text-sm">
                  <LuGlobe size={14} className="text-(--muted-foreground)" />
                  <span className="text-(--muted-foreground)">Source</span>
                  <span className="ml-auto font-mono text-xs">
                    {SOURCE_LABEL[question.source] || question.source}
                  </span>
                </div>
              )}
              {question.solvedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <LuCalendar size={14} className="text-(--muted-foreground)" />
                  <span className="text-(--muted-foreground)">Solved</span>
                  <span className="ml-auto text-xs">
                    {new Date(question.solvedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <LuCalendar size={14} className="text-(--muted-foreground)" />
                <span className="text-(--muted-foreground)">Created</span>
                <span className="ml-auto text-xs">
                  {new Date(question.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {question.tags.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <LuTag size={14} className="text-(--muted-foreground)" />
                <h2 className="text-sm font-bold">Tags</h2>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Company Tags */}
          {question.companyTags.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <LuBuilding2 size={14} className="text-(--muted-foreground)" />
                <h2 className="text-sm font-bold">Companies</h2>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {question.companyTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default QuestionDetail
