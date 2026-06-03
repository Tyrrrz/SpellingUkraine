declare module "*.css";

declare module "virtual:vocabulary" {
  import type { VocabularyEntry } from "spelling-ukraine-data";
  export const vocabulary: VocabularyEntry[];
}

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly BASE_URL: string;
  readonly BUILD_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
