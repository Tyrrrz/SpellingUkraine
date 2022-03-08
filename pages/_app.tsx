import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { ExternalLink, GitHub } from 'react-feather';

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
    <header className="p-16 border-b-2 space-y-4 text-center">
      <div>
        <h1 className="text-7xl font-bold">
          <Link href="/" passHref>
            <a>
              <span>Spelling</span>{' '}
              <span className="underline underline-offset-8 text-yellow-400 decoration-sky-600">
                Ukraine
              </span>
            </a>
          </Link>
        </h1>
      </div>

      <div className="text-4xl font-light tracking-wide">
        Language is political. Romanize correctly.
      </div>
    </header>
  );
};

const Main: React.FC = ({ children }) => {
  return <main className="p-8 bg-gray-50 shadow-inner">{children}</main>;
};

const Footer: React.FC = () => {
  return (
    <footer className="container my-8 mx-auto p-4 flex place-content-center space-x-4">
      <a
        className="flex items-center space-x-2 hover:text-sky-600"
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
    <div className="text-gray-800">
      <Meta />

      <div className="container mx-auto my-16 bg-white rounded-lg shadow">
        <Header />

        <Main>
          <Component {...pageProps} />
        </Main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
