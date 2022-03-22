import React from 'react';

const getStorageValue = (key: string) => {
  if (typeof window === 'undefined' || !sessionStorage) {
    return null;
  }

  const item = sessionStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }

  return null;
};

const setStorageValue = (key: string, value: any) => {
  if (typeof window === 'undefined' || !sessionStorage) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
};

const useSessionState = <T>(key: string, initialState: T | (() => T)) => {
  const [value, setValue] = React.useState<T>(() => getStorageValue(key) || initialState);

  React.useEffect(() => {
    setStorageValue(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

export default useSessionState;
