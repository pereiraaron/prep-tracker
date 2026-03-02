import { create } from "zustand";
import type { ReactNode } from "react";
import type { ToastActionElement, ToastProps } from "@components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
};

type Toast = Omit<ToasterToast, "id">;

interface ToastState {
  toasts: ToasterToast[];
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  dismiss: (toastId?: string) => void;
}

let count = 0;
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState>((set) => {
  const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) return;
    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId);
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }));
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
  };

  const dismiss = (toastId?: string) => {
    set((state) => {
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id));
      }
      return {
        toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)),
      };
    });
  };

  return {
    toasts: [],

    toast: (props) => {
      const id = genId();

      const update = (props: ToasterToast) =>
        set((state) => ({
          toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...props } : t)),
        }));

      const dismissThis = () => dismiss(id);

      set((state) => ({
        toasts: [
          {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
              if (!open) dismissThis();
            },
          },
          ...state.toasts,
        ].slice(0, TOAST_LIMIT),
      }));

      return { id, dismiss: dismissThis, update };
    },

    dismiss,
  };
});

// Convenience export for use outside React components
export const toast = (...args: Parameters<ToastState["toast"]>) => useToastStore.getState().toast(...args);
