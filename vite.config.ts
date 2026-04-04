import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "tests/app"),
  resolve: {
    alias: {
      "@rj11io/lsdb": resolve(__dirname, "../lsdb/src/index.ts"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
