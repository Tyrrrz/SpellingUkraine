import { useBrowserState } from "~/hooks/useBrowserState";

export const useSessionState = <T>(key: string, initialState: T) => {
  return useBrowserState("session", key, initialState);
};
