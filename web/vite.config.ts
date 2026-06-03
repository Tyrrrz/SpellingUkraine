import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import path from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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

      const vocabDir = path.resolve(__dirname, "../data/vocabulary");
      const entries: unknown[] = [];

      async function readDir(dir: string) {
        const items = await fs.readdir(dir, { withFileTypes: true });
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            await readDir(fullPath);
          } else if (item.name.endsWith(".json")) {
            const data = JSON.parse(await fs.readFile(fullPath, "utf8"));
            entries.push({
              id: path.parse(item.name).name,
              path: path.relative(vocabDir, fullPath),
              incorrectSpellings: [],
              relatedSpellings: [],
              links: [],
              ...data,
            });
          }
        }
      }

      await readDir(vocabDir);

      return `export const vocabulary = ${JSON.stringify(entries)};`;
    },
  };
}

const siteUrl = process.env.SITE_URL;
const base = siteUrl ? new URL(siteUrl).pathname.replace(/\/$/, "") + "/" : "/";

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

  // Make process.env values available to the app bundle
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    "process.env.BUILD_ID": JSON.stringify(process.env.BUILD_ID ?? ""),
    "process.env.SITE_URL": JSON.stringify(siteUrl ?? ""),
  },
});
