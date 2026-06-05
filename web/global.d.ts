/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly BUILD_ID: string;
}

declare module "virtual:vocabulary" {
  import type { VocabularyEntry } from "spelling-ukraine-data";
  export const vocabulary: VocabularyEntry[];
}
