import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    extends: [...nextCoreWebVitals],
  },
]);
