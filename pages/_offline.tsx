import classNames from 'classnames';
import type { NextPage } from 'next';
import { Meta } from '../components/meta';

const OfflinePage: NextPage = () => {
  return (
    <>
      <Meta title="Offline" />

      <div className={classNames('my-2', 'text-2xl', 'leading-wide')}>Offline</div>

      <div className={classNames('text-lg', 'font-light')}>Your device is currently offline</div>

      <div className={classNames('my-2')}>Please reconnect to the network to view this page</div>
    </>
  );
};

export default OfflinePage;
