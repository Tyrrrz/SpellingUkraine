import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { loadVocabulary } from "../data/index";
import { bufferIterable } from "./utils/async";

const vocabularyPlugin = () => {
  const VIRTUAL_ID = "virtual:vocabulary";
  const RESOLVED_ID = "\0" + VIRTUAL_ID;

  const plugin: Plugin = {
    name: "vocabulary",
    resolveId: (id) => {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load: async (id) => {
      if (id !== RESOLVED_ID) return;

      const entries = await bufferIterable(loadVocabulary());

      return `export const vocabulary = ${JSON.stringify(entries)};`;
    },
  };

  return plugin;
};

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const base = new URL(siteUrl).pathname.replace(/\/?$/, "/");

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
            src: `${base}logo.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#ffd700",
        background_color: "#ffffff",
        start_url: base,
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 3000,
  },

  define: {
    "import.meta.env.SITE_URL": JSON.stringify(siteUrl),
    "import.meta.env.BUILD_ID": JSON.stringify(process.env.BUILD_ID || ""),
  },
});
