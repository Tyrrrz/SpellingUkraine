import { useEffect, useState } from 'react';

// This hook is used to wrap a value that should only be materizlied after hydration.
// Used to avoid content mismatch errors that may occur when rendering non-deterministic output.
const useClientOnlyValue = <T>(value: T) => {
  const isClientSide = typeof window !== 'undefined';
  const [clientValue, setClientValue] = useState<T>();

  useEffect(() => {
    if (!isClientSide) {
      return;
    }

    setClientValue(value);
  }, [value, isClientSide]);

  return clientValue;
};

export default useClientOnlyValue;
