import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { FiChevronLeft, FiGithub, FiHeart } from 'react-icons/fi';
import Box from '../components/box';
import HStack from '../components/hstack';
import Image from '../components/image';
import Link from '../components/link';
import Meta from '../components/meta';
import useMediaQuery from '../components/useMediaQuery';
import { getBuildId, getGoogleAnalyticsToken } from '../utils/env';
import './globals.css';

const Header: React.FC = () => {
  const sm = useMediaQuery('(min-width: 640px)');

  return (
    <Link href="/">
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
          <Box style={{ width: sm ? '96px' : '64px', height: sm ? '96px' : '64px' }}>
            <Image src="/logo.svg" alt="Spelling Ukraine" />
          </Box>

          <Box classes={['w-px', 'h-12', 'sm:h-16', 'bg-neutral-600']} />

          <Box>
            <Box classes={['flex', 'text-3xl', 'sm:text-4xl']}>
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
    </Link>
  );
};

const Divider: React.FC = () => {
  const router = useRouter();

  if (router.route === '/') {
    return null;
  }

  return (
    <Box classes={['border-y', 'bg-neutral-100']}>
      <Box classes={['container', 'mx-auto', 'my-3', 'px-4']}>
        <Link href="/">
          <HStack gap="medium">
            <FiChevronLeft />
            <Box>Home</Box>
          </HStack>
        </Link>
      </Box>
    </Box>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <Box classes={['flex-grow', 'bg-white']}>
      <Box type="main" classes={['container', 'mx-auto', 'mt-6', 'mb-8', 'px-4']}>
        {children}
      </Box>
    </Box>
  );
};

const Footer: React.FC = () => {
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
      <HStack wrap gap="large">
        <Box classes={['font-mono']}>{getBuildId() || 'unknown build'}</Box>

        <Box> • </Box>

        <Link href="https://github.com/Tyrrrz/SpellingUkraine" emphasize={false}>
          <HStack>
            <FiGithub strokeWidth={1} />
            <div>Source</div>
          </HStack>
        </Link>

        <Box> • </Box>

        <Link href="https://tyrrrz.me/donate" emphasize={false}>
          <HStack>
            <FiHeart strokeWidth={1} />
            <div>Donate</div>
          </HStack>
        </Link>
      </HStack>
    </Box>
  );
};

const Scripts: React.FC = () => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${getGoogleAnalyticsToken()}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${getGoogleAnalyticsToken()}');
  `}
      </Script>
    </>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />

      <Box classes={['flex', 'flex-col', 'min-h-screen', 'bg-neutral-50']}>
        <Header />

        <Divider />

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
