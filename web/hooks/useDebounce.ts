import { useEffect, useMemo, useState } from "react";

export const useDebounce = <T>(value: T, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isDebouncing = value !== debouncedValue;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return useMemo(() => {
    return {
      value: debouncedValue,
      isDebouncing,
    };
  }, [debouncedValue, isDebouncing]);
};
