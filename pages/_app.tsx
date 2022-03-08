import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { GitHub } from 'react-feather';

const Meta: React.FC = () => {
  return (
    <Head>
      <title>Spelling Ukraine</title>
      <meta
        name="description"
        content="Correct romanization of Ukrainian cities, names, and other words"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

const Header: React.FC = () => {
  return (
    <header className="p-16 border-t-8 border-t-blue-300 rounded-t-xl bg-neutral-50 space-y-4 text-center">
      <div>
        <h1 className="text-7xl">
          <Link href="/" passHref>
            <a>
              <span>Spelling</span>{' '}
              <span className="text-blue-500 font-bold underline underline-offset-[6px] decoration-4 decoration-wavy decoration-yellow-400">
                Ukraine
              </span>
            </a>
          </Link>
        </h1>
      </div>

      <div className="text-4xl font-light tracking-wide">
        Language is political. Transliterate correctly.
      </div>
    </header>
  );
};

const Main: React.FC = ({ children }) => {
  return <main className="p-8 border-y-2 bg-white">{children}</main>;
};

const Footer: React.FC = () => {
  return (
    <footer className="flex p-5 border-b-8 border-b-yellow-400 rounded-b-xl bg-neutral-50 place-content-center space-x-4">
      <a
        className="flex items-center space-x-2 hover:text-blue-500"
        href="https://github.com/Tyrrrz/SpellingUkraine"
      >
        <GitHub />
        <div>GitHub Repository</div>
      </a>
    </footer>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="container mx-auto my-16 rounded-xl shadow-lg text-neutral-800">
      <Meta />

      <Header />

      <Main>
        <Component {...pageProps} />
      </Main>

      <Footer />
    </div>
  );
};

export default App;
