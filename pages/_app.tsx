import './globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { GitHub } from 'react-feather';

const Header: React.FC = () => {
  return (
    <header className="p-8 bg-stone-900 space-y-4 text-center text-neutral-100">
      <div>
        <h1 className="text-5xl">
          <Link href="/" passHref>
            <a>
              <span>Spelling</span>
              <span className="line-through decoration-8 decoration-red-600">The</span>
              <span className="font-bold text-blue-500 underline underline-offset-4 decoration-8 decoration-yellow-400">
                Ukraine
              </span>
            </a>
          </Link>
        </h1>
      </div>

      <div className="text-2xl font-light tracking-wide">
        Language is political. Use it correctly.
      </div>
    </header>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <div className="flex flex-grow items-stretch border-y-8 border-t-blue-500 border-b-yellow-400 bg-white">
      <main className="container mx-auto p-8">{children}</main>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="flex p-3 place-content-center bg-stone-900 space-x-4 text-neutral-100">
      <a
        className="flex items-center space-x-2 hover:text-blue-500"
        href="https://github.com/Tyrrrz/SpellingUkraine"
      >
        <GitHub />
        <div>Source Code</div>
      </a>
    </footer>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex flex-col min-h-screen mx-auto">
      <Head>
        <title>Spelling Ukraine</title>
        <meta
          name="description"
          content="Correct romanization of Ukrainian cities, names, and other words"
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
