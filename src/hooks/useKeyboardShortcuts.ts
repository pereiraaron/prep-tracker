import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      // Don't intercept when typing in inputs
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) return;

      // "/" — focus search input (if on questions page)
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const searchInput = document.getElementById("search-questions");
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }

      // "n" — navigate to new question
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only from pages that have questions context
        if (["/", "/questions", "/backlog"].includes(location.pathname)) {
          e.preventDefault();
          navigate("/question/new");
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [navigate, location.pathname]);
};

export default useKeyboardShortcuts;
