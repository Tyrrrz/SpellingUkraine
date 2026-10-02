import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "url";

// TypeScript files are not linted because typescript-eslint does not support
// TypeScript 7 yet. See https://github.com/typescript-eslint/typescript-eslint/issues/10940.
export default defineConfig([
  includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
  { ignores: ["**/*.{ts,tsx}"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]);
