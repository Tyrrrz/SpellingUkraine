import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useRouterStatus = () => {
  const { events } = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    const onRouteChangeStart = () => {
      setStatus('loading');
    };

    const onRouteChangeComplete = () => {
      setStatus('idle');
    };

    const onRouteChangeError = () => {
      setStatus('error');
    };

    events.on('routeChangeStart', onRouteChangeStart);
    events.on('routeChangeComplete', onRouteChangeComplete);
    events.on('routeChangeError', onRouteChangeError);

    return () => {
      events.off('routeChangeStart', onRouteChangeStart);
      events.off('routeChangeComplete', onRouteChangeComplete);
      events.off('routeChangeError', onRouteChangeError);
    };
  }, [events]);

  return status;
};

export default useRouterStatus;
