declare module "*.css";

declare module "virtual:vocabulary" {
  import type { VocabularyEntry } from "spelling-ukraine-data";
  export const vocabulary: VocabularyEntry[];
}

interface ImportMeta {
  readonly env: Record<string, string>;
}
