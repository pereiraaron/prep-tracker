import { useState } from 'react'
import type { CreateBacklogQuestionBody, QuestionSource } from '@api/questions'
import type { Difficulty } from '@api/types'
import { DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import Input from '@components/Input'

interface BacklogFormProps {
  onSubmit: (body: CreateBacklogQuestionBody) => Promise<void>
  onCancel: () => void
}

const BacklogForm = ({ onSubmit, onCancel }: BacklogFormProps) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        title: title.trim(),
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(topic.trim() ? { topic: topic.trim() } : {}),
        ...(source ? { source: source as QuestionSource } : {}),
        ...(url.trim() ? { url: url.trim() } : {}),
        ...(tags.trim()
          ? { tags: tags.split(',').map((t) => t.trim()).filter(Boolean) }
          : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-3 md:p-4 glass-card rounded-lg"
    >
      <div className="flex flex-col gap-3">
        <Input
          label="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Difficulty</p>
            <select
              className="select-base"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">None</option>
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Source</p>
            <select
              className="select-base"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">None</option>
              {QUESTION_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium mb-1">Notes</p>
          <textarea
            className="textarea-base"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Add notes..."
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" className="btn-ghost text-sm" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary text-sm" disabled={saving}>
            {saving ? 'Adding...' : 'Add to Backlog'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default BacklogForm
