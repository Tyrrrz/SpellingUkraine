declare module "*.css";

declare module "virtual:vocabulary" {
  import type { VocabularyEntry } from "spelling-ukraine-data";
  export const vocabulary: VocabularyEntry[];
}

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly BUILD_ID: string;
  readonly SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
