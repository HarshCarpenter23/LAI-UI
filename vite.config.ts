import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [
    ...mochaPlugins(process.env as any),
    react(),
    // Skip Cloudflare plugin on Vercel — it changes output structure
    // and requires the Workers runtime which Vercel doesn't support
    ...(process.env.NODE_ENV === "production" && !process.env.VERCEL
      ? [cloudflare()]
      : []),
  ],
  server: {
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
    // Explicit output dir so Vercel always finds index.html at dist/
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});