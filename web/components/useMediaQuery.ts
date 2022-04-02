import React from 'react';

const useMediaQuery = (query: string) => {
  const isClientSide = typeof window !== 'undefined';
  const [result, setResult] = React.useState<boolean>();

  React.useEffect(() => {
    if (!isClientSide) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const update = () => setResult(mediaQueryList.matches);

    update();

    mediaQueryList.addEventListener('change', update);
    return () => mediaQueryList.removeEventListener('change', update);
  }, [query, isClientSide]);

  return result;
};

export default useMediaQuery;
