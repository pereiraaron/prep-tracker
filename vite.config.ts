import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5176,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@queries": path.resolve(__dirname, "./src/queries"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — shared by everything
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react";
          }
          // Router
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          // React Query
          if (id.includes("node_modules/@tanstack")) {
            return "react-query";
          }
          // Recharts (only used by StatsPage)
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "charts";
          }
          // CodeMirror (lazy-loaded by QuestionDetailPage)
          if (id.includes("node_modules/@codemirror") || id.includes("node_modules/@uiw") || id.includes("node_modules/@lezer")) {
            return "codemirror";
          }
          // Icons
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          // Radix UI primitives
          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }
          // Utility libs (cva, clsx, tailwind-merge, sonner)
          if (
            id.includes("node_modules/sonner") ||
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "ui-utils";
          }
        },
      },
    },
  },
}));
