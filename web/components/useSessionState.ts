import React from 'react';

const getStorageItem = (key: string) => {
  if (typeof window === 'undefined' || !sessionStorage) {
    return null;
  }

  const item = sessionStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }

  return null;
};

const setStorageItem = (key: string, value: any) => {
  if (typeof window === 'undefined' || !sessionStorage) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
};

export const useSessionState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = React.useState<T>(() => {
    return getStorageItem(key) ?? initialValue;
  });

  React.useEffect(() => setStorageItem(key, value), [key, value]);

  return [value, setValue] as const;
};
