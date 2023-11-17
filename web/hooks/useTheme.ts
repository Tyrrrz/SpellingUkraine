import useLocalState from '~/hooks/useLocalState';

type Theme = 'light' | 'dark';

const useTheme = () => {
  return useLocalState<Theme>('theme', 'dark');
};

export default useTheme;
