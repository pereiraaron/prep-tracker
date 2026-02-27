import { useCallback, useEffect, useState } from 'react'
import { statsApi, type TopicBreakdown } from '@api/stats'
import { PREP_CATEGORIES } from '@api/types'
import type { PrepCategory } from '@api/types'
import Card from '@components/Card'
import ProgressBar from '@components/ProgressBar'

const TopicBreakdownSection = () => {
  const [category, setCategory] = useState('')
  const [topics, setTopics] = useState<TopicBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTopics = useCallback(async () => {
    setLoading(true)
    try {
      const data = await statsApi.getTopicBreakdown(
        category ? (category as PrepCategory) : undefined,
      )
      setTopics(data)
    } catch {
      setTopics([])
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  return (
    <div>
      <div className="flex justify-between items-center mb-3 gap-2">
        <h3 className="text-sm font-semibold">Topic Breakdown</h3>
        <select
          className="select-base w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {PREP_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <Card>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--muted) border-t-(--color-primary)" />
          </div>
        ) : topics.length === 0 ? (
          <p className="text-sm text-(--muted-foreground)">
            No topic data available
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {topics.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {t.topic}
                  </span>
                  <span className="text-sm text-(--muted-foreground)">
                    {t.solved}/{t.total}
                  </span>
                </div>
                <ProgressBar value={t.completionRate} color="var(--color-primary)" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default TopicBreakdownSection
