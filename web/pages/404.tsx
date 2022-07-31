import Heading from '@/components/heading';
import Meta from '@/components/meta';
import Page from '@/components/page';
import c from 'classnames';
import type { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <Page>
      <Meta title="Not Found" />

      <section>
        <Heading>Not Found</Heading>

        <div className={c('text-lg')}>The page you requested does not exist</div>
      </section>
    </Page>
  );
};

export default NotFoundPage;
