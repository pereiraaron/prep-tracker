import usePageTitle from "@hooks/usePageTitle";
import { lazy, Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "@components/Layout";
import { useQuestionDetail, useUpdateQuestion, useStarQuestion, useSuggestions } from "@queries/useQuestions";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
import ChipSelect from "@components/ChipSelect";
import FormSectionHeader from "@components/FormSectionHeader";
import SolutionFields from "@components/SolutionFields";
const MarkdownContent = lazy(() => import("@components/MarkdownContent"));
import { toast } from "@components/ui/sonner";
import type { QuestionSource, Solution } from "@api/questions";
import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from "@api/types";
import { capitalize, DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE, FORM_INPUT } from "@lib/styles";
import { Button } from "@components/ui/button";
import {
  allowsMultipleSolutions,
  isSolutionRequired,
  normalizeSolutionsForSubmit,
  solutionsToEditable,
  validateSolutions,
} from "@lib/solutions";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Edit3,
  Save,
  X,
  Calendar,
  Tag,
  Building2,
  Globe,
  FileText,
  StickyNote,
  Code2,
  Copy,
  Check,
  Loader2,
  Play,
  Layers,
  Link2,
  ChevronDown,
  Timer,
  Pause,
  RotateCcw,
} from "lucide-react";
const CodeEditor = lazy(() => import("@components/CodeEditor"));

const inputCls = FORM_INPUT;
const labelCls = "mb-2.5 block text-xs font-semibold text-muted-foreground";

const SectionHeader = FormSectionHeader;


const QuestionTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (!running && seconds === 0) {
    return (
      <button
        onClick={() => setRunning(true)}
        className="flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
      >
        <Timer className="h-3.5 w-3.5" />
        Timer
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-sm font-semibold tabular-nums min-w-14 text-center">{display}</span>
      <button
        onClick={() => setRunning(!running)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
          running ? "border-stat-orange/30 text-stat-orange hover:bg-stat-orange/10" : "border-stat-green/30 text-stat-green hover:bg-stat-green/10"
        }`}
        aria-label={running ? "Pause timer" : "Resume timer"}
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => { setRunning(false); setSeconds(0); }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        aria-label="Reset timer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const QuestionDetailPage = () => {
  usePageTitle("Question Details");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: question, isLoading } = useQuestionDetail(id);
  const { data: suggestions, isLoading: suggestionsLoading } = useSuggestions();
  const updateMutation = useUpdateQuestion();
  const starMutation = useStarQuestion();
  const mutating = updateMutation.isPending;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [solutions, setSolutions] = useState<Solution[]>([{ content: "" }]);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<PrepCategory>("dsa");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [topics, setTopics] = useState<string[]>([]);
  const [source, setSource] = useState<QuestionSource | "">("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [companyTags, setCompanyTags] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const cat = question?.category ?? null;
  const diff = question?.difficulty;
  const codingCategories = ["dsa", "machine_coding", "language_framework"];
  const editCategory = isEditing ? category : cat;
  const isCodeQuestion = editCategory ? codingCategories.includes(editCategory) : false;

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try { new URL(value); return true; } catch { return false; }
  };
  const urlValid = isValidUrl(url.trim());
  const canSave = !!(title.trim() && category);

  const initEditState = useCallback(() => {
    setTitle(question?.title || "");
    setSolutions(solutionsToEditable(question?.solutions));
    setNotes(question?.notes || "");
    setCategory((question?.category as PrepCategory) || "dsa");
    setDifficulty((question?.difficulty as Difficulty) || "easy");
    setTopics(question?.topics?.length ? [...question.topics] : []);
    setSource((question?.source as QuestionSource) || "");
    setUrl(question?.url || "");
    setTags(question?.tags || []);
    setCompanyTags(question?.companyTags || []);
  }, [question]);

  const handleCategoryChange = (val: PrepCategory) => {
    setCategory(val);
    if (!allowsMultipleSolutions(val)) {
      const firstWithContent = solutions.find((s) => s.content.trim());
      setSolutions([firstWithContent ?? solutions[0] ?? { content: "" }]);
    }
    const newPresets = suggestions?.topicsByCategory?.[val];
    if (newPresets?.length) {
      const newPresetsLower = new Set(newPresets.map((t: string) => t.toLowerCase()));
      setTopics((prev) => prev.filter((t) => newPresetsLower.has(t)));
    }
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const activeCat = isEditing ? category : (cat as PrepCategory);
  const topicPresets = suggestions?.topicsByCategory?.[activeCat] ?? [];
  const tagPresets = suggestions?.tagsByCategory?.[activeCat] ?? suggestions?.tags ?? [];
  const companyPresets = suggestions?.companyTags ?? [];

  const handleSave = async () => {
    if (!canSave) return;
    const solutionError = validateSolutions(solutions, category);
    if (solutionError) {
      toast.error(solutionError);
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: id!,
        body: {
          title: title.trim(),
          solutions: normalizeSolutionsForSubmit(solutions, category),
          notes: notes.trim() || undefined,
          category,
          difficulty,
          topics: topics.length ? topics : null,
          source: (source as QuestionSource) || null,
          url: url.trim() || undefined,
          tags: tags.length ? tags : [],
          companyTags: companyTags.length ? companyTags : [],
        },
      });
      toast.success("Saved");
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Keyboard shortcuts: e=edit, s=star, ←/→=navigate between questions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;

      if (e.key === "e" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (!isEditing) initEditState();
        setIsEditing((v) => !v);
      }

      if (e.key === "s" && !e.metaKey && !e.ctrlKey && !isEditing) {
        e.preventDefault();
        if (id) starMutation.mutate(id);
      }

      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !isEditing) {
        // Find question IDs from the cached questions list
        const cache = queryClient.getQueriesData<{ data: { id: string }[] }>({ queryKey: ["questions", "list"] });
        let ids: string[] = [];
        for (const [, data] of cache) {
          if (data?.data?.length) {
            ids = data.data.map((q) => q.id);
            break;
          }
        }
        if (!ids.length) return;
        const idx = ids.indexOf(id!);
        if (idx === -1) return;
        const nextIdx = e.key === "ArrowLeft" ? idx - 1 : idx + 1;
        if (nextIdx >= 0 && nextIdx < ids.length) {
          navigate(`/questions/${ids[nextIdx]}`, { replace: true });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, isEditing, navigate, queryClient, starMutation, initEditState]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="font-display text-lg font-semibold">Question not found</p>
          <button onClick={() => navigate("/questions")} className="mt-4 text-sm text-primary hover:underline">
            Back to Questions
          </button>
        </div>
      </Layout>
    );
  }

  const hasTags = question.tags.length > 0;
  const hasCompanyTags = question.companyTags.length > 0;
  const hasTopics = question.topics?.length > 0;
  const hasMetadata = hasTopics || question.source || hasTags || hasCompanyTags;

  return (
    <Layout>
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        {/* Header */}
        <div className="glass-card rounded-xl p-5 md:p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2.5 min-w-0 flex-1">
              {isEditing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                  placeholder="Question title"
                  disabled={mutating}
                />
              ) : (
                <h1 className="font-display text-lg md:text-xl font-bold leading-tight">{question.title}</h1>
              )}
              {!isEditing && (
                <div className="flex flex-wrap items-center gap-2">
                  {diff && <DifficultyBadge value={diff} />}
                  {cat && <CategoryBadge value={cat} />}
                  {question.status === "solved" && (
                    <span className="rounded-md bg-stat-green/10 border border-stat-green/20 px-1.5 py-0.5 text-[10px] font-semibold text-stat-green">
                      Solved
                    </span>
                  )}
                </div>
              )}
              {/* Dates */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                {question.solvedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Solved {formatDate(question.solvedAt)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(question.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isEditing && <QuestionTimer />}
              {!isEditing && question.url && (
                <a
                  href={question.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open problem link"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-[0.95] transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                aria-label={question.starred ? "Unstar question" : "Star question"}
                onClick={() => starMutation.mutate(id!)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-stat-orange hover:bg-stat-orange/10 active:scale-[0.95] transition-all"
              >
                <Star className={`h-4 w-4 ${question.starred ? "fill-stat-orange text-stat-orange" : ""}`} />
              </button>
              {isCodeQuestion && !isEditing && (
                <button
                  onClick={() => navigate(`/questions/${id}/practice`)}
                  className="flex h-9 items-center gap-2 rounded-xl border border-stat-green/30 bg-stat-green/10 px-3 text-sm font-medium text-stat-green hover:bg-stat-green/20 active:scale-[0.98] transition-all"
                >
                  <Play className="h-3.5 w-3.5" />
                  Practice
                </button>
              )}
              <button
                onClick={() => {
                  if (!isEditing) initEditState();
                  setIsEditing(!isEditing);
                }}
                className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all ${
                  isEditing
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                {isEditing ? "Editing" : "Edit"}
              </button>
            </div>
          </div>

          {/* Metadata: Topic, Source, Tags, Company Tags (view mode) */}
          {!isEditing && hasMetadata && (
            <div className="border-t border-border pt-4 space-y-3">
              {(hasTopics || question.source) && (
                <div className="flex flex-wrap items-center gap-2">
                  {hasTopics && (
                    <>
                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                      {question.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[11px] font-medium text-foreground"
                        >
                          {capitalize(t)}
                        </span>
                      ))}
                    </>
                  )}
                  {hasTopics && question.source && <span className="mx-1 h-4 w-px bg-border" />}
                  {question.source && (
                    <>
                      <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono font-medium text-muted-foreground">
                        {question.source}
                      </span>
                    </>
                  )}
                </div>
              )}

              {(hasTags || hasCompanyTags) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {hasTags && (
                    <>
                      <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-primary/5 border border-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                  {hasTags && hasCompanyTags && <span className="mx-1.5 h-4 w-px bg-border" />}
                  {hasCompanyTags && (
                    <>
                      <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                      {question.companyTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stat-blue/5 border border-stat-blue/10 px-2 py-0.5 text-[11px] font-medium text-stat-blue/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Solutions */}
        {(() => {
          const visibleSolutions = question.solutions?.filter((s) => s.content.trim()) ?? [];
          const solutionTitle = editCategory && allowsMultipleSolutions(editCategory) && visibleSolutions.length > 1
            ? "Solutions"
            : "Solution";

          if (isEditing) {
            if (isCodeQuestion) {
              return (
                <SolutionFields
                  solutions={solutions}
                  onChange={setSolutions}
                  category={category}
                  isCode
                  disabled={mutating}
                  solutionRequired={isSolutionRequired(category)}
                  idPrefix="detail-solution"
                />
              );
            }

            return (
              <div className="glass-card rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-stat-blue" />
                  <h2 className="font-display text-sm font-semibold">
                    {allowsMultipleSolutions(category) ? "Solutions" : "Solution"}
                  </h2>
                </div>
                <SolutionFields
                  solutions={solutions}
                  onChange={setSolutions}
                  category={category}
                  disabled={mutating}
                  solutionRequired={isSolutionRequired(category)}
                  idPrefix="detail-solution"
                  labelCls={labelCls}
                />
              </div>
            );
          }

          if (isCodeQuestion) {
            if (!visibleSolutions.length) {
              return (
                <div className="rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 bg-[hsl(var(--code-bg))] px-4 py-3 rounded-t-xl">
                    <Code2 className="h-4 w-4 text-stat-green" />
                    <h2 className="font-display text-sm font-semibold text-[hsl(var(--code-fg))]">Solution</h2>
                  </div>
                  <div className="bg-[hsl(var(--code-bg))] rounded-b-xl px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground italic">No solution yet. Click Edit to add one.</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {visibleSolutions.map((sol, index) => (
                  <div key={index} className="rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between bg-[hsl(var(--code-bg))] px-4 py-3 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-stat-green" />
                        <h2 className="font-display text-sm font-semibold text-[hsl(var(--code-fg))]">
                          {visibleSolutions.length > 1 ? `Solution ${index + 1}` : "Solution"}
                        </h2>
                      </div>
                      <button
                        onClick={() => handleCopy(sol.content, index)}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                      >
                        {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-stat-green" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedIndex === index ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <Suspense fallback={<div className="bg-[hsl(var(--code-bg))] rounded-b-xl px-4 py-8 text-center"><p className="text-sm text-muted-foreground">Loading editor...</p></div>}>
                      <CodeEditor value={sol.content} readOnly maxHeight="600px" />
                    </Suspense>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="glass-card rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-stat-blue" />
                <h2 className="font-display text-sm font-semibold">{solutionTitle}</h2>
              </div>
              {!visibleSolutions.length ? (
                <p className="text-sm text-muted-foreground italic">No solution yet. Click Edit to add one.</p>
              ) : (
                <div className="space-y-6">
                  {visibleSolutions.map((sol, index) => (
                    <div key={index} className={index > 0 ? "pt-6 border-t border-border/60" : undefined}>
                      {visibleSolutions.length > 1 && (
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">Solution {index + 1}</span>
                          <button
                            onClick={() => handleCopy(sol.content, index)}
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                          >
                            {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-stat-green" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedIndex === index ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                      {visibleSolutions.length === 1 && (
                        <div className="mb-3 flex justify-end">
                          <button
                            onClick={() => handleCopy(sol.content, index)}
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                          >
                            {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-stat-green" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedIndex === index ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                      <Suspense fallback={<p className="text-sm text-muted-foreground/50 animate-pulse">Rendering...</p>}>
                        <MarkdownContent content={sol.content} />
                      </Suspense>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Notes */}
        <div className="glass-card rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="h-4 w-4 text-stat-orange" />
            <h2 className="font-display text-sm font-semibold">Notes</h2>
          </div>
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              disabled={mutating}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 resize-none disabled:opacity-50"
              placeholder="Personal notes, edge cases, tips..."
            />
          ) : (
            <div>
              {question.notes ? (
                <p className="text-sm leading-relaxed text-foreground/80">{question.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes yet. Click Edit to add some.</p>
              )}
            </div>
          )}
        </div>

        {/* Editable fields (edit mode only) */}
        {isEditing && (
          <div className="space-y-5">
            {/* Classification */}
            <section className="glass-card rounded-xl p-5">
              <SectionHeader icon={Layers} title="Classification" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PREP_CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleCategoryChange(c.value)}
                        className={`${CHIP_BASE} ${category === c.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDifficulty(d.value)}
                        className={`flex-1 ${CHIP_BASE} ${difficulty === d.value ? DIFFICULTY_COLORS[d.value] : CHIP_INACTIVE}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 w-full">
                <label className={labelCls}>Topics</label>
                <ChipSelect
                  presets={topicPresets}
                  selected={topics}
                  onToggle={(v) => toggleItem(topics, setTopics, v)}
                  onAdd={(v) => setTopics([...topics, v])}
                  onRemove={(v) => setTopics(topics.filter((t) => t !== v))}
                  placeholder="Custom topic + Enter..."
                  lowercase
                  loading={suggestionsLoading}
                  alwaysOpen
                />
              </div>
            </section>

            {/* Source & URL */}
            <section className="glass-card rounded-xl p-5">
              <SectionHeader icon={Link2} title="Source" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="edit-source" className={labelCls}>Platform</label>
                  <div className="relative">
                    <select
                      id="edit-source"
                      value={source}
                      onChange={(e) => setSource(e.target.value as QuestionSource)}
                      className={`${inputCls} appearance-none pr-10`}
                      disabled={mutating}
                    >
                      <option value="">Select platform</option>
                      {QUESTION_SOURCES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-url" className={labelCls}>Problem URL</label>
                  <input
                    id="edit-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`${inputCls} ${url && !urlValid ? "border-destructive focus:ring-destructive/30" : ""}`}
                    placeholder="https://leetcode.com/problems/..."
                    disabled={mutating}
                  />
                  {url && !urlValid && (
                    <p className="mt-1 text-xs text-destructive">Please enter a valid URL</p>
                  )}
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="glass-card rounded-xl p-5">
              <SectionHeader icon={Tag} title="Tags" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch">
                <div className="flex flex-col">
                  <label className={labelCls}>Tags</label>
                  <ChipSelect
                    presets={tagPresets}
                    selected={tags}
                    onToggle={(v) => toggleItem(tags, setTags, v)}
                    onAdd={(v) => setTags([...tags, v])}
                    onRemove={(v) => setTags(tags.filter((t) => t !== v))}
                    placeholder="Custom tag + Enter..."
                    lowercase
                    loading={suggestionsLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={`${labelCls} flex items-center gap-1.5`}>
                    <Building2 className="h-3 w-3" />
                    Company Tags
                  </label>
                  <ChipSelect
                    presets={companyPresets}
                    selected={companyTags}
                    onToggle={(v) => toggleItem(companyTags, setCompanyTags, v)}
                    onAdd={(v) => setCompanyTags([...companyTags, v])}
                    onRemove={(v) => setCompanyTags(companyTags.filter((t) => t !== v))}
                    placeholder="Company name + Enter..."
                    loading={suggestionsLoading}
                  />
                </div>
              </div>
            </section>

            {/* Cancel / Save */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  initEditState();
                  setIsEditing(false);
                }}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button variant="brand" size="sm" onClick={handleSave} disabled={mutating || !canSave || !urlValid}>
                {mutating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuestionDetailPage;
