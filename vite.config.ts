import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
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
    react(),
    babel({ presets: [reactCompilerPreset()] }),
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
    chunkSizeWarningLimit: 750,
    rolldownOptions: {
      output: {
        // Rolldown pulls a group's dependencies into that group, so shared libs
        // (react, clsx, …) get higher priority than the lazy-only chunks
        // (charts, codemirror). Otherwise the entry has to import from those.
        codeSplitting: {
          groups: [
            // React core, shared by everything
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|scheduler|react-is|use-sync-external-store)[\\/]/,
              priority: 50,
            },
            { name: "router", test: /node_modules[\\/]react-router/, priority: 40 },
            { name: "react-query", test: /node_modules[\\/]@tanstack[\\/]/, priority: 40 },
            { name: "icons", test: /node_modules[\\/]lucide-react[\\/]/, priority: 40 },
            { name: "radix", test: /node_modules[\\/]@radix-ui[\\/]/, priority: 40 },
            // Utility libs (cva, clsx, tailwind-merge, sonner)
            {
              name: "ui-utils",
              test: /node_modules[\\/](sonner|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 40,
            },
            // Recharts (only used by StatsPage)
            { name: "charts", test: /node_modules[\\/](recharts|d3-)/, priority: 10 },
            // CodeMirror (lazy-loaded by QuestionDetailPage)
            { name: "codemirror", test: /node_modules[\\/](@codemirror|@uiw|@lezer)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
}));
