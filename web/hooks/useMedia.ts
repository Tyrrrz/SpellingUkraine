import { useCallback, useMemo, useSyncExternalStore } from "react";

export const useMedia = (query: string) => {
  const media = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia(query) : null),
    [query],
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      media?.addEventListener("change", callback);
      return () => media?.removeEventListener("change", callback);
    },
    [media],
  );

  const getSnapshot = useCallback(() => media?.matches ?? false, [media]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
