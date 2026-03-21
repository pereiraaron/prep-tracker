import { lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestionDetail, useTemplates, useSubmission, useSaveSubmission } from "@queries/useQuestions";
import usePageTitle from "@hooks/usePageTitle";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { DifficultyBadge, CategoryBadge } from "@components/Badge";
import { toast } from "@components/ui/sonner";

const Playground = lazy(() => import("@components/Playground"));

const REACT_FILES: Record<string, string> = {
  "/public/index.html": `<div id="root"></div>`,
  "/src/App.js": `export default function App() {\n  return <h1>Hello World</h1>;\n}\n`,
  "/src/index.js": `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\nimport "./styles.css";\n\ncreateRoot(document.getElementById("root")).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`,
  "/src/styles.css": `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n`,
};

const VANILLA_FILES: Record<string, string> = {
  "/index.html": `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Solution</title>\n  <link rel="stylesheet" href="./index.css" />\n</head>\n<body>\n  <div id="app"></div>\n  <script src="./index.js"></script>\n</body>\n</html>`,
  "/index.js": `// Write your solution here\nconsole.log("Hello World");\n`,
  "/index.css": `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n`,
};

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: question, isLoading } = useQuestionDetail(id);
  const { data: templates } = useTemplates(id);
  const { data: submission } = useSubmission(id);
  const saveMutation = useSaveSubmission();

  usePageTitle(question?.title ? `Practice: ${question.title}` : "Practice");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="font-display text-lg font-semibold">Question not found</p>
        <button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const isMachineCoding = question.category === "machine_coding";
  const defaultFiles = isMachineCoding ? REACT_FILES : VANILLA_FILES;

  // Priority: saved submission > question templates > default files
  const files = submission?.files ?? templates ?? defaultFiles;

  const handleSave = (currentFiles: Record<string, string>) => {
    saveMutation.mutate(
      { id: id!, files: currentFiles },
      {
        onSuccess: () => toast.success("Progress saved"),
        onError: () => toast.error("Failed to save"),
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Compact header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <span className="h-4 w-px bg-border" />
          <h1 className="font-display text-sm font-semibold truncate max-w-[300px] md:max-w-none">
            {question.title}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5">
            {question.difficulty && <DifficultyBadge value={question.difficulty} />}
            {question.category && <CategoryBadge value={question.category} />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {question.url && (
            <a
              href={question.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Problem</span>
            </a>
          )}
          {submission && (
            <span className="hidden sm:inline text-[10px] text-muted-foreground">
              Saved {new Date(submission.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Playground */}
      <div className="flex-1 p-3">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <Playground
            files={files}
            template={isMachineCoding ? "react" : "vanilla"}
            showFileExplorer={isMachineCoding}
            showPreview={isMachineCoding}
            showConsole
            onSave={handleSave}
            saving={saveMutation.isPending}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default PracticePage;
