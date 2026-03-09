import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // server-only is a Next.js compile-time guard; stub it out in test environment
      "server-only": path.resolve(__dirname, "tests/__mocks__/server-only.ts"),
    },
  },
})
