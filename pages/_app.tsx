import type { AppProps } from 'next/app';
import Script from 'next/script';
import { FiAward, FiGithub, FiHeart } from 'react-icons/fi';
import { Box } from '../components/box';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { Meta } from '../components/meta';
import { getAnalyticsDsn, getBuildId } from '../utils/env';
import './globals.css';

const Header: React.FC = () => {
  return (
    <Link href="/">
      <Box
        type="header"
        classes={[
          'px-4',
          'py-8',
          'hover:bg-stone-800',
          'space-y-2',
          'text-neutral-100',
          'text-center'
        ]}
      >
        <Box classes={['text-4xl', 'font-bold']}>
          <Box type="span">Spelling </Box>
          <Box
            type="span"
            classes={[
              'text-blue-500',
              'underline',
              'underline-offset-4',
              'decoration-2',
              'decoration-wavy',
              'decoration-yellow-400'
            ]}
          >
            Ukraine
          </Box>
        </Box>

        <Box classes={['text-xl', 'font-light', 'tracking-wide']}>
          Language is political. Transliterate correctly.
        </Box>
      </Box>
    </Link>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <Box
      classes={[
        'flex-grow',
        'px-2',
        'lg:px-6',
        'py-6',
        'border-y-8',
        'border-blue-500',
        'bg-stone-200'
      ]}
    >
      <Box type="main" classes={['container', 'mx-auto']}>
        {children}
      </Box>
    </Box>
  );
};

const Footer: React.FC = () => {
  return (
    <Box
      type="footer"
      classes={['flex', 'p-4', 'place-content-center', 'text-sm', 'text-neutral-400', 'font-light']}
    >
      <HStack gap="large">
        <Box classes={['font-mono']}>{getBuildId() || 'unknown build'}</Box>

        <Box> • </Box>

        <Link href="https://github.com/Tyrrrz/SpellingUkraine" emphasize={false}>
          <HStack>
            <FiGithub strokeWidth={1} />
            <div>Contribute</div>
          </HStack>
        </Link>

        <Box> • </Box>

        <Link href="https://tyrrrz.me/donate" emphasize={false}>
          <HStack>
            <FiHeart strokeWidth={1} />
            <div>Donate</div>
          </HStack>
        </Link>

        <Box> • </Box>

        <Link href="/attribution" emphasize={false}>
          <HStack>
            <FiAward strokeWidth={1} />
            <div>Attribution</div>
          </HStack>
        </Link>
      </HStack>
    </Box>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />

      <Box
        classes={[
          'flex',
          'flex-col',
          'min-h-screen',
          'border-y-8',
          'border-y-yellow-400',
          'bg-stone-900'
        ]}
      >
        <Header />

        <Main>
          <Component {...pageProps} />
        </Main>

        <Footer />
      </Box>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${getAnalyticsDsn()}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${getAnalyticsDsn()}');
        `}
      </Script>
    </>
  );
};

export default App;
