import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  use: { baseURL: "http://127.0.0.1:5174", browserName: "chromium", ...(process.env.PLAYWRIGHT_CHROME ? { channel: "chrome" } : {}) },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5174 --strictPort",
    url: "http://127.0.0.1:5174",
    env: { VITE_SUPABASE_URL: "https://photo-test.supabase.co", VITE_SUPABASE_ANON_KEY: "photo-test-public-key" },
  },
})
