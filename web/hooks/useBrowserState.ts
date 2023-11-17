import { useEffect, useRef, useState } from 'react';

type StorageKind = 'local' | 'session';

const getStorage = (kind: StorageKind) => {
  switch (kind) {
    case 'local':
      return localStorage;
    case 'session':
      return sessionStorage;
  }
};

const getStorageValue = (storage: Storage, key: string) => {
  const item = storage.getItem(key);

  if (typeof item !== 'undefined' && item !== null) {
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  return null;
};

const setStorageValue = (storage: Storage, key: string, value: any) => {
  storage.setItem(key, JSON.stringify(value));

  // Storage events are not triggered within the same page that modified the storage,
  // so we need to dispatch the event manually to make sure that other hooks get notified.
  dispatchEvent(new StorageEvent('storage'));
};

const useLocalState = <T>(storageKind: StorageKind, key: string, initialState: T) => {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(initialState);

  // Initial value from the storage
  useEffect(() => {
    const item = getStorageValue(getStorage(storageKind), key);
    if (item) {
      setValue(item);
    }

    return () => {
      isMounted.current = false;
    };
  }, [storageKind, key]);

  // Value changed by the consumer
  useEffect(() => {
    if (isMounted.current) {
      setStorageValue(getStorage(storageKind), key, value);
    } else {
      isMounted.current = true;
    }
  }, [storageKind, key, value]);

  // Value changed in the storage
  useEffect(() => {
    const onChange = () => {
      setValue(getStorageValue(getStorage(storageKind), key));
    };

    addEventListener('storage', onChange);

    return () => {
      removeEventListener('storage', onChange);
    };
  }, [storageKind, key]);

  return [value, setValue] as const;
};

export default useLocalState;
