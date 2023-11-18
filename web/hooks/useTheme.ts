import { useEffect, useMemo, useState } from 'react';
import useLocalState from '~/hooks/useLocalState';
import useMedia from '~/hooks/useMedia';

type Theme = 'light' | 'dark';

const useTheme = () => {
  const systemPreferredTheme = useMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [userPreferredTheme, setUserPreferredTheme] = useLocalState<Theme | null>('theme', null);
  const [actualTheme, setActualTheme] = useState<Theme>(systemPreferredTheme);

  // If the user has not set a preferred theme, use the system's preferred theme
  useEffect(() => {
    if (userPreferredTheme) {
      setActualTheme(userPreferredTheme);
    } else {
      setActualTheme(systemPreferredTheme);
    }
  }, [systemPreferredTheme, userPreferredTheme]);

  return useMemo(() => {
    return {
      systemPreferredTheme,
      userPreferredTheme,
      theme: actualTheme,
      setTheme: setUserPreferredTheme
    };
  }, [systemPreferredTheme, userPreferredTheme, setUserPreferredTheme, actualTheme]);
};

export default useTheme;
