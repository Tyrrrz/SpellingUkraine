import classNames from 'classnames';
import type { NextPage } from 'next';
import { Link } from '../components/link';
import { Meta } from '../components/meta';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Meta title="Not Found" />

      <div className={classNames('my-2', 'text-2xl', 'leading-wide')}>Not Found</div>

      <div className={classNames('text-lg', 'font-light')}>
        The page you requested does not exist
      </div>

      <div className={classNames('my-2')}>
        <Link href="/">Go to home page</Link>
      </div>
    </>
  );
};

export default NotFoundPage;
