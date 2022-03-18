import type { NextPage } from 'next';
import { Box } from '../components/box';
import { Meta } from '../components/meta';
import { Paper } from '../components/paper';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Meta title="Not Found" />

      <Paper>
        <Box classes={['text-3xl']}>Not Found</Box>
        <Box classes={['mt-2', 'text-xl', 'font-light']}>The page you requested does not exist</Box>
      </Paper>
    </>
  );
};

export default NotFoundPage;
