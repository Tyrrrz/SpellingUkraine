import { useEffect, useState } from 'react';
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

  return [actualTheme, setUserPreferredTheme] as const;
};

export default useTheme;
