import { useMemo } from "react";
import { useLocalState } from "./useLocalState";
import { useMedia } from "./useMedia";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [userPreferredTheme, setUserPreferredTheme] = useLocalState<Theme | null>("theme", null);

  const systemPrefersDarkTheme = useMedia("(prefers-color-scheme: dark)");
  const systemPrefersLightTheme = useMedia("(prefers-color-scheme: light)");
  const systemPreferredTheme = useMemo<Theme | null>(() => {
    if (systemPrefersDarkTheme) {
      return "dark";
    }

    if (systemPrefersLightTheme) {
      return "light";
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
        "dark",
      setTheme: setUserPreferredTheme,
    };
  }, [systemPreferredTheme, userPreferredTheme, setUserPreferredTheme]);
};
