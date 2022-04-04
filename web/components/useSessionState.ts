import React from 'react';

const getStorageValue = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }

  return null;
};

const setStorageValue = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const useSessionState = <T>(key: string, initialState: T) => {
  const isClientSide = typeof window !== 'undefined';
  const [value, setValue] = React.useState<T>(
    () => (isClientSide && getStorageValue(key)) ?? initialState
  );

  React.useEffect(() => {
    if (!isClientSide) {
      return;
    }

    setStorageValue(key, value);
  }, [key, isClientSide, value]);

  return [value, setValue] as const;
};

export default useSessionState;
