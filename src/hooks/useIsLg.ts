import { useSyncExternalStore } from "react";

const LG_BREAKPOINT = 1024; // Tailwind lg
const QUERY = `(min-width: ${LG_BREAKPOINT}px)`;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** True at Tailwind `lg` and up — for gating desktop-only sidebars. */
const useIsLg = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsLg;
