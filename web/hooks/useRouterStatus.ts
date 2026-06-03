// Navigation status is always idle in a Vite SPA (instant client-side routing).
// This hook is retained for interface compatibility but is no longer used by the layout.
export const useRouterStatus = (): "idle" | "loading" | "error" => {
  return "idle";
};
