import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { FC, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';
import { FiChevronLeft, FiGithub, FiHeart } from 'react-icons/fi';
import Box from '../components/box';
import Image from '../components/image';
import Link from '../components/link';
import Meta from '../components/meta';
import RawLink from '../components/rawlink';
import Stack from '../components/stack';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { getBuildId, getGoogleAnalyticsId, isProduction } from '../utils/env';
import './globals.css';

const Loader: FC = () => {
  const router = useRouter();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Only show loading indicator if the navigation takes a while.
  // This prevents indicator from flashing during faster navigation.
  const isVisible = useDebouncedValue(isNavigating, 300);

  useEffect(() => {
    const onRouteChangeStart = () => {
      setIsNavigating(true);
      setProgress(0);
    };

    const onRouteChangeComplete = () => {
      setIsNavigating(false);
      setProgress(1);
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.events.on('routeChangeError', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeError', onRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => clearInterval(interval);
  }, [isNavigating]);

  return (
    <Box
      classes={[
        'h-1',
        {
          'bg-ukraine-blue': isVisible,
          'bg-transparent': !isVisible
        }
      ]}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms'
      }}
    />
  );
};

const Nav: FC = () => {
  return (
    <RawLink href="/">
      <Box classes={['border-b', 'bg-white', 'hover:bg-neutral-50']}>
        <Box
          type="header"
          classes={[
            'flex',
            'w-fit',
            'mx-auto',
            'px-4',
            'py-6',
            'items-center',
            'gap-x-4',
            'sm:gap-x-6',
            'text-neutral-900'
          ]}
        >
          <Box classes={['w-[64px]', 'sm:w-[96px]']}>
            <Image src="/logo.svg" alt="Spelling Ukraine" priority />
          </Box>

          <Box classes={['w-px', 'h-12', 'sm:h-16', 'bg-neutral-600']} />

          <Box>
            <Box classes={['flex', 'text-3xl', 'sm:text-4xl', 'font-semibold']}>
              <Box classes={['p-1', 'pl-2', 'sm:pb-2', 'bg-ukraine-blue', 'text-white']}>
                Spelling
              </Box>
              <Box classes={['p-1', 'pr-2', 'sm:pb-2', 'bg-ukraine-yellow']}>Ukraine</Box>
            </Box>

            <Box classes={['mt-1', 'text-sm', 'sm:text-xl', 'font-light', 'sm:tracking-wide']}>
              Language is political. Transliterate correctly.
            </Box>
          </Box>
        </Box>
      </Box>
    </RawLink>
  );
};

const MerchAdvertisement: FC = () => {
  return (
    <Box
      classes={['p-2', 'bg-ukraine-yellow', 'text-center', 'text-sm', 'hover:text-ukraine-blue']}
    >
      <RawLink href="https://merch4ukraine.org">
        👕 Buy exclusive merch &amp; support Ukraine! All proceeds go to charity 💙
      </RawLink>
    </Box>
  );
};

const Breadcrumb: FC = () => {
  const router = useRouter();

  if (router.route === '/') {
    return null;
  }

  return (
    <Box classes={['border-y', 'bg-neutral-100']}>
      <Box classes={['container', 'mx-auto', 'my-3', 'px-4']}>
        <Link href="/">
          <Stack orientation="horizontal" gap="medium">
            <FiChevronLeft />
            <Box>Home</Box>
          </Stack>
        </Link>
      </Box>
    </Box>
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  // Ensure that fade-in triggers each time the content changes
  const key = useMemo(() => Math.random() * (children?.toString()?.length || 17), [children]);

  return (
    <Box classes={['flex-grow', 'bg-white']}>
      <Box type="main" classes={['container', 'mx-auto', 'mt-6', 'mb-8', 'px-4']}>
        <FadeIn key={key}>{children}</FadeIn>
      </Box>
    </Box>
  );
};

const Footer: FC = () => {
  return (
    <Box
      type="footer"
      classes={[
        'flex',
        'p-4',
        'border-t',
        'bg-neutral-100',
        'place-content-center',
        'text-sm',
        'text-neutral-600',
        'font-light'
      ]}
    >
      <Stack orientation="horizontal" wrap gap="large">
        <Box classes={['font-mono']}>{getBuildId()}</Box>

        <Box> • </Box>

        <RawLink href="https://github.com/Tyrrrz/SpellingUkraine">
          <Box classes={['hover:text-ukraine-blue']}>
            <Stack orientation="horizontal">
              <FiGithub strokeWidth={1} />
              <Box>Source</Box>
            </Stack>
          </Box>
        </RawLink>

        <Box> • </Box>

        <RawLink href="https://tyrrrz.me/donate">
          <Box classes={['hover:text-ukraine-blue']}>
            <Stack orientation="horizontal">
              <FiHeart strokeWidth={1} />
              <Box>Donate</Box>
            </Stack>
          </Box>
        </RawLink>
      </Stack>
    </Box>
  );
};

const Scripts: FC = () => {
  const scripts: ReactNode[] = [];

  // Google Analytics (production build only)
  const googleAnalyticsId = getGoogleAnalyticsId();
  if (googleAnalyticsId && isProduction()) {
    scripts.push(
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        strategy="afterInteractive"
      />,

      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');
`}
      </Script>
    );
  }

  return <>{scripts}</>;
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />

      <Box classes={['flex', 'flex-col', 'min-h-screen', 'bg-neutral-50']}>
        <Loader />

        <Nav />

        <MerchAdvertisement />

        <Breadcrumb />

        <Main>
          <Component {...pageProps} />
        </Main>

        <Footer />
      </Box>

      <Scripts />
    </>
  );
};

export default App;
