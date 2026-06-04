import { useBrowserState } from "./useBrowserState";

export const useLocalState = <T>(key: string, initialState: T) => {
  return useBrowserState("local", key, initialState);
};
