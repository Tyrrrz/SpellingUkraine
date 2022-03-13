import type { NextPage } from 'next';
import Head from 'next/head';
import { Link } from '../components/link';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Not Found • Spelling Ukraine</title>
      </Head>

      <div className="space-y-2 text-center">
        <div className="text-4xl leading-wide">Not Found</div>
        <div className="text-2xl font-light">The page you requested does not exist</div>
        <div className="font-semibold">
          <Link href="/">Go to home page</Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
