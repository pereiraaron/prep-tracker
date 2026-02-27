import { useState } from 'react'
import { LuArrowLeft, LuSave } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { questionsApi } from '@api/questions'
import type { CreateQuestionBody, QuestionSource } from '@api/questions'
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import type { PrepCategory, Difficulty } from '@api/types'
import PageContainer from '@components/PageContainer'
import Card from '@components/Card'
import Input from '@components/Input'
import TagInput from '@components/TagInput'

const QuestionForm = () => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [solution, setSolution] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [source, setSource] = useState('')
  const [topic, setTopic] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [companyTags, setCompanyTags] = useState<string[]>([])

  const canSubmit = title.trim() && solution.trim() && category

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!canSubmit) {
      setError('Title, solution, and category are required')
      return
    }
    setSaving(true)
    try {
      const body: CreateQuestionBody = {
        title,
        solution,
        category: category as PrepCategory,
        difficulty: difficulty ? (difficulty as Difficulty) : undefined,
        source: source ? (source as QuestionSource) : undefined,
        topic: topic || undefined,
        url: url || undefined,
        notes: notes || undefined,
        tags: tags.length > 0 ? tags : undefined,
        companyTags: companyTags.length > 0 ? companyTags : undefined,
      }
      await questionsApi.create(body)
      navigate('/questions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer>
      <button
        className="btn-ghost text-sm mb-4"
        onClick={() => navigate('/questions')}
      >
        <LuArrowLeft /> Back to Questions
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg md:text-xl font-bold mb-1">
          New Question
        </h1>
        <p className="text-sm text-(--muted-foreground) mb-6">
          Log a solved question
        </p>

        <form onSubmit={handleSubmit}>
          <Card>
            <div className="flex flex-col gap-5">
              <Input
                label="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground) mb-1.5 block">
                  Solution *
                </label>
                <textarea
                  className="textarea-base"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={6}
                  placeholder="Describe your approach, include code snippets..."
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground) mb-1.5 block">
                  Category *
                </label>
                <select
                  className="select-base"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {PREP_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground) mb-1.5 block">
                    Difficulty
                  </label>
                  <select
                    className="select-base"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="">Select</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground) mb-1.5 block">
                    Source
                  </label>
                  <select
                    className="select-base"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="">Select</option>
                    {QUESTION_SOURCES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Arrays, Binary Trees"
              />

              <Input
                label="URL"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />

              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-(--muted-foreground) mb-1.5 block">
                  Notes
                </label>
                <textarea
                  className="textarea-base"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Personal notes, edge cases, tips..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TagInput label="Tags" value={tags} onChange={setTags} placeholder="dp, greedy" />
                <TagInput label="Company Tags" value={companyTags} onChange={setCompanyTags} placeholder="Google, Meta" />
              </div>
            </div>
          </Card>

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit || saving}
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <LuSave />
              )}
              Save Question
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/questions')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}

export default QuestionForm
