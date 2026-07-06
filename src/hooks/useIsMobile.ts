import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768; // matches Tailwind's md breakpoint
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsMobile;
