import classNames from 'classnames';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FiGithub, FiHeart } from 'react-icons/fi';
import { HStack } from '../shared/hstack';
import { Link } from '../shared/link';
import './globals.css';

const Header: React.FC = () => {
  return (
    <header
      className={classNames(['p-8', 'lg:p-16', 'space-y-4', 'text-neutral-100', 'text-center'])}
    >
      <div className={classNames(['text-4xl', 'lg:text-6xl', 'font-bold'])}>
        <Link href="/">
          <span>Spelling </span>
          <span
            className={classNames([
              'text-blue-500',
              'underline',
              'underline-offset-4',
              'decoration-4',
              'decoration-wavy',
              'decoration-yellow-400'
            ])}
          >
            Ukraine
          </span>
        </Link>
      </div>

      <div className={classNames(['text-lg', 'lg:text-3xl', 'font-light', 'tracking-wide'])}>
        Language is political. Use it correctly.
      </div>
    </header>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <div
      className={classNames(['flex-grow', 'p-8', 'border-y-8', 'border-blue-500', 'bg-stone-200'])}
    >
      <main className={classNames(['container', 'mx-auto'])}>{children}</main>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer
      className={classNames('flex', 'p-4', 'place-content-center', 'gap-x-4', 'text-neutral-300')}
    >
      <Link href="https://github.com/Tyrrrz/SpellingUkraine">
        <HStack>
          <FiGithub />
          <div>Contribute</div>
        </HStack>
      </Link>

      <div> • </div>

      <Link href="https://tyrrrz.me/donate">
        <HStack>
          <FiHeart />
          <div>Donate</div>
        </HStack>
      </Link>
    </footer>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div
      className={classNames([
        'flex',
        'flex-col',
        'min-h-screen',
        'border-y-8',
        'border-y-yellow-400',
        'bg-stone-900'
      ])}
    >
      <Head>
        <title>Spelling Ukraine</title>
        <meta
          name="description"
          content="Learn the correct way to spell Ukrainian cities, names, and other words in English."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Main>
        <Component {...pageProps} />
      </Main>

      <Footer />
    </div>
  );
};

export default App;
