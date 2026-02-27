import { useCallback, useEffect, useState } from "react";
import { Flex, Heading, Text, Badge, Button, VStack, Spinner, IconButton } from "@chakra-ui/react";
import { LuPlus, LuFilter } from "react-icons/lu";
import { questionsApi } from "@api/questions";
import type { Question, CreateBacklogQuestionBody, QuestionStatus } from "@api/questions";
import type { Difficulty, PrepCategory } from "@api/types";
import PageContainer from "@components/PageContainer";
import { ErrorState } from "@components/EmptyState";
import BacklogFilters from "./components/BacklogFilters";
import QuestionCard from "./components/QuestionCard";
import BacklogForm from "./components/BacklogForm";

const Backlog = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchBacklog = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await questionsApi.getBacklog({
        ...(difficulty ? { difficulty: difficulty as Difficulty } : {}),
        ...(source ? { source } : {}),
        ...(status ? { status: status as QuestionStatus } : {}),
        ...(category ? { topic: category } : {}),
      });
      setQuestions(data.data);
      setTotalCount(data.pagination.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, status, source]);

  useEffect(() => {
    fetchBacklog();
  }, [fetchBacklog]);

  const handleCreate = async (body: CreateBacklogQuestionBody) => {
    try {
      await questionsApi.createBacklog(body);
      setShowForm(false);
      fetchBacklog();
    } catch {
      // Form stays open so user can retry
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await questionsApi.delete(id);
      fetchBacklog();
    } catch {
      // Question stays in list
    }
  };

  const handleStar = async (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
    );
    try {
      await questionsApi.star(id);
    } catch {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, starred: !q.starred } : q)),
      );
    }
  };

  const handleSolve = async (id: string, category: PrepCategory) => {
    try {
      await questionsApi.update(id, { category });
      await questionsApi.solve(id);
      fetchBacklog();
    } catch {
      // Question stays in backlog
    }
  };

  const clearFilters = () => {
    setCategory("");
    setDifficulty("");
    setStatus("");
    setSource("");
  };

  const hasFilters = !!(category || difficulty || status || source);

  return (
    <PageContainer>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={2}>
          <Heading size={{ base: "md", md: "lg" }}>Backlog</Heading>
          {!loading && (
            <Badge variant="subtle" size="sm" colorPalette="purple">
              {totalCount} Question{totalCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </Flex>

        <Flex gap={2} align="center">
          <IconButton
            aria-label="Toggle filters"
            variant={hasFilters ? "solid" : "outline"}
            colorPalette={hasFilters ? "purple" : undefined}
            size="sm"
            display={{ base: "flex", md: "none" }}
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            <LuFilter />
          </IconButton>

          <Button colorPalette="purple" size="sm" onClick={() => setShowForm(true)} display={{ base: "none", md: "flex" }}>
            <LuPlus /> New Question
          </Button>
        </Flex>
      </Flex>

      {/* Filters */}
      <BacklogFilters
        category={category}
        difficulty={difficulty}
        status={status}
        source={source}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        showMobile={showMobileFilters}
      />

      {/* Add form */}
      {showForm && <BacklogForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {/* Loading */}
      {loading && questions.length === 0 && (
        <Flex justify="center" py={12}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error state */}
      {!loading && error && <ErrorState onRetry={fetchBacklog} />}

      {/* Empty state */}
      {!loading && !error && questions.length === 0 && (
        <VStack gap={4} py={16}>
          <Text color="fg.muted" fontSize="lg">
            {hasFilters ? "No questions match the filters" : "Backlog is empty"}
          </Text>
          {hasFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Text color="fg.muted" fontSize="sm">
              Save questions here for later.
            </Text>
          )}
        </VStack>
      )}

      {/* Question list */}
      <VStack gap={2} align="stretch">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onDelete={() => handleDelete(q.id)}
            onStar={() => handleStar(q.id)}
            onSolve={(cat) => handleSolve(q.id, cat)}
          />
        ))}
      </VStack>

      {/* Mobile FAB */}
      <IconButton
        aria-label="Add question"
        colorPalette="purple"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        display={{ base: "flex", md: "none" }}
        boxShadow="lg"
        onClick={() => setShowForm(true)}
      >
        <LuPlus />
      </IconButton>
    </PageContainer>
  );
};

export default Backlog;
