declare module "*.css";

interface ImportMeta {
  env: {
    SITE_URL: string;
    BASE_URL: string;
    BUILD_ID: string;
  };
}

declare module "virtual:vocabulary" {
  import type { VocabularyEntry } from "spelling-ukraine-data";
  export const vocabulary: VocabularyEntry[];
}
