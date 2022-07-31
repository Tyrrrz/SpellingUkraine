import Heading from '@/components/heading';
import Meta from '@/components/meta';
import Page from '@/components/page';
import c from 'classnames';
import type { NextPage } from 'next';

const OfflinePage: NextPage = () => {
  return (
    <Page>
      <Meta title="Offline" />

      <section>
        <Heading>Offline</Heading>

        <div className={c('text-lg')}>Your device is currently offline</div>
        <div>Please reconnect to the network to view this page</div>
      </section>
    </Page>
  );
};

export default OfflinePage;
