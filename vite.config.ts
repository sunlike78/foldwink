/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  // Enable top-level await — appStore.ts blocks module evaluation on
  // `ensureLangLoaded(lang)` so session-resume sees a populated non-EN
  // pool. All supported Foldwink targets (Chrome 89+, Safari 15+,
  // Firefox 89+) have native TLA.
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        // Puzzle JSONs are imported via `import.meta.glob({eager:false})`
        // in loaderDe.ts / loaderRu.ts. Without guidance, Rollup emits
        // a separate chunk per JSON file — 500+ tiny chunks per language,
        // which translates to a flood of HTTP requests on first switch.
        // Collapse each language's pool into a single chunk.
        manualChunks(id) {
          if (id.includes("/puzzles/de/pool/")) return "puzzles-de";
          if (id.includes("/puzzles/ru/pool/")) return "puzzles-ru";
          return undefined;
        },
      },
    },
  },
  esbuild: {
    target: "es2022",
  },
  test: {
    globals: true,
    environment: "node",
  },
});
