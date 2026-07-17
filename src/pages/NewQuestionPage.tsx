import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Layout from "@components/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateQuestion, useSuggestions } from "@queries/useQuestions";
import { useCreateBacklogItem } from "@queries/useBacklog";
import type { QuestionSource, Solution } from "@api/questions";
import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from "@api/types";
import { statsApi, type OverviewResponse, type StreaksResponse } from "@api/stats";
import { queryKeys } from "@lib/queryKeys";
import { celebrateSolve } from "@lib/celebrate";
import SolutionFields from "@components/SolutionFields";
import {
  allowsMultipleSolutions,
  isSolutionRequired,
  normalizeSolutionsForSubmit,
  solutionsHaveContent,
  validateSolutions,
} from "@lib/solutions";
import { toast } from "@components/ui/sonner";
import { ArrowLeft, Save, Loader2, FileText, Layers, Tag, Building2, StickyNote, Link2, ChevronDown } from "lucide-react";
import ChipSelect from "@components/ChipSelect";
import FormSectionHeader from "@components/FormSectionHeader";
import { DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE, FORM_INPUT, FORM_TEXTAREA } from "@lib/styles";


const inputCls = FORM_INPUT;
const textareaCls = FORM_TEXTAREA;

const SectionHeader = FormSectionHeader;

const NewQuestionPage = () => {
  const [searchParams] = useSearchParams();
  const isBacklogMode = searchParams.get("mode") === "backlog";
  usePageTitle(isBacklogMode ? "Add to Backlog" : "New Question");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createQuestionMutation = useCreateQuestion();
  const createBacklogMutation = useCreateBacklogItem();
  const createMutation = isBacklogMode ? createBacklogMutation : createQuestionMutation;
  const mutating = createMutation.isPending;
  const { data: suggestions, isLoading: suggestionsLoading } = useSuggestions();

  const [title, setTitle] = useState("");
  const [solutions, setSolutions] = useState<Solution[]>([{ content: "" }]);
  const [category, setCategory] = useState<PrepCategory>("dsa");
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [topics, setTopics] = useState<string[]>([]);
  const [source, setSource] = useState<QuestionSource | "">("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [companyTags, setCompanyTags] = useState<string[]>([]);

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try { new URL(value); return true; } catch { return false; }
  };

  const urlValid = isValidUrl(url.trim());
  const solutionRequired = isSolutionRequired(category);
  const canSubmit = isBacklogMode
    ? !!(title.trim() && category && url.trim() && urlValid)
    : !!(title.trim() && (!solutionRequired || solutionsHaveContent(solutions)) && category && difficulty && urlValid);

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

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!isBacklogMode) {
      const solutionError = validateSolutions(solutions, category);
      if (solutionError) {
        toast.error(solutionError);
        return;
      }
    }
    try {
      if (isBacklogMode) {
        await createBacklogMutation.mutateAsync({
          title: title.trim(),
          category,
          url: url.trim(),
          notes: notes.trim() || undefined,
          difficulty: difficulty || undefined,
          topics: topics.length ? topics : undefined,
          source: (source as QuestionSource) || undefined,
          tags: tags.length ? tags : undefined,
          companyTags: companyTags.length ? companyTags : undefined,
        });
        toast.success("Added to backlog");
        navigate("/backlog");
      } else {
        const overviewBefore = queryClient.getQueryData<OverviewResponse>(queryKeys.stats.overview());
        const streaksBefore = queryClient.getQueryData<StreaksResponse>(queryKeys.stats.streaks());
        await createQuestionMutation.mutateAsync({
          title: title.trim(),
          solutions: normalizeSolutionsForSubmit(solutions, category),
          category,
          notes: notes.trim() || undefined,
          difficulty,
          topics: topics.length ? topics : undefined,
          source: (source as QuestionSource) || undefined,
          url: url.trim() || undefined,
          tags: tags.length ? tags : undefined,
          companyTags: companyTags.length ? companyTags : undefined,
        });
        const streaksAfter = await queryClient.fetchQuery({
          queryKey: queryKeys.stats.streaks(),
          queryFn: statsApi.getStreaks,
        });
        celebrateSolve({
          wasFirstQuestion: (overviewBefore?.totalSolved ?? 0) === 0,
          previousStreak: streaksBefore?.currentStreak ?? 0,
          currentStreak: streaksAfter.currentStreak,
        });
        navigate("/questions");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const labelCls = "mb-1.5 block text-xs font-semibold text-muted-foreground";
  const topicPresets = suggestions?.topicsByCategory?.[category] ?? [];
  const tagPresets = suggestions?.tagsByCategory?.[category] ?? suggestions?.tags ?? [];
  const companyPresets = suggestions?.companyTags ?? [];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(isBacklogMode ? "/backlog" : "/questions")}
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isBacklogMode ? "Back to Backlog" : "Back to Questions"}
        </button>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold">
              {isBacklogMode ? "Add to Backlog" : "Log a Question"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are required
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 pb-8">
        {/* ---- Essentials ---- */}
        <section className="glass-card rounded-xl p-5">
          <SectionHeader icon={FileText} title="Essentials" />
          <div className="space-y-4">
            <div>
              <label htmlFor="q-title" className={labelCls}>
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="q-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="e.g. Two Sum, Merge K Sorted Lists"
                disabled={mutating}
              />
            </div>

            {!isBacklogMode && (
              <SolutionFields
                solutions={solutions}
                onChange={setSolutions}
                category={category}
                disabled={mutating}
                solutionRequired={solutionRequired}
                idPrefix="q-solution"
                labelCls={labelCls}
                textareaCls={textareaCls}
              />
            )}
          </div>
        </section>

        {/* ---- Classification ---- */}
        <section className="glass-card rounded-xl p-5">
          <SectionHeader icon={Layers} title="Classification" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelCls}>
                Category <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PREP_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`${CHIP_BASE} ${category === cat.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Difficulty <span className="text-destructive">*</span>
              </label>
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

          {/* Topics — based on selected category */}
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

        {/* ---- Source & URL ---- */}
        <section className="glass-card rounded-xl p-5">
          <SectionHeader icon={Link2} title="Source" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="q-source" className={labelCls}>Platform</label>
              <div className="relative">
                <select
                  id="q-source"
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
              <label htmlFor="q-url" className={labelCls}>
                Problem URL {isBacklogMode && <span className="text-destructive">*</span>}
              </label>
              <input
                id="q-url"
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

        {/* ---- Tags ---- */}
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

        {/* ---- Notes ---- */}
        <section className="glass-card rounded-xl p-5">
          <SectionHeader icon={StickyNote} title="Notes" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={textareaCls}
            placeholder="Personal notes, edge cases, tips..."
            disabled={mutating}
          />
        </section>

        {/* ---- Actions ---- */}
        <div className="flex items-center gap-3 pt-2 justify-end">
          {!canSubmit && title.trim() && (
            <p className="text-xs text-muted-foreground mr-auto">
              {!category
                ? "Pick a category"
                : isBacklogMode
                  ? !url.trim() ? "Add problem URL" : !urlValid ? "Fix the URL" : ""
                  : !difficulty ? "Pick difficulty" : (solutionRequired && !solutionsHaveContent(solutions)) ? "Add a solution" : !urlValid ? "Fix the URL" : ""}
            </p>
          )}
          <button
            onClick={() => navigate(isBacklogMode ? "/backlog" : "/questions")}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-all hover:bg-secondary active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || mutating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:active:scale-100"
          >
            {mutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isBacklogMode ? "Add to Backlog" : "Save Question"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewQuestionPage;
