import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import { useNavigate } from "react-router-dom";
import { useCreateQuestion } from "@queries/useQuestions";
import type { QuestionSource } from "@api/questions";
import type { PrepCategory, Difficulty } from "@api/types";
import { PREP_CATEGORIES, DIFFICULTIES, QUESTION_SOURCES } from "@api/types";
import { toast } from "@components/ui/sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ChipSelect from "@components/ChipSelect";
import { DIFFICULTY_COLORS, CHIP_BASE, CHIP_ACTIVE, CHIP_INACTIVE } from "@lib/styles";

const PRESET_TOPICS = [
  "Arrays",
  "Strings",
  "Hash Map",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Linked List",
  "Stack",
  "Queue",
  "Trees",
  "Binary Trees",
  "BST",
  "Graphs",
  "BFS",
  "DFS",
  "Dynamic Programming",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Heap",
  "Trie",
  "Sorting",
  "Math",
  "Bit Manipulation",
];

const PRESET_TAGS = [
  "blind-75",
  "neetcode-150",
  "top-interview",
  "revisit",
  "tricky",
  "optimization",
  "brute-force",
  "pattern",
  "math-heavy",
  "edge-cases",
];

const PRESET_COMPANIES = [
  "Google",
  "Meta",
  "Amazon",
  "Apple",
  "Microsoft",
  "Netflix",
  "Uber",
  "Stripe",
  "Adobe",
  "Oracle",
  "Flipkart",
  "Atlassian",
  "Intuit",
  "Goldman Sachs",
  "Morgan Stanley",
];

const inputBase =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-base md:text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30";
const textareaBase =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30 resize-none";


const NewQuestionPage = () => {
  usePageTitle("New Question");
  const navigate = useNavigate();
  const createMutation = useCreateQuestion();
  const mutating = createMutation.isPending;

  const [title, setTitle] = useState("");
  const [solution, setSolution] = useState("");
  const [category, setCategory] = useState<PrepCategory | "">("");
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [topics, setTopics] = useState<string[]>([]);
  const [source, setSource] = useState<QuestionSource | "">("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [companyTags, setCompanyTags] = useState<string[]>([]);

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const urlValid = isValidUrl(url.trim());
  const canSubmit = title.trim() && solution.trim() && category && urlValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        solution: solution.trim(),
        category: category as PrepCategory,
        notes: notes.trim() || undefined,
        difficulty: (difficulty as Difficulty) || undefined,
        topic: topics.length ? topics.join(", ") : undefined,
        source: (source as QuestionSource) || undefined,
        url: url.trim() || undefined,
        tags: tags.length ? tags : undefined,
        companyTags: companyTags.length ? companyTags : undefined,
      });
      toast.success("Question saved");
      navigate("/questions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <Layout>
      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => navigate("/questions")}
          className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="font-display text-lg md:text-xl font-bold">New Question</h1>
        <p className="text-sm text-muted-foreground">Log a solved question to track your progress</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Title & Solution */}
        <section className="glass-card rounded-xl p-4 md:p-5 space-y-4">
          <div>
            <label className={labelClass}>
              Title <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputBase}
              placeholder="e.g. Two Sum, Merge K Sorted Lists"
            />
          </div>

          <div>
            <label className={labelClass}>
              Solution <span className="text-destructive">*</span>
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={6}
              className={textareaBase}
              placeholder="Describe your approach, include code snippets..."
            />
          </div>
        </section>

        {/* Category & Difficulty */}
        <section className="glass-card rounded-xl p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Category <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PREP_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`${CHIP_BASE} ${category === cat.value ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(difficulty === d.value ? "" : d.value)}
                    className={`flex-1 ${CHIP_BASE} ${
                      difficulty === d.value
                        ? DIFFICULTY_COLORS[d.value]
                        : CHIP_INACTIVE
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Topic + Source & URL */}
        <section className="glass-card rounded-xl p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className={labelClass}>Topic</label>
              <ChipSelect
                presets={PRESET_TOPICS}
                selected={topics}
                onToggle={(v) => toggleItem(topics, setTopics, v)}
                onAdd={(v) => setTopics([...topics, v])}
                onRemove={(v) => setTopics(topics.filter((t) => t !== v))}
                placeholder="Custom topic + Enter..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Source</label>
                <div className="relative">
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as QuestionSource)}
                    className={`${inputBase} appearance-none pr-10`}
                  >
                    <option value="">Select</option>
                    {QUESTION_SOURCES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`${inputBase} ${url && !urlValid ? "border-destructive! focus:ring-destructive/30!" : ""}`}
                  placeholder="https://..."
                />
                {url && !urlValid && (
                  <p className="mt-1 text-xs text-destructive">Please enter a valid URL</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tags & Company Tags */}
        <section className="glass-card rounded-xl p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className={labelClass}>Tags</label>
              <ChipSelect
                presets={PRESET_TAGS}
                selected={tags}
                onToggle={(v) => toggleItem(tags, setTags, v)}
                onAdd={(v) => setTags([...tags, v])}
                onRemove={(v) => setTags(tags.filter((t) => t !== v))}
                placeholder="Custom tag + Enter..."
              />
            </div>
            <div className="space-y-3">
              <label className={labelClass}>Company Tags</label>
              <ChipSelect
                presets={PRESET_COMPANIES}
                selected={companyTags}
                onToggle={(v) => toggleItem(companyTags, setCompanyTags, v)}
                onAdd={(v) => setCompanyTags([...companyTags, v])}
                onRemove={(v) => setCompanyTags(companyTags.filter((t) => t !== v))}
                placeholder="Company name + Enter..."
              />
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="glass-card rounded-xl p-5 space-y-3">
          <label className={labelClass}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={textareaBase}
            placeholder="Personal notes, edge cases, tips..."
          />
        </section>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || mutating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
          >
            {mutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Question
          </button>
          <button
            onClick={() => navigate("/questions")}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-all hover:bg-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewQuestionPage;
