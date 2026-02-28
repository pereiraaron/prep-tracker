import { useToastStore } from "@store/useToastStore";
import { useShallow } from "zustand/react/shallow";

const useToast = () =>
  useToastStore(
    useShallow((s) => ({
      toasts: s.toasts,
      toast: s.toast,
      dismiss: s.dismiss,
    })),
  );

export default useToast;
