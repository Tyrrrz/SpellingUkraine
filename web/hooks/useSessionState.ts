import { useEffect, useState } from 'react';

const getStorageValue = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  return null;
};

const setStorageValue = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const useSessionState = <T>(key: string, initialState: T) => {
  const isClientSide = typeof window !== 'undefined';
  const [value, setValue] = useState<T>(() =>
    isClientSide ? getStorageValue(key) ?? initialState : initialState
  );

  useEffect(() => {
    if (!isClientSide) {
      return;
    }

    setStorageValue(key, value);
  }, [key, isClientSide, value]);

  return [value, setValue] as const;
};

export default useSessionState;
