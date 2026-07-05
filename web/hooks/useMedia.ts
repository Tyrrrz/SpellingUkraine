import { useCallback, useMemo, useSyncExternalStore } from "react";

export const useMedia = (query: string) => {
  const media = useMemo(() => window.matchMedia(query), [query]);

  const subscribe = useCallback(
    (callback: () => void) => {
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [media],
  );

  const getSnapshot = useCallback(() => media.matches, [media]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
