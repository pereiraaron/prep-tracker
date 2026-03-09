import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useAuthStore } from "@store/useAuthStore";

// Restore theme before render to prevent flash
const theme = localStorage.getItem("theme");
if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark");
}

useAuthStore.getState().hydrate();

createRoot(document.getElementById("root")!).render(<App />);

// Load analytics after render (non-blocking)
import("@microsoft/clarity").then((Clarity) => Clarity.default.init("voau1fwlw1"));
