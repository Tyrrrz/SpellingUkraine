import { useMemo } from 'react';
import useLocalState from '~/hooks/useLocalState';
import useMedia from '~/hooks/useMedia';

const useTheme = () => {
  const [userPreferredTheme, setUserPreferredTheme] = useLocalState<'light' | 'dark' | null>(
    'theme',
    null
  );

  const systemPrefersDarkTheme = useMedia('(prefers-color-scheme: dark)');
  const systemPrefersLightTheme = useMedia('(prefers-color-scheme: light)');
  const systemPreferredTheme = useMemo<'light' | 'dark' | null>(() => {
    if (systemPrefersDarkTheme) {
      return 'dark';
    }

    if (systemPrefersLightTheme) {
      return 'light';
    }

    return null;
  }, [systemPrefersDarkTheme, systemPrefersLightTheme]);

  return useMemo(() => {
    return {
      userPreferredTheme,
      systemPreferredTheme,
      theme:
        userPreferredTheme ||
        systemPreferredTheme ||
        // Default to dark to avoid flash banging users
        'dark',
      setTheme: setUserPreferredTheme
    };
  }, [systemPreferredTheme, userPreferredTheme, setUserPreferredTheme]);
};

export default useTheme;
