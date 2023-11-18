import { useMemo } from 'react';
import useLocalState from '~/hooks/useLocalState';
import useMedia from '~/hooks/useMedia';

type Theme = 'light' | 'dark';

const useTheme = () => {
  const systemPreferredTheme = useMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [userPreferredTheme, setUserPreferredTheme] = useLocalState<Theme | null>('theme', null);

  return useMemo(() => {
    return {
      systemPreferredTheme,
      userPreferredTheme,
      theme: userPreferredTheme || systemPreferredTheme,
      setTheme: setUserPreferredTheme
    };
  }, [systemPreferredTheme, userPreferredTheme, setUserPreferredTheme]);
};

export default useTheme;
