import usePageTitle from "@hooks/usePageTitle";
import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@components/Layout";
import useQuestions from "@hooks/useQuestions";
import type { PrepCategory } from "@api/types";
import { CATEGORY_LABEL } from "@api/types";
import { toast } from "@components/ui/sonner";
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
} from "lucide-react";

const codingCategories: PrepCategory[] = [
  "dsa",
  "machine_coding",
  "language_framework",
];

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const categoryColors: Record<string, string> = {
  dsa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  system_design: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  machine_coding: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  language_framework: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  behavioral: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  conceptual: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  theory: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  quiz: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const QuestionDetailPage = () => {
  usePageTitle("Question Details");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentQuestion: question,
    detailLoading: isLoading,
    mutating,
    fetchById,
    updateQuestion,
    starQuestion,
  } = useQuestions();

  const [isEditing, setIsEditing] = useState(false);
  const [solution, setSolution] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

  useEffect(() => {
    if (question && !isEditing) {
      setSolution(question.solution || "");
      setNotes(question.notes || "");
    }
  }, [question, isEditing]);

  const cat = question?.category ?? null;
  const diff = question?.difficulty;
  const isCodeQuestion = cat ? codingCategories.includes(cat) : false;
  const solutionLines = useMemo(() => (question?.solution || "").split("\n"), [question?.solution]);

  const handleSave = async () => {
    try {
      await updateQuestion(id!, { solution, notes });
      toast.success("Saved");
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <p className="font-display text-lg font-semibold">
            Question not found
          </p>
          <button
            onClick={() => navigate("/questions")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to Questions
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-xl font-bold">
                {question.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {diff && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${difficultyColors[diff] || ""}`}
                  >
                    {diff}
                  </span>
                )}
                {cat && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${categoryColors[cat] || ""}`}
                  >
                    {CATEGORY_LABEL[cat] || cat}
                  </span>
                )}
                {question.status === "solved" && (
                  <span className="rounded-md bg-stat-green/10 px-2 py-0.5 text-xs font-semibold text-stat-green">
                    Solved
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {question.url && (
                <a
                  href={question.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => starQuestion(id!)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-stat-orange hover:bg-stat-orange/10 transition-all"
              >
                <Star
                  className={`h-4 w-4 ${question.starred ? "fill-stat-orange text-stat-orange" : ""}`}
                />
              </button>
              <button
                onClick={() => {
                  if (!isEditing) {
                    setSolution(question.solution || "");
                    setNotes(question.notes || "");
                  }
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
          {/* Main content */}
          <div className="space-y-4">
            <div
              className={`rounded-xl overflow-hidden ${isCodeQuestion && !isEditing ? "" : "glass-card p-6"}`}
            >
              <div
                className={`flex items-center justify-between ${isCodeQuestion && !isEditing ? "bg-[hsl(220,13%,18%)] px-4 py-3 rounded-t-xl" : "mb-4"}`}
              >
                <div className="flex items-center gap-2">
                  {isCodeQuestion ? (
                    <Code2
                      className={`h-4 w-4 ${!isEditing ? "text-emerald-400" : "text-stat-blue"}`}
                    />
                  ) : (
                    <FileText className="h-4 w-4 text-stat-blue" />
                  )}
                  <h2
                    className={`font-display text-sm font-semibold ${isCodeQuestion && !isEditing ? "text-gray-300" : ""}`}
                  >
                    Solution
                  </h2>
                </div>
                {!isEditing && question.solution && isCodeQuestion && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={16}
                  className="w-full rounded-xl border border-border bg-[hsl(220,13%,18%)] px-4 py-3 font-mono text-sm text-gray-200 outline-none transition-all focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Write your solution..."
                  spellCheck={false}
                />
              ) : (
                <div>
                  {question.solution ? (
                    isCodeQuestion ? (
                      <div className="bg-[hsl(220,13%,18%)] rounded-b-xl overflow-auto max-h-80 md:max-h-150">
                        <table className="w-full border-collapse">
                          <tbody>
                            {solutionLines.map((line, i) => (
                              <tr
                                key={i}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="select-none border-r border-white/5 px-4 py-0 text-right font-mono text-xs leading-6 text-gray-600 w-12">
                                  {i + 1}
                                </td>
                                <td className="px-4 py-0 font-mono text-xs md:text-sm leading-6 text-gray-200 whitespace-pre-wrap break-all md:whitespace-pre md:break-normal">
                                  {line || " "}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap rounded-xl bg-secondary/50 p-4 font-mono text-sm leading-relaxed text-foreground">
                        {question.solution}
                      </pre>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No solution yet. Click Edit to add one.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <StickyNote className="h-4 w-4 text-stat-orange" />
                <h2 className="font-display text-sm font-semibold">Notes</h2>
              </div>
              {isEditing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Personal notes, edge cases, tips..."
                />
              ) : (
                <div>
                  {question.notes ? (
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {question.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No notes yet. Click Edit to add some.
                    </p>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={mutating}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {mutating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setSolution(question.solution || "");
                      setNotes(question.notes || "");
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar metadata */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Details
              </h3>
              <div className="space-y-3">
                {question.topic && (
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Topic</span>
                    <span className="ml-auto font-medium">
                      {question.topic}
                    </span>
                  </div>
                )}
                {question.source && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Source</span>
                    <span className="ml-auto font-mono text-xs">
                      {question.source}
                    </span>
                  </div>
                )}
                {question.solvedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Solved</span>
                    <span className="ml-auto text-xs">
                      {new Date(question.solvedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Created</span>
                  <span className="ml-auto text-xs">
                    {new Date(question.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {question.tags.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-primary/5 border border-primary/10 px-2.5 py-1 text-xs font-medium text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {question.companyTags.length > 0 && (
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Companies
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {question.companyTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-stat-blue/5 border border-stat-blue/10 px-2.5 py-1 text-xs font-medium text-stat-blue/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionDetailPage;
