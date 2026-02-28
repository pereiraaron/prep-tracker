import { useQuestionsStore } from "@store/useQuestionsStore";
import { useShallow } from "zustand/react/shallow";

const useQuestions = () =>
  useQuestionsStore(
    useShallow((s) => ({
      questions: s.questions,
      pagination: s.pagination,
      listLoading: s.listLoading,
      listError: s.listError,
      currentQuestion: s.currentQuestion,
      detailLoading: s.detailLoading,
      detailError: s.detailError,
      recentSolved: s.recentSolved,
      recentLoading: s.recentLoading,
      mutating: s.mutating,
      fetchQuestions: s.fetchQuestions,
      fetchById: s.fetchById,
      fetchRecent: s.fetchRecent,
      createQuestion: s.createQuestion,
      updateQuestion: s.updateQuestion,
      deleteQuestion: s.deleteQuestion,
      starQuestion: s.starQuestion,
    })),
  );

export default useQuestions;
