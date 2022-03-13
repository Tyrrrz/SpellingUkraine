import type { NextPage } from 'next';
import { Link } from '../components/link';
import { Meta } from '../components/meta';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Meta title="Not Found" />

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
