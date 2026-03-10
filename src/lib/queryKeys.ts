import type { QuestionsFilter } from "@api/questions";

interface QuestionListParams extends QuestionsFilter {
  search?: string;
}

export const queryKeys = {
  stats: {
    all: ["stats"] as const,
    overview: () => [...queryKeys.stats.all, "overview"] as const,
    categories: () => [...queryKeys.stats.all, "categories"] as const,
    difficulties: () => [...queryKeys.stats.all, "difficulties"] as const,
    progress: () => [...queryKeys.stats.all, "progress"] as const,
    weekly: () => [...queryKeys.stats.all, "weekly"] as const,
    cumulative: () => [...queryKeys.stats.all, "cumulative"] as const,
    topics: () => [...queryKeys.stats.all, "topics"] as const,
    sources: () => [...queryKeys.stats.all, "sources"] as const,
    companyTags: () => [...queryKeys.stats.all, "companyTags"] as const,
    heatmap: () => [...queryKeys.stats.all, "heatmap"] as const,
    difficultyByCategory: () => [...queryKeys.stats.all, "difficultyByCategory"] as const,
    streaks: () => [...queryKeys.stats.all, "streaks"] as const,
    insights: () => [...queryKeys.stats.all, "insights"] as const,
  },
  questions: {
    all: ["questions"] as const,
    list: (params: QuestionListParams) =>
      [...queryKeys.questions.all, "list", JSON.parse(JSON.stringify(params))] as const,
    detail: (id: string) => [...queryKeys.questions.all, "detail", id] as const,
    recent: () => [...queryKeys.questions.all, "recent"] as const,
  },
  backlog: {
    all: ["backlog"] as const,
  },
};
