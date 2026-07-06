import type { Solution } from "@api/questions";
import type { PrepCategory } from "@api/types";
import { MAX_SOLUTIONS, MULTIPLE_SOLUTIONS_CATEGORIES, SOLUTION_OPTIONAL_CATEGORIES } from "@api/types";

export const emptySolution = (): Solution => ({ content: "" });

export const defaultSolutions = (): Solution[] => [emptySolution()];

export const solutionsHaveContent = (solutions: Solution[]) =>
  solutions.some((s) => s.content.trim());

export const isSolutionRequired = (category: PrepCategory) =>
  !SOLUTION_OPTIONAL_CATEGORIES.includes(category);

export const allowsMultipleSolutions = (category: PrepCategory) =>
  MULTIPLE_SOLUTIONS_CATEGORIES.includes(category);

export const solutionsToEditable = (solutions?: Solution[]): Solution[] => {
  if (solutions?.length) {
    return solutions.map((s) => ({ content: s.content }));
  }
  return defaultSolutions();
};

export const normalizeSolutionsForSubmit = (
  solutions: Solution[],
  category: PrepCategory,
): Solution[] | undefined => {
  const withContent = solutions
    .map((s) => ({ content: s.content.trim() }))
    .filter((s) => s.content);

  if (!withContent.length) return undefined;
  if (!allowsMultipleSolutions(category)) return [withContent[0]];
  return withContent.slice(0, MAX_SOLUTIONS);
};

export const validateSolutions = (solutions: Solution[], category: PrepCategory): string | null => {
  const withContent = solutions.filter((s) => s.content.trim());

  if (isSolutionRequired(category) && !withContent.length) {
    return "Solution is required for this category";
  }
  if (withContent.length > 1 && !allowsMultipleSolutions(category)) {
    return "Multiple solutions are only allowed for DSA and Machine Coding categories";
  }
  if (withContent.length > MAX_SOLUTIONS) {
    return `Maximum ${MAX_SOLUTIONS} solutions allowed`;
  }
  return null;
};
