import { useBrowserState } from "./useBrowserState";

export const useSessionState = <T>(key: string, initialState: T) => {
  return useBrowserState("session", key, initialState);
};
