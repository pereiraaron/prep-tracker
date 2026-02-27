import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  NativeSelect,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { LuArrowLeft } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { questionsApi } from '@api/questions'
import type { Question, CreateQuestionBody, UpdateQuestionBody, QuestionSource } from '@api/questions'
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from '@api/types'
import type { PrepCategory, Difficulty } from '@api/types'
import PageContainer from '@components/PageContainer'
import Input from '@components/Input'
import TagInput from '@components/TagInput'

const QuestionForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
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

  const loadQuestion = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const q: Question = await questionsApi.getById(id)
      setTitle(q.title)
      setSolution(q.solution || '')
      setCategory(q.category || '')
      setDifficulty(q.difficulty || '')
      setSource(q.source || '')
      setTopic(q.topic || '')
      setUrl(q.url || '')
      setNotes(q.notes || '')
      setTags(q.tags)
      setCompanyTags(q.companyTags)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadQuestion()
  }, [loadQuestion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isEdit && (!category || !solution)) {
      setError('Category and solution are required')
      return
    }
    setSaving(true)
    try {
      if (isEdit) {
        const body: UpdateQuestionBody = {
          title,
          solution: solution || undefined,
          category: category ? (category as PrepCategory) : null,
          difficulty: difficulty ? (difficulty as Difficulty) : null,
          source: source ? (source as QuestionSource) : null,
          topic: topic || null,
          url: url || undefined,
          notes: notes || undefined,
          tags,
          companyTags,
        }
        await questionsApi.update(id!, body)
      } else {
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
      }
      navigate('/questions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
      </PageContainer>
    )
  }

  if (notFound) {
    return (
      <PageContainer>
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            Question not found
          </Text>
          <Button variant="outline" size="sm" onClick={() => navigate('/questions')}>
            Back to Questions
          </Button>
        </VStack>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="sm"
        mb={4}
        onClick={() => navigate('/questions')}
      >
        <LuArrowLeft /> Back
      </Button>

      <Heading size={{ base: 'md', md: 'lg' }} mb={{ base: 6, md: 8 }}>
        {isEdit ? 'Edit Question' : 'New Question'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={{ base: 6, md: 8 }}
          alignItems="start"
        >
          {/* Left column */}
          <VStack gap={5} align="stretch">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                Category {!isEdit && '*'}
              </Text>
              <NativeSelect.Root size="md" w="full">
                <NativeSelect.Field
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {PREP_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                Difficulty
              </Text>
              <NativeSelect.Root size="md" w="full">
                <NativeSelect.Field
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select difficulty</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                Source
              </Text>
              <NativeSelect.Root size="md" w="full">
                <NativeSelect.Field
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="">Select source</option>
                  {QUESTION_SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <Input
              label="URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </VStack>

          {/* Right column */}
          <VStack gap={5} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                Solution {!isEdit && '*'}
              </Text>
              <Textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={8}
                placeholder="Your solution or approach..."
                required={!isEdit}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1.5}>
                Notes
              </Text>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Personal notes..."
              />
            </Box>

            <TagInput label="Tags" value={tags} onChange={setTags} placeholder="Add tags..." />

            <TagInput
              label="Company Tags"
              value={companyTags}
              onChange={setCompanyTags}
              placeholder="Add company names..."
            />
          </VStack>
        </Grid>

        {error && (
          <Text color="red.500" fontSize="sm" mt={4}>
            {error}
          </Text>
        )}

        <Flex gap={3} mt={8} justify="flex-end">
          <Button
            variant="ghost"
            onClick={() => navigate('/questions')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorPalette="purple"
            loading={saving}
            disabled={saving}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </form>
    </PageContainer>
  )
}

export default QuestionForm
