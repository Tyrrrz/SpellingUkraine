import { useEffect, useState } from 'react';

const useHydrated = <T>(value: T) => {
  const [hydratedValue, setHydratedValue] = useState<T>();

  useEffect(() => {
    setHydratedValue(value);
  }, [value]);

  return hydratedValue;
};

export default useHydrated;
