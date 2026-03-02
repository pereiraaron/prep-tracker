import usePageTitle from "@hooks/usePageTitle";
import { useState } from "react";
import Layout from "@components/Layout";
import { useNavigate } from "react-router-dom";
import { useCreateQuestion } from "@queries/useQuestions";
import type { QuestionSource } from "@api/questions";
import type { PrepCategory, Difficulty } from "@api/types";
import { CATEGORY_LABEL } from "@api/types";
import { toast } from "@components/ui/sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

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
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState<QuestionSource | "">("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [companyTags, setCompanyTags] = useState("");

  const canSubmit = title.trim() && solution.trim() && category;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        solution: solution.trim(),
        category: category as PrepCategory,
        notes: notes.trim() || undefined,
        difficulty: (difficulty as Difficulty) || undefined,
        topic: topic.trim() || undefined,
        source: (source as QuestionSource) || undefined,
        url: url.trim() || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        companyTags: companyTags
          ? companyTags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      });
      toast.success("Question saved");
      navigate("/questions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-border bg-background px-4 text-base md:text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30";
  const textareaClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30 resize-none";
  const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <Layout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/questions")}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </button>
        <h1 className="font-display text-xl font-bold">New Question</h1>
        <p className="text-sm text-muted-foreground">Log a solved question</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="glass-card space-y-5 rounded-xl p-6">
          <div>
            <label className={labelClass}>
              Title <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Two Sum"
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
              className={textareaClass}
              placeholder="Describe your approach, include code snippets..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Category <span className="text-destructive">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PrepCategory)}
              className={inputClass}
            >
              <option value="">Select category</option>
              {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as QuestionSource)}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="leetcode">LeetCode</option>
                <option value="greatfrontend">GreatFrontEnd</option>
                <option value="geeksforgeeks">GeeksforGeeks</option>
                <option value="linkedin">LinkedIn</option>
                <option value="medium">Medium</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={inputClass}
              placeholder="e.g. Arrays, Binary Trees"
            />
          </div>

          <div>
            <label className={labelClass}>URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={textareaClass}
              placeholder="Personal notes, edge cases, tips..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputClass}
                placeholder="dp, greedy (comma separated)"
              />
            </div>
            <div>
              <label className={labelClass}>Company Tags</label>
              <input
                value={companyTags}
                onChange={(e) => setCompanyTags(e.target.value)}
                className={inputClass}
                placeholder="Google, Meta"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || mutating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
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
