import { useEffect, useState } from 'react';

const useMedia = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(media.matches);

    const onChange = () => setMatches(media.matches);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

export default useMedia;
