import { useEffect, useRef, useState } from 'react';

const getStorageValue = (key: string) => {
  const item = sessionStorage.getItem(key);

  if (typeof item !== 'undefined' && item !== null) {
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

  // Storage events are not triggered within the same page that modified the storage,
  // so we need to dispatch the event manually to make sure that other hooks get notified.
  dispatchEvent(new StorageEvent('storage'));
};

const useLocalState = <T>(key: string, initialState: T) => {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(initialState);

  // Initial value from the storage
  useEffect(() => {
    const item = getStorageValue(key);
    if (item) {
      setValue(item);
    }

    return () => {
      isMounted.current = false;
    };
  }, [key]);

  // Value changed by the consumer
  useEffect(() => {
    if (isMounted.current) {
      setStorageValue(key, value);
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  // Value changed in the storage
  useEffect(() => {
    const onChange = () => {
      setValue(getStorageValue(key));
    };

    addEventListener('storage', onChange);

    return () => {
      removeEventListener('storage', onChange);
    };
  }, [key]);

  return [value, setValue] as const;
};

export default useLocalState;
