import { useMemo } from 'react';
import useLocalState from '~/hooks/useLocalState';
import useMedia from '~/hooks/useMedia';

const useTheme = () => {
  const systemPreferredTheme = useMedia('(prefers-color-scheme: dark)')
    ? ('dark' as const)
    : ('light' as const);

  const [userPreferredTheme, setUserPreferredTheme] = useLocalState<'light' | 'dark' | null>(
    'theme',
    null
  );

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
