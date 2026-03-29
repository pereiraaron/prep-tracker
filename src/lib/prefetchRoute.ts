// Maps routes to their lazy-loaded chunk imports.
// Call prefetchRoute(path) on hover/focus to preload the JS bundle.
const routeImports: Record<string, () => Promise<unknown>> = {
  "/questions/": () => import("@pages/QuestionDetailPage"),
  "/question/new": () => import("@pages/NewQuestionPage"),
  "/backlog": () => import("@pages/BacklogPage"),
  "/settings": () => import("@pages/SettingsPage"),
  "/revision": () => import("@pages/RevisionPage"),
};

const prefetched = new Set<string>();

const prefetchRoute = (path: string) => {
  // Match exact or prefix (e.g. /questions/:id matches /questions/)
  for (const [prefix, importFn] of Object.entries(routeImports)) {
    if (path === prefix || path.startsWith(prefix)) {
      if (prefetched.has(prefix)) return;
      prefetched.add(prefix);
      importFn();
      return;
    }
  }
};

export default prefetchRoute;
