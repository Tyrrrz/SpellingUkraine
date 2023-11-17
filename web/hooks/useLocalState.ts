import useBrowserState from '~/hooks/useBrowserState';

const useLocalState = <T>(key: string, initialState: T) => {
  return useBrowserState('local', key, initialState);
};

export default useLocalState;
