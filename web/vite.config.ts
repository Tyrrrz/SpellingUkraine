import react from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { loadVocabulary } from "../data/index.ts";

// ---------------------------------------------------------------------------
// Virtual module: bundles all vocabulary JSON files at build time so that
// the data package's Node.js fs-based code never runs in the browser.
// ---------------------------------------------------------------------------
function vocabularyPlugin(): Plugin {
  const VIRTUAL_ID = "virtual:vocabulary";
  const RESOLVED_ID = "\0" + VIRTUAL_ID;

  return {
    name: "vocabulary",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return;

      const entries = [];
      for await (const entry of loadVocabulary()) {
        entries.push(entry);
      }

      return `export const vocabulary = ${JSON.stringify(entries)};`;
    },
  };
}

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const base = new URL(siteUrl).pathname.replace(/\/$/, "") + "/";

export default defineConfig({
  base,

  plugins: [
    react(),
    vocabularyPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.png", "logo.png", "logo.svg"],
      manifest: {
        name: "SpellingUkraine",
        short_name: "SpellingUkraine",
        icons: [
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#ffd700",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
    },
  },

  build: {
    outDir: "out",
    emptyOutDir: true,
  },

  // Inject env vars into the app bundle with fallbacks
  define: {
    "import.meta.env.BUILD_ID": JSON.stringify(process.env.BUILD_ID || ""),
    "import.meta.env.SITE_URL": JSON.stringify(siteUrl),
  },
});
