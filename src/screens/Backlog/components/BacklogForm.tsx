import { useState } from 'react'
import { Box, Flex, Text, Button, VStack, NativeSelect, Textarea } from '@chakra-ui/react'
import type { CreateBacklogQuestionBody, QuestionSource } from '@api/questions'
import type { Difficulty } from '@api/tasks'
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
    <Box
      as="form"
      onSubmit={handleSubmit}
      mb={4}
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      borderColor="border.card"
      borderRadius="lg"
      bg="bg.card"
    >
      <VStack gap={3} align="stretch">
        <Input
          label="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Flex gap={2} direction={{ base: 'column', sm: 'row' }}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={1}>Difficulty</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">None</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={1}>Source</Text>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">None</option>
                {QUESTION_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </Flex>

        <Flex gap={2} direction={{ base: 'column', sm: 'row' }}>
          <Box flex="1">
            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Box>
          <Box flex="1">
            <Input
              label="URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
        </Flex>

        <Input
          label="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={1}>Notes</Text>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Add notes..."
            size="sm"
          />
        </Box>

        <Flex gap={2} justify="flex-end">
          <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button size="sm" colorPalette="blue" type="submit" loading={saving}>
            Add to Backlog
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}

export default BacklogForm
