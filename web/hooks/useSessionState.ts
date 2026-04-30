import useBrowserState from "~/hooks/useBrowserState";

const useLocalState = <T>(key: string, initialState: T) => {
  return useBrowserState("session", key, initialState);
};

export default useLocalState;
