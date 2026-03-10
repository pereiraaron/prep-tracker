import usePageTitle from "@hooks/usePageTitle";
import { lazy, Suspense, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@components/Layout";
import { useQuestionDetail, useUpdateQuestion, useStarQuestion } from "@queries/useQuestions";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
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
const CodeEditor = lazy(() => import("@components/CodeEditor"));


const QuestionDetailPage = () => {
  usePageTitle("Question Details");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: question, isLoading } = useQuestionDetail(id);
  const updateMutation = useUpdateQuestion();
  const starMutation = useStarQuestion();
  const mutating = updateMutation.isPending;

  const [isEditing, setIsEditing] = useState(false);
  const [solution, setSolution] = useState(question?.solution || "");
  const [notes, setNotes] = useState(question?.notes || "");
  const [copied, setCopied] = useState(false);

  const questionSolution = question?.solution || "";
  const questionNotes = question?.notes || "";
  if (!isEditing && solution !== questionSolution) setSolution(questionSolution);
  if (!isEditing && notes !== questionNotes) setNotes(questionNotes);

  const cat = question?.category ?? null;
  const diff = question?.difficulty;
  const codingCategories = ["dsa", "machine_coding", "language_framework"];
  const isCodeQuestion = cat ? codingCategories.includes(cat) : false;

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: id!, body: { solution, notes } });
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
  const hasMetadata = question.topic || question.source || hasTags || hasCompanyTags;

  return (
    <Layout>
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="glass-card rounded-xl p-4 md:p-5 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-lg md:text-xl font-bold">{question.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {diff && <DifficultyBadge value={diff} />}
                {cat && <CategoryBadge value={cat} />}
                {question.status === "solved" && (
                  <span className="rounded-md bg-stat-green/10 border border-stat-green/20 px-1.5 py-0.5 text-[10px] font-semibold text-stat-green">
                    Solved
                  </span>
                )}
              </div>
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
                onClick={() => starMutation.mutate(id!)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-stat-orange hover:bg-stat-orange/10 transition-all"
              >
                <Star className={`h-4 w-4 ${question.starred ? "fill-stat-orange text-stat-orange" : ""}`} />
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

          {/* Metadata: Topic, Source, Tags, Company Tags */}
          {hasMetadata && (
            <div className="border-t border-border pt-4 space-y-3">
              {(question.topic || question.source) && (
                <div className="flex flex-wrap items-center gap-2">
                  {question.topic && (
                    <>
                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                      {question.topic.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[11px] font-medium text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </>
                  )}
                  {question.topic && question.source && <span className="mx-1 h-4 w-px bg-border" />}
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

        {/* Solution */}
        {isCodeQuestion ? (
          <div className="rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[hsl(220,13%,18%)] px-4 py-3 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Code2 className={`h-4 w-4 ${isEditing ? "text-stat-blue" : "text-emerald-400"}`} />
                <h2 className="font-display text-sm font-semibold text-gray-300">Solution</h2>
              </div>
              {!isEditing && question.solution && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            {question.solution || isEditing ? (
              <Suspense fallback={<div className="bg-[hsl(220,13%,18%)] rounded-b-xl px-4 py-8 text-center"><p className="text-sm text-gray-500">Loading editor...</p></div>}>
                <CodeEditor
                  value={isEditing ? solution : question.solution || ""}
                  onChange={isEditing ? setSolution : undefined}
                  editable={isEditing}
                  readOnly={!isEditing}
                  maxHeight={isEditing ? "500px" : "600px"}
                  placeholder="Write your solution..."
                />
              </Suspense>
            ) : (
              <div className="bg-[hsl(220,13%,18%)] rounded-b-xl px-4 py-6 text-center">
                <p className="text-sm text-gray-500 italic">No solution yet. Click Edit to add one.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-stat-blue" />
              <h2 className="font-display text-sm font-semibold">Solution</h2>
            </div>
            {isEditing ? (
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={10}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Write your solution..."
              />
            ) : (
              <div>
                {question.solution ? (
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{question.solution}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No solution yet. Click Edit to add one.</p>
                )}
              </div>
            )}
          </div>
        )}

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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 resize-none"
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

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={mutating}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {mutating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
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
    </Layout>
  );
};

export default QuestionDetailPage;
