import c from 'classnames';
import { NextPage } from 'next';
import Heading from '~/components/heading';
import Meta from '~/components/meta';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Meta title="Not Found" />

      <section>
        <Heading>Not Found</Heading>

        <div className={c('text-lg')}>The page you requested does not exist</div>
      </section>
    </>
  );
};

export default NotFoundPage;
