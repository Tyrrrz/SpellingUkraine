import type { NextPage } from 'next';
import { Box } from '../components/box';
import { Meta } from '../components/meta';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Meta title="Not Found" />

      <Box classes={['p-6', 'border-2', 'border-neutral-400', 'rounded', 'bg-neutral-100']}>
        <Box classes={['text-3xl']}>Not Found</Box>
        <Box classes={['mt-2', 'text-xl', 'font-light']}>The page you requested does not exist</Box>
      </Box>
    </>
  );
};

export default NotFoundPage;
