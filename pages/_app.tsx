import classNames from 'classnames';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { FiAward, FiGithub, FiHeart } from 'react-icons/fi';
import { HStack } from '../components/hstack';
import { Link } from '../components/link';
import { Meta } from '../components/meta';
import { getAnalyticsDsn, getBuildId } from '../utils/env';
import './globals.css';

const Header: React.FC = () => {
  return (
    <Link href="/">
      <header
        className={classNames(
          'px-4',
          'py-8',
          'hover:bg-stone-800',
          'space-y-2',
          'text-neutral-100',
          'text-center'
        )}
      >
        <div className={classNames('text-4xl', 'font-bold')}>
          <span>Spelling </span>
          <span
            className={classNames(
              'text-blue-500',
              'underline',
              'underline-offset-4',
              'decoration-2',
              'decoration-wavy',
              'decoration-yellow-400'
            )}
          >
            Ukraine
          </span>
        </div>

        <div className={classNames('text-xl', 'font-light', 'tracking-wide')}>
          Language is political. Romanize correctly.
        </div>
      </header>
    </Link>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <div
      className={classNames('flex-grow', 'p-8', 'border-y-8', 'border-blue-500', 'bg-stone-200')}
    >
      <main className={classNames('container', 'mx-auto')}>{children}</main>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer
      className={classNames(
        'flex',
        'p-4',
        'place-content-center',
        'text-sm',
        'text-neutral-400',
        'font-light'
      )}
    >
      <HStack gap="large">
        <div className={classNames('font-mono')}>{getBuildId() || 'unknown build'}</div>

        <div> • </div>

        <Link href="https://github.com/Tyrrrz/SpellingUkraine" emphasize={false}>
          <HStack>
            <FiGithub strokeWidth={1} />
            <div>Contribute</div>
          </HStack>
        </Link>

        <div> • </div>

        <Link href="https://tyrrrz.me/donate" emphasize={false}>
          <HStack>
            <FiHeart strokeWidth={1} />
            <div>Donate</div>
          </HStack>
        </Link>

        <div> • </div>

        <Link href="/attribution" emphasize={false}>
          <HStack>
            <FiAward strokeWidth={1} />
            <div>Attribution</div>
          </HStack>
        </Link>
      </HStack>
    </footer>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />

      <div
        className={classNames(
          'flex',
          'flex-col',
          'min-h-screen',
          'border-y-8',
          'border-y-yellow-400',
          'bg-stone-900'
        )}
      >
        <Header />

        <Main>
          <Component {...pageProps} />
        </Main>

        <Footer />
      </div>

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
