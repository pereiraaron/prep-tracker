const CODING_CATEGORIES = new Set(["dsa", "machine_coding", "language_framework"]);

/** Warm CodeEditor / MarkdownContent chunks before navigating to detail. */
export const prefetchDetailChunks = (category?: string | null) => {
  void import("@components/MarkdownContent");
  if (category && CODING_CATEGORIES.has(category)) {
    void import("@components/CodeEditor");
  }
};
