import { useCallback, useSyncExternalStore } from "react";

type StorageKind = "local" | "session";

const getStorage = (kind: StorageKind) => {
  switch (kind) {
    case "local":
      return localStorage;
    case "session":
      return sessionStorage;
  }
};

const getStorageValue = (storage: Storage, key: string) => {
  const item = storage.getItem(key);

  if (typeof item !== "undefined" && item !== null) {
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  return null;
};

const setStorageValue = (storage: Storage, key: string, value: unknown) => {
  if (typeof value !== "undefined" && value !== null) {
    storage.setItem(key, JSON.stringify(value));
  } else {
    storage.removeItem(key);
  }

  // Storage events are not triggered within the same page that modified the storage,
  // so we need to dispatch the event manually to make sure that other hooks get notified.
  dispatchEvent(new StorageEvent("storage"));
};

export const useBrowserState = <T>(storageKind: StorageKind, key: string, initialState: T) => {
  const subscribe = useCallback((callback: () => void) => {
    addEventListener("storage", callback);
    return () => removeEventListener("storage", callback);
  }, []);

  const getSnapshot = useCallback(() => {
    const item = getStorageValue(getStorage(storageKind), key);
    return item !== null ? (item as T) : initialState;
  }, [storageKind, key, initialState]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => initialState);

  const setValue = useCallback(
    (newValue: T) => {
      setStorageValue(getStorage(storageKind), key, newValue);
    },
    [storageKind, key],
  );

  return [value, setValue] as const;
};
